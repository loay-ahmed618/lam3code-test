from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import auth, farms, environmental, goals, strategies, analytics, reviews

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SOLDOC Agricultural Decision Support API",
    description="Backend engine for NASA-data-powered agricultural decision support platform.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(farms.router)
app.include_router(environmental.router)
app.include_router(goals.router)
app.include_router(strategies.router)
app.include_router(analytics.router)
app.include_router(reviews.router)

@app.get("/")
def root():
    return {
        "platform": "SOLDOC",
        "description": "Virtual Farm & Agricultural Decision Support Platform",
        "version": "1.0.0",
        "bilingual_support": ["ar", "en"]
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "database": "connected",
        "nasa_power_integration": "active"
    }
