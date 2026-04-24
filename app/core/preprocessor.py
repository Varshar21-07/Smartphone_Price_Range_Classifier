class SmartphonePreprocessor:
    def __init__(self):
        self.scaler = None
        self.feature_order = ['battery_power','dual_sim','fc','four_g',
                              'int_memory','mobile_wt','pc','ram',
                              'talk_time','pixel_density','screen_area',
                              'ram_category']

    def _lazy_load_scaler(self):
        """Loads the scaler only when needed to save memory and startup time."""
        if self.scaler is None:
            import pickle
            import os
            MODEL_DIR = os.path.join(os.path.dirname(__file__), "..", "assets", "model")
            scaler_path = os.path.join(MODEL_DIR, "scaler.pkl")
            try:
                with open(scaler_path, "rb") as f:
                    self.scaler = pickle.load(f)
                print("✅ Scaler loaded.")
                import gc
                gc.collect()
            except Exception as e:
                print(f"❌ Error loading scaler: {e}")

    def transform(self, data: dict):
        """
        Main pipeline to transform raw input into model-ready features.
        Matches EXACTLY the provided logic for deployment.
        """
        import pandas as pd
        import numpy as np
        
        # Create DataFrame
        df = pd.DataFrame([data])
        
        # 1. Feature Engineering
        # Pixel density = Resolution (as requested)
        df['pixel_density'] = df['px_width'] * df['px_height']
        df['screen_area']   = df['sc_h'] * df['sc_w']
        
        # 2. Drop specific columns
        drop_cols = ['blue','wifi','touch_screen','m_dep',
                     'clock_speed','n_cores','px_width',
                     'px_height','sc_h','sc_w','three_g']
        df = df.drop(columns=[c for c in drop_cols if c in df.columns], errors='ignore')
        
        # 3. RAM category (Exact bins and labels)
        df['ram_category'] = pd.cut(
            df['ram'],
            bins=[0, 1000, 2000, 3000, 4000],
            labels=[0, 1, 2, 3]
        ).astype(int)
        
        # 4. Exact feature order
        df = df[self.feature_order]
        
        # 5. Scaling (Lazy load)
        self._lazy_load_scaler()
        if self.scaler:
            return self.scaler.transform(df)
            
        return df.values

    def transform_batch(self, df):
        """
        Vectorized transformation for a whole DataFrame.
        """
        import pandas as pd
        import numpy as np
        
        df = df.copy()
        
        # 1. Feature Engineering
        df['pixel_density'] = df['px_width'] * df['px_height']
        df['screen_area']   = df['sc_h'] * df['sc_w']
        
        # 3. RAM category
        df['ram_category'] = pd.cut(
            df['ram'],
            bins=[0, 1000, 2000, 3000, 4000],
            labels=[0, 1, 2, 3]
        ).astype(int)
        
        # 4. Exact feature order
        df = df[self.feature_order]
        
        # 5. Scaling
        self._lazy_load_scaler()
        if self.scaler:
            return self.scaler.transform(df)
        return df.values
