from fastapi import APIRouter
from app.db.database import history_collection

router = APIRouter()


@router.get("/history")
def get_history():
    docs = list(
        history_collection.find(
            {},
            {"_id": 0}
        ).sort("created_at", -1).limit(100)
    )

    for doc in docs:
        if "created_at" in doc:
            doc["date"] = doc["created_at"].isoformat() + "Z"
            del doc["created_at"]

    return docs