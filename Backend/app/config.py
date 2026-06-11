import os

class Settings:
    PROJECT_NAME: str = "CV Checker API"
    MODEL_NAME: str = "all-mpnet-base-v2"

    @property
    def CORS_ORIGINS(self) -> list[str]:
        origins = os.getenv("CORS_ORIGINS")
        if origins:
            return [origin.strip() for origin in origins.split(",") if origin.strip()]

        return [
            "http://localhost:5173",
            "http://127.0.0.1:5173"
        ]

settings = Settings()
