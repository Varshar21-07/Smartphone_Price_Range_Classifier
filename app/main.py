# Start of API file
from fastapi import FastAPI, HTTPException, Depends, UploadFile, File
from sqlalchemy.orm import Session
import pandas as pd
import io

from app.schemas import SmartphoneSpecs, PredictionResponse, BatchPredictionResponse
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
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Initialize Core components (Load once)
preprocessor = SmartphonePreprocessor()
model = SmartphoneModel()

# Create database tables (For dev purposes code-first approach)
models.Base.metadata.create_all(bind=session.engine)

@app.get("/")
async def root():
    return {"message": "Smartphone Price Classifier Backend is operational!"}

@app.get("/health")
async def health():
    return {"status": "healthy", "model_loaded": model.model is not None}

@app.post("/predict", response_model=PredictionResponse)
async def predict_single(specs: SmartphoneSpecs, db: Session = Depends(session.get_db)):
    """
    Predict price range for a single smartphone spec.
    Stores the result in PostgreSQL for tracking.
    """
    try:
        # 1. Preprocess
        raw_data = specs.dict()
        processed_data = preprocessor.transform(raw_data)
        
        # 2. Predict
        predicted_class, confidence = model.predict(processed_data)
        
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

@app.post("/predict-batch", response_model=BatchPredictionResponse)
async def predict_batch(file: UploadFile = File(...), db: Session = Depends(session.get_db)):
    """
    Upload a CSV file with multiple smartphone specs and get batch predictions.
    """
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed.")
    
    try:
        contents = await file.read()
        df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
        
        results = []
        for _, row in df.iterrows():
            # Matches the schema keys
            raw_data = row.to_dict()
            processed_data = preprocessor.transform(raw_data)
            predicted_class, confidence = model.predict(processed_data)
            
            results.append({
                "price_range": predicted_class,
                "confidence": confidence
            })
            
            # Record individual prediction (Optional, can be batch saved for efficiency)
            db_record = models.PredictionRecord(
                battery_power=int(row.get('battery_power', 0)),
                ram=int(row.get('ram', 0)),
                int_memory=int(row.get('int_memory', 0)),
                predicted_range=predicted_class,
                confidence=confidence
            )
            db.add(db_record)
            
        db.commit()
        
        return {
            "predictions": results,
            "total_processed": len(results)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Batch processing error: {str(e)}")

@app.get("/metrics")
async def get_metrics(db: Session = Depends(session.get_db)):
    """
    Get basic distribution metrics from prediction history.
    """
    total = db.query(models.PredictionRecord).count()
    if total == 0:
        return {"total_predictions": 0, "distribution": {}}
    
    # Simple distribution calc (Can be optimized with direct SQL group by)
    records = db.query(models.PredictionRecord).all()
    dist = {}
    for r in records:
        dist[r.predicted_range] = dist.get(r.predicted_range, 0) + 1
        
    return {
        "total_predictions": total,
        "distribution": dist
    }
