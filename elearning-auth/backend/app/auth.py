import re
from flask import Blueprint, request, jsonify

from app.models import (
    create_user,
    find_user_by_login,
    user_exists,
    verify_password,
    revoke_token,
)
from app.jwt_utils import generate_token, token_required

auth_bp = Blueprint("auth", __name__)

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
USERNAME_RE = re.compile(r"^[a-zA-Z0-9_.]{3,30}$")


def validate_password(password):
    if len(password) < 8:
        return "Password must be at least 8 characters"
    if not re.search(r"[A-Z]", password):
        return "Password must contain an uppercase letter"
    if not re.search(r"[a-z]", password):
        return "Password must contain a lowercase letter"
    if not re.search(r"\d", password):
        return "Password must contain a number"
    return None


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json(silent=True) or {}
    username = (data.get("username") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not username or not email or not password:
        return jsonify({"message": "Username, email and password are required"}), 400
    if not USERNAME_RE.match(username):
        return jsonify(
            {"message": "Username must be 3-30 characters (letters, numbers, _ or .)"}
        ), 400
    if not EMAIL_RE.match(email):
        return jsonify({"message": "Invalid email address"}), 400

    password_error = validate_password(password)
    if password_error:
        return jsonify({"message": password_error}), 400

    if user_exists(username, email):
        return jsonify({"message": "Username or email already registered"}), 409

    create_user(username, email, password)
    user = find_user_by_login(username)
    token = generate_token(user)

    return jsonify(
        {
            "message": "Registration successful",
            "access_token": token,
            "user": {"id": user["id"], "username": user["username"], "email": user["email"]},
        }
    ), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}
    identifier = (data.get("username") or data.get("email") or "").strip()
    password = data.get("password") or ""

    if not identifier or not password:
        return jsonify({"message": "Username/email and password are required"}), 400

    lookup = identifier.lower() if "@" in identifier else identifier
    user = find_user_by_login(lookup)

    if not user or not verify_password(user, password):
        return jsonify({"message": "Invalid credentials"}), 401

    token = generate_token(user)
    return jsonify(
        {
            "message": "Login successful",
            "access_token": token,
            "user": {"id": user["id"], "username": user["username"], "email": user["email"]},
        }
    )


@auth_bp.route("/logout", methods=["POST"])
@token_required
def logout(token_data):
    revoke_token(token_data["jti"])
    return jsonify({"message": "Logged out"})


@auth_bp.route("/me", methods=["GET"])
@token_required
def me(token_data):
    return jsonify(
        {
            "user": {
                "id": int(token_data["sub"]),
                "username": token_data["username"],
                "email": token_data["email"],
            }
        }
    )
