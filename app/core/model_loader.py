import tensorflow as tf
import os
import numpy as np

# Paths to artifacts (relative to the app directory)
MODEL_DIR = os.path.join(os.path.dirname(__file__), "..", "assets", "model")
MODEL_PATH = os.path.join(MODEL_DIR, "ann_model.keras")

class SmartphoneModel:
    def __init__(self):
        self.model = None
        self._load_model()

    def _load_model(self):
        """Loads the Keras ANN model from disk, supporting both .keras and .h5."""
        h5_path = os.path.join(MODEL_DIR, "ann_model.h5")
        keras_path = os.path.join(MODEL_DIR, "ann_model.keras")
        
        target_path = h5_path if os.path.exists(h5_path) else keras_path

        try:
            if os.path.exists(target_path):
                # Using compile=False as we only need the model for inference
                self.model = tf.keras.models.load_model(target_path, compile=False)
                print(f"✅ Model loaded successfully from {target_path}")
            else:
                print(f"⚠️ Model file not found at {target_path}")
        except Exception as e:
            print(f"❌ Error loading model: {str(e)}")

    def predict(self, processed_data: np.ndarray) -> tuple:
        """
        Performs inference on processed data.
        Returns: (predicted_class, confidence)
        """
        if self.model is None:
            # Fallback for dev mode/missing model
            return 0, 0.0

        # Perform prediction
        predictions = self.model.predict(processed_data, verbose=0)
        
        # Get the class with the highest probability
        predicted_class = int(np.argmax(predictions, axis=1)[0])
        confidence = float(np.max(predictions, axis=1)[0])
        
        return predicted_class, confidence
