from typing import Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr, ConfigDict


# ─── Auth Schemas ────────────────────────────────────────────────────────────

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: str
    avatar_url: Optional[str] = None
    created_at: datetime


class TokenResponse(BaseModel):
    message: str
    user: UserOut
    access_token: Optional[str] = None


# ─── Meeting Schemas ──────────────────────────────────────────────────────────

class MeetingCreate(BaseModel):
    title: str = "Instant Meeting"
    description: Optional[str] = None
    passcode: Optional[str] = None


class MeetingSchedule(BaseModel):
    title: str
    description: Optional[str] = None
    start_time: datetime
    duration: int = 60          # minutes
    passcode: Optional[str] = None


class MeetingOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    meeting_id: str
    host_id: int
    title: str
    description: Optional[str] = None
    start_time: datetime
    duration: int
    is_instant: bool
    status: str
    passcode: Optional[str] = None
    invite_link: Optional[str] = None
    created_at: datetime
    host_name: Optional[str] = None
    participant_count: Optional[int] = 0


# ─── Participant Schemas ──────────────────────────────────────────────────────

class JoinMeeting(BaseModel):
    display_name: str
    passcode: Optional[str] = None


class ParticipantOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    display_name: str
    role: str
    is_muted: bool
    is_video_on: bool
    joined_at: datetime
    user_id: Optional[int] = None


class MuteParticipant(BaseModel):
    is_muted: bool
