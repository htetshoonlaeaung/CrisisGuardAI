# backend/app/core/config.py
# App-wide settings loaded from environment variables using Pydantic BaseSettings.
# Includes Neon DATABASE_URL, app name, debug flag, and CORS origins.

from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "CrisisGuard AI"
    DEBUG: bool = False
    DATABASE_URL: str  # Neon Serverless PostgreSQL connection string
    CORS_ORIGINS: list[str] = ["http://localhost:3000"]

    class Config:
        env_file = ".env"

settings = Settings()
