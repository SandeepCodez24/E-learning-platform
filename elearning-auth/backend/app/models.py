import sqlite3
from contextlib import contextmanager

from werkzeug.security import generate_password_hash, check_password_hash
from config import Config


@contextmanager
def get_db():
    conn = sqlite3.connect(Config.SQLITE_DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()


def init_db():
    with get_db() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
            """
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS revoked_tokens (
                jti TEXT PRIMARY KEY,
                revoked_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
            """
        )


def create_user(username, email, password):
    with get_db() as conn:
        conn.execute(
            "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
            (username, email, generate_password_hash(password)),
        )


def find_user_by_login(identifier):
    with get_db() as conn:
        row = conn.execute(
            "SELECT * FROM users WHERE username = ? OR email = ?",
            (identifier, identifier),
        ).fetchone()
        return dict(row) if row else None


def user_exists(username, email):
    with get_db() as conn:
        row = conn.execute(
            "SELECT id FROM users WHERE username = ? OR email = ?",
            (username, email),
        ).fetchone()
        return row is not None


def verify_password(user, password):
    return check_password_hash(user["password_hash"], password)


def revoke_token(jti):
    with get_db() as conn:
        conn.execute("INSERT OR IGNORE INTO revoked_tokens (jti) VALUES (?)", (jti,))


def is_token_revoked(jti):
    with get_db() as conn:
        row = conn.execute(
            "SELECT 1 FROM revoked_tokens WHERE jti = ?", (jti,)
        ).fetchone()
        return row is not None
