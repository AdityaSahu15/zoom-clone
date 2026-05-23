# ZoomClone — Full-Stack Video Conferencing Platform

A functional Zoom clone built for the SDE Intern Full-Stack Assignment. Replicates Zoom's design, user experience, and core meeting workflows.

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS v4 |
| **Backend** | Python FastAPI |
| **Database** | SQLite via SQLAlchemy |
| **Auth** | JWT (access + refresh tokens), HTTP-only cookies |
| **Icons** | Lucide React |

---

## ✅ Features Implemented

### Core Features
- **Landing Dashboard** — Zoom-style home with live clock, action buttons, upcoming & recent meetings
- **Instant Meeting** — Create with one click, generates unique 10-digit meeting ID and shareable invite link
- **Join Meeting** — Enter meeting ID or use invite link, validates meeting existence
- **Schedule Meeting** — Title, description, date/time picker, duration, auto-generates link, stored in DB
- **Upcoming Meetings** — Sorted by date, shows host, participants, time remaining
- **Recent Meetings** — Last 10 completed/active meetings

### Authentication (Bonus)
- JWT access token (15 min) + refresh token (7 days), stored as HTTP-only cookies
- **401 Interceptor** — Automatically refreshes expired access tokens and retries the failed request
- Register / Login / Logout flows
- Protected routes redirect to `/login`

### Meeting Room
- Participant grid with avatar tiles, initials, mute status
- Live meeting timer
- Mute / Stop Video / Share Screen / Security controls
- Participants panel with real-time list
- Chat panel (placeholder)
- Copy invite link button

### Host Controls (Bonus)
- **Mute All** participants with one click
- **Remove** individual participants
- **Toggle mute** for specific participants
- **End Meeting** for all vs **Leave Meeting** for attendees

### Responsive Design (Bonus)
- Mobile → Tablet → Desktop layouts via Tailwind responsive utilities
- Collapsed toolbar labels on mobile
- Adaptive participant grid (1 → 4 columns based on count)

---

## 🗄️ Database Schema

```
users            — id, name, email, password_hash, avatar_url, created_at
meetings         — id, meeting_id (Zoom-style), host_id, title, description,
                   start_time, duration, is_instant, status, invite_link, created_at
participants     — id, meeting_id, user_id, display_name, role,
                   is_muted, is_video_on, joined_at, left_at
```

---

## ⚙️ Setup & Run

### Prerequisites
- Python 3.10+ (tested on 3.14)
- Node.js 18+

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # Mac/Linux
pip install -r requirements.txt
python seed.py                 # Seed database with sample data
uvicorn app.main:app --reload --port 8000
```

API docs available at: http://localhost:8000/docs

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at: http://localhost:3000

---

## 🔐 Test Credentials

| Email | Password |
|---|---|
| alex@zoomclone.dev | password123 |
| sarah@zoomclone.dev | password123 |
| david@zoomclone.dev | password123 |
| priya@zoomclone.dev | password123 |

---

## 💡 Assumptions & Notes

1. **No real video/audio** — This is a UI/UX and backend clone. Real video would require WebRTC (e.g., Daily.co, Agora, or a WebSocket-based signaling server). The participant grid shows avatar tiles.
2. **Polling** — Participant list refreshes every 10 seconds. Production would use WebSockets.
3. **HTTP-only cookies** — `secure: False` is set for local development. Set to `True` in production with HTTPS.
4. **SQLite** — File-based, no external DB needed. Production would use PostgreSQL.
5. **Screen sharing** — UI button present, marked as "coming soon" (requires WebRTC).

---

## 📁 Project Structure

```
zoom-clone/
├── backend/
│   ├── app/
│   │   ├── main.py           # FastAPI app + CORS
│   │   ├── database.py       # SQLAlchemy setup
│   │   ├── models.py         # ORM models
│   │   ├── schemas.py        # Pydantic schemas
│   │   ├── auth.py           # JWT utilities
│   │   ├── dependencies.py   # get_current_user dep
│   │   ├── config.py         # Settings
│   │   └── routers/
│   │       ├── auth.py       # Register/Login/Refresh/Logout
│   │       ├── meetings.py   # CRUD + instant/schedule
│   │       └── participants.py # Join/Leave/Host Controls
│   ├── seed.py               # Sample data
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── page.tsx              # Dashboard
    │   │   ├── login/page.tsx
    │   │   ├── register/page.tsx
    │   │   ├── join/page.tsx
    │   │   └── meeting/[id]/page.tsx # Meeting Room
    │   ├── components/
    │   │   ├── Navbar.tsx
    │   │   ├── MeetingCard.tsx
    │   │   ├── ScheduleModal.tsx
    │   │   └── JoinModal.tsx
    │   ├── context/
    │   │   └── AuthContext.tsx
    │   └── lib/
    │       ├── api.ts          # Axios + 401 interceptor
    │       └── types.ts
    └── package.json
```
