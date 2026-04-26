from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.predict import router as predict_router
from app.routes.history import router as history_router

app = FastAPI(
    title="Crop Yield Prediction API",
    description="AI Crop Yield Prediction Backend",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {
        "message": "Crop Yield Prediction API Running",
        "status": "success"
    }

@app.get("/health")
def health():
    return {
        "server": "running",
        "status": "healthy"
    }

app.include_router(predict_router, tags=["Prediction"])

app.include_router(history_router, tags=["History"])