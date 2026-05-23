"""
Seed script — populates the SQLite database with sample data.
Run from the backend/ directory:
    python seed.py
"""
import sys
import os
from datetime import datetime, timedelta
import random
import string

# Make sure app package is importable
sys.path.insert(0, os.path.dirname(__file__))

from app.database import SessionLocal, engine, Base
from app.models import User, Meeting, Participant, MeetingStatus, ParticipantRole
from app.auth import hash_password

Base.metadata.create_all(bind=engine)


def generate_meeting_id() -> str:
    digits = "".join(random.choices(string.digits, k=10))
    return f"{digits[:3]}-{digits[3:6]}-{digits[6:]}"


def seed():
    db = SessionLocal()
    try:
        # ── Check if already seeded ───────────────────────────────────────────
        if db.query(User).count() > 0:
            print("Database already seeded. Skipping.")
            return

        print("Seeding database...")

        # ── Users ─────────────────────────────────────────────────────────────
        users_data = [
            {"name": "Alex Johnson",    "email": "alex@zoomclone.dev",    "password": "password123"},
            {"name": "Sarah Mitchell",  "email": "sarah@zoomclone.dev",   "password": "password123"},
            {"name": "David Chen",      "email": "david@zoomclone.dev",   "password": "password123"},
            {"name": "Priya Sharma",    "email": "priya@zoomclone.dev",   "password": "password123"},
        ]

        users = []
        for u in users_data:
            user = User(
                name=u["name"],
                email=u["email"],
                password_hash=hash_password(u["password"]),
            )
            db.add(user)
            users.append(user)
        db.commit()
        for u in users:
            db.refresh(u)

        print(f"  Created {len(users)} users")
        print("  Default login -> email: alex@zoomclone.dev | password: password123")

        # ── Meetings ──────────────────────────────────────────────────────────
        now = datetime.utcnow()
        frontend_url = "http://localhost:3000"

        meetings_data = [
            # Upcoming scheduled meetings (future)
            {
                "host": users[0], "title": "SDE Intern Final Evaluation",
                "description": "Code review and architecture discussion for the Zoom Clone assignment.",
                "start_time": now + timedelta(hours=2), "duration": 60,
                "is_instant": False, "status": MeetingStatus.scheduled,
            },
            {
                "host": users[0], "title": "System Design Interview",
                "description": "Deep dive into WebRTC, WebSockets, and Database Schema decisions.",
                "start_time": now + timedelta(days=1, hours=3), "duration": 90,
                "is_instant": False, "status": MeetingStatus.scheduled,
            },
            {
                "host": users[0], "title": "1:1 with Mentor — Feedback Sync",
                "description": "Weekly check-in to discuss assignment progress and blockers.",
                "start_time": now + timedelta(days=2), "duration": 30,
                "is_instant": False, "status": MeetingStatus.scheduled,
            },
            {
                "host": users[1], "title": "Frontend UI/UX Polish Session",
                "description": "Reviewing Tailwind pixel-perfect margins to match Zoom.",
                "start_time": now + timedelta(days=3), "duration": 60,
                "is_instant": False, "status": MeetingStatus.scheduled,
            },
            {
                "host": users[2], "title": "Engineering All Hands",
                "description": "Company-wide intern presentations.",
                "start_time": now + timedelta(days=5), "duration": 120,
                "is_instant": False, "status": MeetingStatus.scheduled,
            },
            # Recent/completed meetings (past)
            {
                "host": users[0], "title": "Initial Requirements Sync",
                "description": "Discussing the Full-stack Zoom Clone Intern Assignment.",
                "start_time": now - timedelta(days=1), "duration": 60,
                "is_instant": False, "status": MeetingStatus.completed,
            },
            {
                "host": users[0], "title": "SQLite Database Design Review",
                "description": "Validating the schema for Users, Meetings, and Participants.",
                "start_time": now - timedelta(days=2), "duration": 45,
                "is_instant": True, "status": MeetingStatus.completed,
            },
            {
                "host": users[1], "title": "FastAPI + Auth Implementation",
                "description": "Pair programming session for JWT implementation.",
                "start_time": now - timedelta(days=3), "duration": 60,
                "is_instant": False, "status": MeetingStatus.completed,
            },
            {
                "host": users[0], "title": "Quick Debugging Call",
                "description": "Fixing CORS issues between Next.js and FastAPI.",
                "start_time": now - timedelta(days=5), "duration": 30,
                "is_instant": True, "status": MeetingStatus.completed,
            },
            {
                "host": users[2], "title": "Intern Onboarding & Orientation",
                "description": "Welcome to the engineering team!",
                "start_time": now - timedelta(days=7), "duration": 90,
                "is_instant": False, "status": MeetingStatus.completed,
            },
        ]

        meetings = []
        for m_data in meetings_data:
            meeting_id = generate_meeting_id()
            meeting = Meeting(
                meeting_id=meeting_id,
                host_id=m_data["host"].id,
                title=m_data["title"],
                description=m_data["description"],
                start_time=m_data["start_time"],
                duration=m_data["duration"],
                is_instant=m_data["is_instant"],
                status=m_data["status"],
                invite_link=f"{frontend_url}/join?meetingId={meeting_id}",
            )
            db.add(meeting)
            meetings.append((meeting, m_data["host"]))

        db.commit()
        for m, _ in meetings:
            db.refresh(m)

        print(f"  Created {len(meetings)} meetings")

        # ── Participants ───────────────────────────────────────────────────────
        participant_count = 0
        for meeting, host in meetings:
            # Add host as participant
            host_p = Participant(
                meeting_id=meeting.id,
                user_id=host.id,
                display_name=host.name,
                role=ParticipantRole.host,
                left_at=now if meeting.status == MeetingStatus.completed else None,
            )
            db.add(host_p)
            participant_count += 1

            # Add 1–2 other users as participants to completed meetings
            if meeting.status == MeetingStatus.completed:
                other_users = [u for u in users if u.id != host.id]
                attendees = random.sample(other_users, min(2, len(other_users)))
                for attendee in attendees:
                    p = Participant(
                        meeting_id=meeting.id,
                        user_id=attendee.id,
                        display_name=attendee.name,
                        role=ParticipantRole.attendee,
                        left_at=now,
                    )
                    db.add(p)
                    participant_count += 1

        db.commit()
        print(f"  Created {participant_count} participant records")
        print("\nSeeding complete! [DONE]")
        print("=" * 50)
        print("Test credentials:")
        for u in users_data:
            print(f"  {u['email']} / {u['password']}")

    except Exception as e:
        db.rollback()
        print(f"Seeding failed: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
