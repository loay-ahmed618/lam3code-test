from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.entities import User, UserRole
from app.schemas import UserRegister, UserLogin, Token
from app.auth_utils import verify_password, get_password_hash, create_access_token, get_current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/register", response_model=Token)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_pwd = get_password_hash(user_data.password)
    new_user = User(
        email=user_data.email,
        hashed_password=hashed_pwd,
        full_name=user_data.full_name,
        role=user_data.role or UserRole.FARMER
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    token = create_access_token(data={"sub": new_user.email, "role": new_user.role.value, "id": new_user.id})
    return {"access_token": token, "token_type": "bearer", "user_id": new_user.id, "email": new_user.email, "full_name": new_user.full_name, "role": new_user.role.value}

@router.post("/login", response_model=Token)
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_data.email).first()
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    token = create_access_token(data={"sub": user.email, "role": user.role.value, "id": user.id})
    return {"access_token": token, "token_type": "bearer", "user_id": user.id, "email": user.email, "full_name": user.full_name, "role": user.role.value}

@router.get("/me")
def get_profile(current_user: User = Depends(get_current_user)):
    return {"id": current_user.id, "email": current_user.email, "full_name": current_user.full_name, "role": current_user.role.value}
