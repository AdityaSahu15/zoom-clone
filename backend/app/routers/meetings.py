import random
import string
from datetime import datetime
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Meeting, MeetingStatus, Participant, ParticipantRole
from ..schemas import MeetingCreate, MeetingSchedule, MeetingOut
from ..dependencies import get_current_user, get_current_user_optional
from ..models import User
from ..config import get_settings

settings = get_settings()
router = APIRouter(prefix="/api/meetings", tags=["meetings"])


def generate_meeting_id() -> str:
    """Generate a Zoom-style meeting ID: '123-456-7890'"""
    digits = "".join(random.choices(string.digits, k=10))
    return f"{digits[:3]}-{digits[3:6]}-{digits[6:]}"


def build_invite_link(meeting_id: str, passcode: str = None) -> str:
    """Build a shareable invite link using the meeting ID and optional passcode."""
    base_url = f"{settings.FRONTEND_URL}/join?meetingId={meeting_id}"
    if passcode:
        return f"{base_url}&pwd={passcode}"
    return base_url


from datetime import timezone

def meeting_to_out(meeting: Meeting) -> dict:
    """Serialize a Meeting ORM object to a dict matching MeetingOut schema."""
    # Ensure datetimes are timezone-aware so FastAPI serializes them with 'Z' (UTC)
    st = meeting.start_time.replace(tzinfo=timezone.utc) if meeting.start_time and meeting.start_time.tzinfo is None else meeting.start_time
    cat = meeting.created_at.replace(tzinfo=timezone.utc) if meeting.created_at and meeting.created_at.tzinfo is None else meeting.created_at

    return {
        "id": meeting.id,
        "meeting_id": meeting.meeting_id,
        "host_id": meeting.host_id,
        "title": meeting.title,
        "description": meeting.description,
        "start_time": st,
        "duration": meeting.duration,
        "is_instant": meeting.is_instant,
        "status": meeting.status.value if meeting.status else "scheduled",
        "passcode": meeting.passcode,
        "invite_link": meeting.invite_link,
        "created_at": cat,
        "host_name": meeting.host.name if meeting.host else None,
        "participant_count": len([p for p in meeting.participants if p.left_at is None]),
    }


@router.post("/instant", response_model=MeetingOut, status_code=status.HTTP_201_CREATED)
def create_instant_meeting(
    data: MeetingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Create an instant meeting immediately.
    Generates a unique meeting ID and invite link, sets status to 'active'.
    """
    meeting_id = generate_meeting_id()
    # Ensure uniqueness (extremely unlikely collision but be safe)
    while db.query(Meeting).filter(Meeting.meeting_id == meeting_id).first():
        meeting_id = generate_meeting_id()

    passcode = "".join(random.choices(string.ascii_letters + string.digits, k=6))
    invite_link = build_invite_link(meeting_id, passcode)

    meeting = Meeting(
        meeting_id=meeting_id,
        host_id=current_user.id,
        title=data.title or f"{current_user.name}'s Instant Meeting",
        description=data.description,
        start_time=datetime.utcnow(),
        duration=60,
        is_instant=True,
        status=MeetingStatus.active,
        passcode=passcode,
        invite_link=invite_link,
    )
    db.add(meeting)
    db.commit()
    db.refresh(meeting)

    # Auto-add host as participant
    host_participant = Participant(
        meeting_id=meeting.id,
        user_id=current_user.id,
        display_name=current_user.name,
        role=ParticipantRole.host,
    )
    db.add(host_participant)
    db.commit()
    db.refresh(meeting)

    return meeting_to_out(meeting)


@router.post("/schedule", response_model=MeetingOut, status_code=status.HTTP_201_CREATED)
def schedule_meeting(
    data: MeetingSchedule,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Convert aware datetime to naive UTC if it has tzinfo
    if data.start_time.tzinfo is not None:
        # We need to import timezone if it isn't already
        from datetime import timezone
        start_time_utc = data.start_time.astimezone(timezone.utc).replace(tzinfo=None)
    else:
        start_time_utc = data.start_time

    if start_time_utc < datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Meeting start time cannot be in the past",
        )

    # Use the naive UTC datetime for the rest of the flow
    data.start_time = start_time_utc

    meeting_id = generate_meeting_id()
    while db.query(Meeting).filter(Meeting.meeting_id == meeting_id).first():
        meeting_id = generate_meeting_id()

    invite_link = build_invite_link(meeting_id, data.passcode)

    meeting = Meeting(
        meeting_id=meeting_id,
        host_id=current_user.id,
        title=data.title,
        description=data.description,
        start_time=data.start_time,
        duration=data.duration,
        is_instant=False,
        status=MeetingStatus.scheduled,
        passcode=data.passcode,
        invite_link=invite_link,
    )
    db.add(meeting)
    db.commit()
    db.refresh(meeting)
    return meeting_to_out(meeting)


@router.get("/upcoming", response_model=List[MeetingOut])
def get_upcoming_meetings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Return all scheduled meetings for the current user (as host)
    that have not yet started, sorted by start_time ascending.
    """
    now = datetime.utcnow()
    # Fetch all scheduled meetings for the host, we'll filter in Python to handle the duration
    # We only care about meetings from today onwards (giving a 24h buffer for past meetings that might still be active)
    from datetime import timedelta
    buffer_time = now - timedelta(hours=24)
    
    all_scheduled = (
        db.query(Meeting)
        .filter(
            Meeting.host_id == current_user.id,
            Meeting.status == MeetingStatus.scheduled,
            Meeting.start_time >= buffer_time,
        )
        .order_by(Meeting.start_time.asc())
        .all()
    )

    valid_upcoming = []
    for m in all_scheduled:
        # A meeting is upcoming if its end time (start_time + duration) is in the future
        end_time = m.start_time + timedelta(minutes=m.duration)
        if end_time >= now:
            valid_upcoming.append(m)

    return [meeting_to_out(m) for m in valid_upcoming]


@router.get("/recent", response_model=List[MeetingOut])
def get_recent_meetings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Return the 10 most recent completed/active meetings for the current user.
    Includes meetings where user was host OR participant.
    """
    # Get meetings where user is host OR participant
    host_meetings = (
        db.query(Meeting)
        .filter(
            Meeting.host_id == current_user.id,
            Meeting.status.in_([MeetingStatus.completed, MeetingStatus.active]),
        )
        .all()
    )
    participant_meeting_ids = [
        p.meeting_id for p in db.query(Participant)
        .filter(Participant.user_id == current_user.id)
        .all()
    ]
    participant_meetings = (
        db.query(Meeting)
        .filter(
            Meeting.id.in_(participant_meeting_ids),
            Meeting.host_id != current_user.id,
        )
        .all()
    )

    all_meetings = host_meetings + participant_meetings
    # Sort by created_at descending, return top 10
    all_meetings.sort(key=lambda m: m.created_at, reverse=True)
    return [meeting_to_out(m) for m in all_meetings[:10]]


@router.get("/{meeting_id}", response_model=MeetingOut)
def get_meeting(
    meeting_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_optional),
):
    """Get meeting details by meeting_id (Zoom-style). Used to validate before joining."""
    meeting = db.query(Meeting).filter(Meeting.meeting_id == meeting_id).first()
    if not meeting:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Meeting {meeting_id} not found",
        )
    if meeting.status == MeetingStatus.cancelled:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This meeting has been cancelled",
        )
    return meeting_to_out(meeting)


@router.delete("/{meeting_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_meeting(
    meeting_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Cancel/delete a meeting. Only the host can delete their meeting."""
    meeting = db.query(Meeting).filter(Meeting.meeting_id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    if meeting.host_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the host can delete this meeting")

    meeting.status = MeetingStatus.cancelled
    db.commit()


@router.post("/{meeting_id}/end", response_model=MeetingOut)
def end_meeting(
    meeting_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """End an active meeting. Only the host can end it."""
    meeting = db.query(Meeting).filter(Meeting.meeting_id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    if meeting.host_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the host can end this meeting")

    meeting.status = MeetingStatus.completed
    # Mark all participants as left
    for p in meeting.participants:
        if p.left_at is None:
            p.left_at = datetime.utcnow()
    db.commit()
    db.refresh(meeting)
    return meeting_to_out(meeting)
