import os
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = os.path.abspath(os.path.dirname(__file__))


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-change-me")

    JWT_ALGORITHM = "HS256"
    JWT_EXP_MINUTES = int(os.getenv("JWT_EXP_MINUTES", 60))

    SQLITE_DB_PATH = os.getenv(
        "SQLITE_DB_PATH", os.path.join(BASE_DIR, "instance", "elearning.db")
    )

    FRONTEND_URLS = os.getenv("FRONTEND_URLS", "http://localhost:5173").split(",")
