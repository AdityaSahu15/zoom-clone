import enum
from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Boolean, DateTime,
    Text, ForeignKey, Enum as SAEnum
)
from sqlalchemy.orm import relationship
from .database import Base


class MeetingStatus(str, enum.Enum):
    scheduled = "scheduled"
    active = "active"
    completed = "completed"
    cancelled = "cancelled"


class ParticipantRole(str, enum.Enum):
    host = "host"
    attendee = "attendee"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    avatar_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    hosted_meetings = relationship(
        "Meeting", back_populates="host", foreign_keys="Meeting.host_id"
    )
    participations = relationship("Participant", back_populates="user")


class Meeting(Base):
    __tablename__ = "meetings"

    id = Column(Integer, primary_key=True, index=True)
    # Zoom-style meeting ID: "123-456-7890"
    meeting_id = Column(String(20), unique=True, index=True, nullable=False)
    host_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    start_time = Column(DateTime, nullable=False)
    duration = Column(Integer, default=60)          # in minutes
    is_instant = Column(Boolean, default=False)
    status = Column(
        SAEnum(MeetingStatus),
        default=MeetingStatus.scheduled,
        nullable=False
    )
    passcode = Column(String(20), nullable=True)
    invite_link = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    host = relationship("User", back_populates="hosted_meetings", foreign_keys=[host_id])
    participants = relationship(
        "Participant", back_populates="meeting", cascade="all, delete-orphan"
    )


class Participant(Base):
    __tablename__ = "participants"

    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # NULL for guests
    display_name = Column(String(100), nullable=False)
    role = Column(SAEnum(ParticipantRole), default=ParticipantRole.attendee, nullable=False)
    is_muted = Column(Boolean, default=False)
    is_video_on = Column(Boolean, default=True)
    joined_at = Column(DateTime, default=datetime.utcnow)
    left_at = Column(DateTime, nullable=True)       # NULL = still in meeting

    # Relationships
    meeting = relationship("Meeting", back_populates="participants")
    user = relationship("User", back_populates="participations")
