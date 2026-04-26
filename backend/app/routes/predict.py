from fastapi import APIRouter, HTTPException
import pandas as pd
import numpy as np
import difflib

import json
import os

from app.schemas import PredictionInput, PredictionOutput
from app.model_loader import model, encoder

from app.db.database import history_collection
from datetime import datetime

router = APIRouter()

# Load India Locations JSON
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
DATA_PATH = os.path.join(BASE_DIR, "data", "indiaLocations.json")

with open(DATA_PATH, "r", encoding="utf-8") as f:
    INDIA_LOCATIONS = json.load(f)

# Allowed seasons from dataset
VALID_SEASONS = [
    "Kharif",
    "Rabi",
    "Whole Year",
    "Summer",
    "Winter",
    "Autumn"
]


@router.post("/predict", response_model=PredictionOutput)
def predict(input_data: PredictionInput):
    try:
        # Clean input
        crop = input_data.crop.strip().title()
        state = input_data.state.strip().title()
        district = input_data.district.strip().title()
        season = input_data.season.strip().title()
        area = float(input_data.area)

        # EMPTY FIELD CHECK
        # -------------------
        if not crop:
            raise HTTPException(status_code=400, detail="Crop is required")

        if not state:
            raise HTTPException(status_code=400, detail="State is required")

        if not district:
            raise HTTPException(status_code=400, detail="District is required")

        if not season:
            raise HTTPException(status_code=400, detail="Season is required")
        

        # -------------------------
        # State / District Validation
        # -------------------------

        # State must exist in JSON
        if state not in INDIA_LOCATIONS:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid state: {state}"
            )

        # If district belongs to another known state, reject
        all_known_districts = []
        for s, districts in INDIA_LOCATIONS.items():
            all_known_districts.extend(districts)

        if district in all_known_districts:
            if district not in INDIA_LOCATIONS[state]:
                raise HTTPException(
                    status_code=400,
                    detail=f"{district} does not belong to {state}"
                )

        if area <= 0:
            raise HTTPException(
                status_code=400,
                detail="Area must be greater than 0"
            )

        if area > 1000000:
            raise HTTPException(
                status_code=400,
                detail="Area too large. Please enter realistic value."
            )

        if season not in VALID_SEASONS:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid season. Allowed: {VALID_SEASONS}"
            )        

        # Auto Year
        year = 2024

        # Feature Engineering
        area_log = np.log1p(area)
        year_group = (year // 5) * 5
        crop_state = crop + "_" + state
        crop_season = crop + "_" + season

        # Build DataFrame
        input_df = pd.DataFrame([{
            "State_Name": state,
            "District_Name": district,
            "Crop_Year": year,
            "Season": season,
            "Crop": crop,
            "Area": area,
            "Area_log": area_log,
            "Year_Group": year_group,
            "Crop_State": crop_state,
            "Crop_Season": crop_season
        }])

        # Encode categorical columns
        cat_cols = [
            "State_Name",
            "District_Name",
            "Season",
            "Crop",
            "Crop_State",
            "Crop_Season"
        ]

        # Validate main fields first
        field_map = {
            "Crop": "crop",
            "State_Name": "state",
            "District_Name": "district",
            "Season": "season"
        }

        main_cols = ["Crop", "State_Name"]

        for col in main_cols:
            idx = cat_cols.index(col)
            val = input_df[col].iloc[0]
            known = encoder.categories_[idx]

            if val not in known:
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid {field_map[col]}: {val}"
                )
            

        # -------------------------
        # District Fallback Logic
        # -------------------------
        requested_district = district

        idx = cat_cols.index("District_Name")
        known_districts = encoder.categories_[idx]
       

        prediction_mode = "exact"


        if district not in known_districts:

          raw_fallback = INDIA_LOCATIONS[state][0].upper()

          # Find closest encoder district match
          match = difflib.get_close_matches(
              raw_fallback,
              known_districts,
              n=1,
              cutoff=0.6
          )

          if match:
              district = match[0]
              prediction_mode = "fallback"
          else:
              district = known_districts[0]
              prediction_mode = "global_fallback"

        # Update dataframe with used district
        input_df["District_Name"] = district    


        # Crop_State
        idx_cs = cat_cols.index("Crop_State")
        known_cs = encoder.categories_[idx_cs]

        if crop_state not in known_cs:
           crop_state = known_cs[0]

        # Crop_Season
        idx_cse = cat_cols.index("Crop_Season")
        known_cse = encoder.categories_[idx_cse]

        if crop_season not in known_cse:
            crop_season = known_cse[0]

        # Update dataframe
        input_df["Crop_State"] = crop_state
        input_df["Crop_Season"] = crop_season

        try:
            input_df[cat_cols] = encoder.transform(input_df[cat_cols])

        except Exception:
            raise HTTPException(
                status_code=400,
                detail="Invalid crop/state/district combination or unknown category value"
            )


        # Predict log yield
        pred_log = model.predict(input_df)[0]

        # Reverse log transform
        predicted_yield = float(np.expm1(pred_log))
        predicted_yield = round(max(predicted_yield, 0), 2)

        if predicted_yield > 500:
            predicted_yield = 500

        # Total production
        estimated_production = round(
            predicted_yield * area, 2
        )

        # Save to MongoDB
        history_doc = {
            "crop": crop,
            "state": state,
            "district": requested_district,
            "season": season,
            "area": area,
            "predicted_yield": predicted_yield,
            "estimated_production": estimated_production,
            "unit": "tons/hectare",
            "used_district": district,
            "prediction_mode": prediction_mode,
            "created_at": datetime.utcnow()
        }

        history_collection.insert_one(history_doc)

        # Keep latest 100 records only
        total = history_collection.count_documents({})

        if total > 100:
            extra = total - 100

            old_docs = history_collection.find().sort(
                "created_at", 1
            ).limit(extra)

            ids = [doc["_id"] for doc in old_docs]

            if ids:
                history_collection.delete_many(
                    {"_id": {"$in": ids}}
                )

        return {
            "predicted_yield": predicted_yield,
            "estimated_production": estimated_production,
            "unit": "tons/hectare",
            "crop": crop,
            "state": state,
            "district": requested_district,
            "season": season,
            "area": area,
            "used_district": district,
            "prediction_mode": prediction_mode
        }

    except HTTPException as e:
        raise e    

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )