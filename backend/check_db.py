import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
from app.database import SessionLocal
from app.models import Meeting
from datetime import datetime

db = SessionLocal()
meetings = db.query(Meeting).all()
now = datetime.utcnow()

print(f"Current UTC Now: {now}")
print("-" * 50)
for m in meetings:
    print(f"ID: {m.id} | Title: {m.title} | Status: {m.status} | Start (UTC): {m.start_time} | Passed: {m.start_time < now}")
