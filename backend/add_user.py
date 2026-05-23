import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from app.database import SessionLocal
from app.models import User
from app.auth import hash_password

def add_user():
    db = SessionLocal()
    try:
        existing = db.query(User).filter(User.email == "aditya@example.com").first()
        if existing:
            print("User already exists.")
            return

        user = User(
            name="Aditya",
            email="aditya@example.com",
            password_hash=hash_password("aditya123")
        )
        db.add(user)
        db.commit()
        print("User Aditya created successfully!")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    add_user()
