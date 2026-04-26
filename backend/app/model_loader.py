import joblib
import os

# backend/app/model_loader.py

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "models")

# Load final XGBoost model
model = joblib.load(
    os.path.join(MODEL_DIR, "crop_yield_xgb_model.pkl")
)

# Load Ordinal Encoder
encoder = joblib.load(
    os.path.join(MODEL_DIR, "crop_yield_encoder.pkl")
)