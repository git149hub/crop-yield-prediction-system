

import { useState, FormEvent } from "react";
import {predictYield, saveToLocalHistory, PredictResponse, } from "../services/predictApi";
import LoadingSpinner from "./LoadingSpinner";
import ResultBox from "./ResultBox";
import "./PredictionForm.css";

const CROP_TYPES = [
  "Rice","Wheat","Maize","Sugarcane","Cotton","Soybean","Groundnut","Pulses","Bajra","Jowar","Ragi","Barley","Sunflower",
  "Mustard","Jute","Tobacco",
];

const STATES = ["Andhra Pradesh","Assam","Bihar","Chhattisgarh","Gujarat","Haryana","Himachal Pradesh","Jharkhand",
  "Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Odisha","Punjab","Rajasthan","Tamil Nadu",
  "Telangana","Uttar Pradesh","Uttarakhand","West Bengal",
];

const SEASONS = [
  "Kharif",
  "Rabi",
  "Summer",
  "Winter",
  "Whole Year",
  "Autumn",
];

export default function PredictionForm() {
  const [cropType, setCropType] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [season, setSeason] = useState("");
  const [area, setArea] = useState("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleReset = () => {
    setCropType("");
    setState("");
    setDistrict("");
    setSeason("");
    setArea("");
    setResult(null);
    setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!cropType || !state || !district || !season || !area) {
      setError("Please fill in all fields before predicting.");
      return;
    }

    const areaNum = parseFloat(area);

    if (isNaN(areaNum) || areaNum <= 0) {
      setError("Please enter a valid area value greater than 0.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await predictYield({
        crop: cropType,
        state,
        district,
        season,
        area: areaNum,
      });

      setResult(response);

      saveToLocalHistory({
        crop: cropType,
        state,
        district,
        season,
        area: areaNum,
        predicted_yield: response.predicted_yield,
        estimated_production: response.estimated_production,
        unit: response.unit,
      });
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as {
          response?: { data?: { detail?: string } };
        };

        setError(
          axiosError.response?.data?.detail ||
            "Unable to get prediction. Please check your input and try again."
        );
      } else if (err instanceof Error) {
        if (
          err.message.includes("Network Error") ||
          err.message.includes("ECONNREFUSED")
        ) {
          setError(
            "Cannot connect to backend server. Please ensure FastAPI is running on localhost:8000."
          );
        } else {
          setError(err.message);
        }
      } else {
        setError("Unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-card">
      <div className="form-card-header">
        <div className="form-card-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2-8 2s.5-2 3-3C16 2 17 8 17 8z"
              fill="white"
            />
          </svg>
        </div>

        <div>
          <h2 className="form-card-title">Predict Your Yield</h2>
          <p className="form-card-subtitle">Fill in the details below</p>
        </div>
      </div>

      <form className="prediction-form" onSubmit={handleSubmit}>
        {/* Crop */}
        <div className="form-group">
          <label className="form-label">Crop Type</label>

          <div className="select-wrapper">
            <select
              className="form-select"
              value={cropType}
              onChange={(e) => setCropType(e.target.value)}
            >
              <option value="">Select a crop...</option>

              {CROP_TYPES.map((crop) => (
                <option key={crop} value={crop}>
                  {crop}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* State */}
        <div className="form-group">
          <label className="form-label">State</label>

          <div className="select-wrapper">
            <select
              className="form-select"
              value={state}
              onChange={(e) => setState(e.target.value)}
            >
              <option value="">Select a state...</option>

              {STATES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* District */}
        <div className="form-group">
          <label className="form-label">District</label>

          <input
            type="text"
            className="form-input"
            placeholder="Enter district"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
          />
        </div>

        {/* Season */}
        <div className="form-group">
          <label className="form-label">Season</label>

          <div className="select-wrapper">
            <select
              className="form-select"
              value={season}
              onChange={(e) => setSeason(e.target.value)}
            >
              <option value="">Select a season...</option>

              {SEASONS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Area */}
        <div className="form-group">
          <label className="form-label">Area (hectares)</label>

          <input
            type="number"
            className="form-input"
            placeholder="e.g. 2.5"
            min="0.01"
            step="0.01"
            value={area}
            onChange={(e) => setArea(e.target.value)}
          />
        </div>

        {/* Error */}
        {error && <div className="error-box">{error}</div>}

        {/* Loading */}
        {loading && <LoadingSpinner />}

        {/* Result */}
        {result && !loading && (
          <ResultBox
            yieldValue={result.predicted_yield}
            production={result.estimated_production}
            unit={result.unit}
          />
        )}

        {/* Buttons */}
        <div className="form-actions">
          <button type="submit" className="btn-predict" disabled={loading}>
            {loading ? "Predicting..." : "Predict Yield"}
          </button>

          <button
            type="button"
            className="btn-reset"
            onClick={handleReset}
            disabled={loading}
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
