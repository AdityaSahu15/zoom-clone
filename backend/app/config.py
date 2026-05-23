from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    SECRET_KEY: str = "zoom_clone_super_secret_key_change_in_production_2024"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    DATABASE_URL: str = "sqlite:///./zoom_clone.db"
    FRONTEND_URL: str = "http://localhost:3000"

    model_config = {"env_file": ".env"}


@lru_cache()
def get_settings():
    return Settings()
