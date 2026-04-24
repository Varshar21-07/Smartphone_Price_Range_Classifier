# Start of API file
from fastapi import FastAPI, HTTPException, Depends, UploadFile, File
from sqlalchemy.orm import Session
import pandas as pd
import io

import app.schemas as schemas
from app.core.preprocessor import SmartphonePreprocessor
from app.core.model_loader import SmartphoneModel
from app.db import models, session

# Initialize FastAPI app
app = FastAPI(
    title="Smartphone Price Classifier API",
    description="High-performance API for smartphone price range prediction using ANN.",
    version="1.0.0"
)

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "http://127.0.0.1:5173", 
        "https://smartphone-price-range-classifier.vercel.app", 
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Global placeholders for lazy loading
_preprocessor = None
_model = None

def get_components():
    """Helper to lazy-load and cache components to ensure fast startup on Render."""
    global _preprocessor, _model
    if _preprocessor is None:
        from app.core.preprocessor import SmartphonePreprocessor
        _preprocessor = SmartphonePreprocessor()
    if _model is None:
        from app.core.model_loader import SmartphoneModel
        _model = SmartphoneModel()
    return _preprocessor, _model

# Create database tables (at startup is fine as it's typically fast)
models.Base.metadata.create_all(bind=session.engine)

@app.get("/")
async def root():
    return {"message": "Smartphone Price Classifier Backend is operational!"}

@app.get("/health")
async def health():
    prep, mod = get_components()
    return {"status": "healthy", "model_loaded": mod.model is not None}

@app.post("/predict", response_model=schemas.PredictionResponse)
async def predict_single(specs: schemas.SmartphoneSpecs, db: Session = Depends(session.get_db)):
    """
    Predict price range for a single smartphone spec.
    Stores the result in PostgreSQL for tracking.
    """
    try:
        # 1. Get components
        prep, mod = get_components()
        
        # 2. Preprocess
        raw_data = specs.dict()
        processed_data = prep.transform(raw_data)
        
        # 3. Predict
        predicted_class, confidence = mod.predict(processed_data)
        
        # 3. Save to DB
        db_record = models.PredictionRecord(
            battery_power=specs.battery_power,
            ram=specs.ram,
            int_memory=specs.int_memory,
            predicted_range=predicted_class,
            confidence=confidence
        )
        db.add(db_record)
        db.commit()
        
        return {
            "price_range": predicted_class,
            "confidence": confidence,
            "message": "Prediction successful and recorded."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict-batch", response_model=schemas.BatchPredictionResponse)
async def predict_batch(file: UploadFile = File(...), db: Session = Depends(session.get_db)):
    """
    Upload a CSV file with multiple smartphone specs and get batch predictions.
    """
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed.")
    
    try:
        # 1. Get components
        prep, mod = get_components()
        
        contents = await file.read()
        df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
        
        # 2. Vectorized transformation
        # We transform the entire DataFrame at once for efficiency
        processed_data_batch = prep.transform_batch(df)
        
        # 3. Vectorized prediction
        predictions_raw = mod.predict_batch(processed_data_batch)
        
        results = []
        db_records = []
        for i in range(len(df)):
            predicted_class, confidence = predictions_raw[i]
            results.append({
                "price_range": predicted_class,
                "confidence": confidence
            })
            
            # Map raw data back for database storage (Subset of core features)
            row_dict = df.iloc[i].to_dict()
            db_records.append(models.PredictionRecord(
                battery_power=int(row_dict.get('battery_power', 0)),
                ram=int(row_dict.get('ram', 0)),
                int_memory=int(row_dict.get('int_memory', 0)),
                predicted_range=predicted_class,
                confidence=confidence
            ))
            
        # Bulk save to database
        try:
            db.add_all(db_records)
            db.commit()
            print(f"✅ Successfully recorded {len(db_records)} batch predictions.")
        except Exception as db_err:
            print(f"⚠️ Database batch save failed: {db_err}")
            db.rollback()
        
        # 4. Cleanup
        import gc
        gc.collect()
        
        return {
            "predictions": results,
            "total_processed": len(results)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Batch processing error: {str(e)}")

@app.get("/model-info", response_model=schemas.ModelInfoResponse)
async def get_model_info():
    """
    Get metadata about the current model stored in assets.
    """
    return schemas.ModelInfoResponse()

@app.get("/metrics", response_model=schemas.MetricsResponse)
async def get_metrics(db: Session = Depends(session.get_db)):
    """
    Get basic distribution metrics from prediction history.
    """
    total = db.query(models.PredictionRecord).count()
    if total == 0:
        return schemas.MetricsResponse(total_predictions=0, distribution={})
    
    # Simple distribution calc
    records = db.query(models.PredictionRecord).all()
    dist = {}
    for r in records:
        # Convert to string keys for JSON compatibility if needed, 
        # but schemas expects a dict which usually handles int keys or string keys
        dist[str(r.predicted_range)] = dist.get(str(r.predicted_range), 0) + 1
        
    return schemas.MetricsResponse(
        total_predictions=total,
        distribution=dist
    )
