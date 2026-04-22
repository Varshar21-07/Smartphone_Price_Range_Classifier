from pydantic import BaseModel, Field
from typing import List, Optional

class SmartphoneSpecs(BaseModel):
    """
    Input schema for a single smartphone prediction.
    Field names match the original dataset provided in the notebook.
    """
    battery_power: int = Field(..., example=842)
    dual_sim: int = Field(..., example=0)
    fc: int = Field(..., example=1)
    four_g: int = Field(..., example=0)
    int_memory: int = Field(..., example=7)
    mobile_wt: int = Field(..., example=188)
    pc: int = Field(..., example=2)
    px_height: int = Field(..., example=20)
    px_width: int = Field(..., example=756)
    ram: int = Field(..., example=2549)
    sc_h: int = Field(..., example=9)
    sc_w: int = Field(..., example=7)
    talk_time: int = Field(..., example=19)

class PredictionResponse(BaseModel):
    """
    Output schema for a prediction result.
    """
    price_range: int
    confidence: float
    message: str = "Prediction successful"

class BatchPredictionResponse(BaseModel):
    """
    Output schema for multiple predictions.
    """
    predictions: List[dict]
    total_processed: int

class ModelInfoResponse(BaseModel):
    """
    Metadata about the current model.
    """
    name: str = "Smartphone ANN Classifier"
    version: str = "1.0.0"
    accuracy: float = 0.93
    classes: List[str] = ["Budget", "Low-Mid", "Mid-High", "Premium"]

class MetricsResponse(BaseModel):
    """
    System usage metrics.
    """
    total_predictions: int
    distribution: dict
    accuracy: float = 0.93
