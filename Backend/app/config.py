import os

class Settings:
    PROJECT_NAME: str = "CV Checker API"
    MODEL_NAME: str = "all-mpnet-base-v2"
    
    # In production, these should come from an environment file (.env)
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ]

settings = Settings()