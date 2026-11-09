from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Any, List
from app.database import get_db
from app.models.entities import AgronomistReview, ReviewStatus, User, UserRole

router = APIRouter(prefix="/api/reviews", tags=["Agronomist Review"])

def ensure_agronomist_user(db: Session) -> User:
    user = db.query(User).filter(User.role == UserRole.AGRONOMIST).first()
    if not user:
        user = User(
            email="agronomist@soldoc.eg",
            hashed_password="mock_hashed_pw",
            full_name="Eng. Ahmed El-Shennawy",
            role=UserRole.AGRONOMIST
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    return user

@router.get("/")
def list_reviews(db: Session = Depends(get_db)):
    reviews = db.query(AgronomistReview).order_by(AgronomistReview.id.desc()).all()
    return [{
        "id": r.id,
        "field_id": r.field_id,
        "status": r.status.value,
        "notes": r.comments,
        "recommendation_approved": r.recommendation_approved,
        "assumptions_verified": r.assumptions_verified,
        "created_at": r.created_at.isoformat() if r.created_at else None
    } for r in reviews]

@router.post("/")
def submit_review(payload: Dict[str, Any], db: Session = Depends(get_db)):
    agronomist = ensure_agronomist_user(db)
    field_id = payload.get("field_id", 1)
    status_str = payload.get("status", "approved").lower()

    status_map = {
        "pending": ReviewStatus.PENDING,
        "approved": ReviewStatus.APPROVED,
        "changes_requested": ReviewStatus.CHANGES_REQUESTED,
        "rejected": ReviewStatus.REJECTED
    }
    status_enum = status_map.get(status_str, ReviewStatus.APPROVED)

    review = AgronomistReview(
        field_id=field_id,
        agronomist_id=agronomist.id,
        status=status_enum,
        comments=payload.get("notes", "Peer-reviewed against Egyptian Nile Delta agro-meteorological guidelines."),
        recommendation_approved=payload.get("recommendation_approved", True),
        assumptions_verified=payload.get("assumptions_verified", True)
    )
    db.add(review)
    db.commit()
    db.refresh(review)
    return {
        "id": review.id,
        "field_id": review.field_id,
        "status": review.status.value,
        "notes": review.comments,
        "recommendation_approved": review.recommendation_approved,
        "assumptions_verified": review.assumptions_verified,
        "created_at": review.created_at.isoformat() if review.created_at else None
    }
