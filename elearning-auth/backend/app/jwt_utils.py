import uuid
from functools import wraps
from datetime import datetime, timezone, timedelta

import jwt
from flask import request, jsonify, current_app

from app.models import is_token_revoked


def generate_token(user):
    now = datetime.now(timezone.utc)
    payload = {
        "sub": str(user["id"]),
        "username": user["username"],
        "email": user["email"],
        "jti": str(uuid.uuid4()),
        "iat": now,
        "exp": now + timedelta(minutes=current_app.config["JWT_EXP_MINUTES"]),
    }
    return jwt.encode(
        payload,
        current_app.config["SECRET_KEY"],
        algorithm=current_app.config["JWT_ALGORITHM"],
    )


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.headers.get("Authorization", "")
        if not auth.startswith("Bearer "):
            return jsonify({"message": "Authorization token required"}), 401

        token = auth.split(" ", 1)[1]
        try:
            data = jwt.decode(
                token,
                current_app.config["SECRET_KEY"],
                algorithms=[current_app.config["JWT_ALGORITHM"]],
            )
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"message": "Invalid token"}), 401

        if is_token_revoked(data["jti"]):
            return jsonify({"message": "Token has been revoked"}), 401

        return f(token_data=data, *args, **kwargs)

    return decorated
