import numpy as np

import pandas as pd
import pickle
import os

# Paths to artifacts (relative to the app directory)
MODEL_DIR = os.path.join(os.path.dirname(__file__), "..", "assets", "model")

class SmartphonePreprocessor:
    def __init__(self):
        self.scaler = None
        self.feature_order = None
        self.dropped_features = None
        self._load_artifacts()

    def _load_artifacts(self):
        """Loads the scaler and feature lists saved from the notebook."""
        try:
            with open(os.path.join(MODEL_DIR, "scaler.pkl"), "rb") as f:
                self.scaler = pickle.load(f)
            with open(os.path.join(MODEL_DIR, "feature_order.pkl"), "rb") as f:
                self.feature_order = pickle.load(f)
            with open(os.path.join(MODEL_DIR, "dropped_features.pkl"), "rb") as f:
                self.dropped_features = pickle.load(f)
        except FileNotFoundError:
            print("Warning: Model artifacts not found. Preprocessing will fail until files are uploaded.")

    def transform(self, data: dict) -> np.ndarray:
        """
        Main pipeline to transform raw input into model-ready features.
        """
        # Convert dict to DataFrame for easier manipulation
        df = pd.DataFrame([data])

        # 1. Feature Engineering (Matches Notebook Step 5)
        # Note: Added 1 to avoid division by zero or log(0)
        df['screen_area'] = df['sc_h'] * df['sc_w']
        # Pixel density approximation
        df['pixel_density'] = np.sqrt(df['px_height']**2 + df['px_width']**2) / (np.sqrt(df['sc_h']**2 + df['sc_w']**2) + 1)


        # 1.1 RAM Binning
        df['ram_category'] = pd.cut(
            df['ram'],
            bins=[0, 1000, 2000, 3000, 4000],
            labels=[0, 1, 2, 3],
            include_lowest=True
        ).astype(int)
        
        # 2. Log Transformations (Matches Notebook Step 7)
        # We apply log1p (log(1+x)) to handle skewed features as done in training
        skewed_features = ['pixel_density', 'screen_area']
        for col in skewed_features:
            df[col] = np.log1p(df[col])

        # 3. Drop Features
        if self.dropped_features:
            df = df.drop(columns=self.dropped_features, errors='ignore')

        # 4. Reorder columns to match EXACT order expected by the model
        if self.feature_order:
            df = df[self.feature_order]

        # 5. Scaling
        if self.scaler:
            # According to fe_config.pkl, scale_all is True for this new model
            df[df.columns] = self.scaler.transform(df[df.columns])
            
        return df.values
