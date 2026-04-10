from sqlalchemy import Column, Integer, Float, String, DateTime
from datetime import datetime
from .session import Base

class PredictionRecord(Base):
    """
    SQLAlchemy model for storing prediction history.
    """
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    battery_power = Column(Integer)
    ram = Column(Integer)
    int_memory = Column(Integer)
    # Storing combined engineered features or raw ones
    predicted_range = Column(Integer)
    confidence = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow)
