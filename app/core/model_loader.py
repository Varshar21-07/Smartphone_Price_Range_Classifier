import os
import numpy as np

# Paths to artifacts (relative to the app directory)
MODEL_DIR = os.path.join(os.path.dirname(__file__), "..", "assets", "model")

class SmartphoneModel:
    def __init__(self):
        self.model = None

    def _lazy_load_model(self):
        """Loads the Keras ANN model only when needed to optimize startup."""
        if self.model is None:
            import tensorflow as tf
            h5_path = os.path.abspath(os.path.join(MODEL_DIR, "ann_model.h5"))
            keras_path = os.path.abspath(os.path.join(MODEL_DIR, "ann_model.keras"))
            
            target_path = h5_path if os.path.exists(h5_path) else keras_path

            try:
                if os.path.exists(target_path):
                    self.model = tf.keras.models.load_model(target_path, compile=False)
                    print(f"✅ Model loaded successfully.")
                else:
                    print(f"⚠️ Model file not found at {target_path}")
            except Exception as e:
                print(f"❌ Error loading model: {e}")
                import traceback
                traceback.print_exc()

    def predict(self, processed_data):
        """
        Performs inference on processed data.
        Returns: (predicted_class, confidence)
        """
        self._lazy_load_model()
        if self.model is None:
            print("❌ Prediction failed: Model not loaded.")
            return 0, 0.0
            
        try:
            prediction = self.model.predict(processed_data, verbose=0)
            predicted_class = int(np.argmax(prediction[0]))
            confidence = float(np.max(prediction[0]))
            return predicted_class, confidence
        except Exception as e:
            print(f"❌ Error during inference: {e}")
            return 0, 0.0
