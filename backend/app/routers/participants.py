from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Meeting, MeetingStatus, Participant, ParticipantRole
from ..schemas import JoinMeeting, ParticipantOut, MuteParticipant
from ..dependencies import get_current_user, get_current_user_optional
from ..models import User

router = APIRouter(prefix="/api/meetings", tags=["participants"])


@router.post("/{meeting_id}/join", response_model=ParticipantOut, status_code=status.HTTP_201_CREATED)
def join_meeting(
    meeting_id: str,
    data: JoinMeeting,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_optional),
):
    """
    Join a meeting by its meeting_id.
    - Validates the meeting exists and is not cancelled/completed.
    - If user is host, assigns host role.
    - Prevents duplicate joins (re-uses existing active participant record).
    """
    meeting = db.query(Meeting).filter(Meeting.meeting_id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    if meeting.status in [MeetingStatus.cancelled, MeetingStatus.completed]:
        raise HTTPException(status_code=400, detail="This meeting is no longer active")

    # Check if already joined (still in meeting)
    if current_user:
        existing = (
            db.query(Participant)
            .filter(
                Participant.meeting_id == meeting.id,
                Participant.user_id == current_user.id,
                Participant.left_at == None,
            )
            .first()
        )
        if existing:
            return existing

    # Enforce passcode check if required and user is not host
    if meeting.passcode and (not current_user or meeting.host_id != current_user.id):
        if data.passcode != meeting.passcode:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect passcode")

    # Determine role
    role = ParticipantRole.host if (current_user and meeting.host_id == current_user.id) else ParticipantRole.attendee

    # Mark meeting as active when first participant joins
    if meeting.status == MeetingStatus.scheduled:
        meeting.status = MeetingStatus.active
        db.commit()

    participant = Participant(
        meeting_id=meeting.id,
        user_id=current_user.id if current_user else None,
        display_name=data.display_name,
        role=role,
    )
    db.add(participant)
    db.commit()
    db.refresh(participant)
    return participant


@router.get("/{meeting_id}/participants", response_model=List[ParticipantOut])
def get_participants(
    meeting_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_optional),
):
    """List all currently active participants in a meeting."""
    meeting = db.query(Meeting).filter(Meeting.meeting_id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    if meeting.status in [MeetingStatus.completed, MeetingStatus.cancelled]:
        raise HTTPException(status_code=410, detail="Meeting has ended")

    active_participants = (
        db.query(Participant)
        .filter(
            Participant.meeting_id == meeting.id,
            Participant.left_at == None,
        )
        .all()
    )
    return active_participants


@router.delete("/{meeting_id}/participants/{participant_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_participant(
    meeting_id: str,
    participant_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    HOST CONTROL: Remove a participant from the meeting.
    Only the meeting host can remove participants.
    """
    meeting = db.query(Meeting).filter(Meeting.meeting_id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    if meeting.host_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the host can remove participants")

    participant = db.query(Participant).filter(
        Participant.id == participant_id,
        Participant.meeting_id == meeting.id,
    ).first()
    if not participant:
        raise HTTPException(status_code=404, detail="Participant not found")
    if participant.role == ParticipantRole.host:
        raise HTTPException(status_code=400, detail="Cannot remove the host")

    participant.left_at = datetime.utcnow()
    db.commit()


@router.post("/{meeting_id}/mute-all", status_code=status.HTTP_200_OK)
def mute_all_participants(
    meeting_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    HOST CONTROL: Mute all participants except the host.
    """
    meeting = db.query(Meeting).filter(Meeting.meeting_id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    if meeting.host_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the host can mute all participants")

    muted_count = 0
    for participant in meeting.participants:
        if participant.left_at is None and participant.role != ParticipantRole.host:
            participant.is_muted = True
            muted_count += 1
    db.commit()
    return {"message": f"Muted {muted_count} participants"}


@router.patch("/{meeting_id}/participants/{participant_id}/mute")
def toggle_mute_participant(
    meeting_id: str,
    participant_id: int,
    data: MuteParticipant,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """HOST CONTROL: Toggle mute for a specific participant."""
    meeting = db.query(Meeting).filter(Meeting.meeting_id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    if meeting.host_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the host can mute participants")

    participant = db.query(Participant).filter(
        Participant.id == participant_id,
        Participant.meeting_id == meeting.id,
    ).first()
    if not participant:
        raise HTTPException(status_code=404, detail="Participant not found")

    participant.is_muted = data.is_muted
    db.commit()
    db.refresh(participant)
    return participant


@router.post("/{meeting_id}/leave", status_code=status.HTTP_200_OK)
def leave_meeting(
    meeting_id: str,
    participant_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_optional),
):
    """Mark the current user or guest as having left the meeting."""
    meeting = db.query(Meeting).filter(Meeting.meeting_id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")

    participant = None
    if participant_id:
        participant = (
            db.query(Participant)
            .filter(
                Participant.meeting_id == meeting.id,
                Participant.id == participant_id,
                Participant.left_at == None,
            )
            .first()
        )
    elif current_user:
        participant = (
            db.query(Participant)
            .filter(
                Participant.meeting_id == meeting.id,
                Participant.user_id == current_user.id,
                Participant.left_at == None,
            )
            .first()
        )

    if participant:
        participant.left_at = datetime.utcnow()
        db.commit()

    return {"message": "Left meeting successfully"}
