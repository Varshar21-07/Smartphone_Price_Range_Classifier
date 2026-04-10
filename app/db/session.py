from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Connection logic: Try Postgres, fallback to SQLite for easy local development
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://localhost/smartphone_db")

try:
    # Try connecting to Postgres
    engine = create_engine(DATABASE_URL)
    # Test the connection quickly
    engine.connect()
except Exception:
    # Fallback to local SQLite if Postgres is not running or DB doesn't exist
    print("⚠️ PostgreSQL not found. Falling back to local SQLite for demo/testing.")
    DATABASE_URL = "sqlite:///./smartphone.db"
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    """Dependency for getting DB session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
