from pydantic import BaseModel, Field
from typing import Optional


class PredictionInput(BaseModel):
    crop: str = Field(..., example="Rice")
    state: str = Field(..., example="Punjab")
    district: str = Field(..., example="Ludhiana")
    season: str = Field(..., example="Rabi")
    area: float = Field(..., example=2.5)


class PredictionOutput(BaseModel):
    predicted_yield: float
    estimated_production: float
    unit: str
    crop: str
    state: str
    district: str
    season: str
    area: float

    used_district: Optional[str] = None
    prediction_mode: Optional[str] = None