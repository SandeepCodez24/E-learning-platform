import os
from flask import Flask
from flask_cors import CORS

from config import Config


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    os.makedirs(os.path.dirname(Config.SQLITE_DB_PATH), exist_ok=True)

    CORS(app, origins=Config.FRONTEND_URLS, supports_credentials=True)

    from app.models import init_db
    init_db()

    from app.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix="/api")

    return app
