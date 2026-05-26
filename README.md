# Zoom Clone - Full-Stack Web App

I built this fully functional Zoom clone for an SDE Intern full-stack assignment. The goal was to recreate the core meeting workflows, UI design, and user experience of the real Zoom web app.

You can check out the live version right here:
- **Frontend (Vercel):** [https://zoom-clone-nine-pi.vercel.app/](https://zoom-clone-nine-pi.vercel.app/)
- **Backend (Render):** [https://zoom-clone-csap.onrender.com](https://zoom-clone-csap.onrender.com)

---

##  Tech Stack

I kept the stack pretty modern and standard:
* **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS
* **Backend:** Python, FastAPI
* **Database:** SQLite (using SQLAlchemy ORM)
* **Authentication:** JWT tokens (stored securely in `localStorage` with `Authorization: Bearer` headers to handle cross-domain requests between Vercel and Render)
* **Icons:** Lucide React

---

##  Features

Here's what I managed to build out:

### Core Meeting Flow
* **Landing Dashboard:** A clean, Zoom-style home screen where you can see the current time, jump into a quick meeting, or schedule one.
* **Instant Meetings:** One click to generate a unique 10-digit meeting ID and shareable invite link.
* **Join Meetings:** You can pop in an ID manually or just click an invite link.
* **Scheduled Meetings:** Fill out a title, description, and time, and it saves it right to the DB so you can join it later.
* **History:** Shows your upcoming meetings and the last 10 recent ones you participated in.

### The Meeting Room
* Participant grid that automatically scales based on how many people are in the room.
* Displays avatar tiles and initials.
* Full controls: Mute, Stop Video, Security panel.
* A live sidebar showing everyone currently in the room.

### Host Controls & Security
* Hosts can instantly mute everyone else in the room.
* Hosts can kick individual attendees out.
* Hosts can toggle mute statuses.
* When the host clicks "End", it actually terminates the meeting for everyone.

### Authentication
* Full register, login, and logout flows.
* Access tokens are issued by the FastAPI backend and persisted via `localStorage` on the frontend.
* Protected Next.js routes (unauthenticated users get booted back to `/login`).

---

##  Database Structure

I used a pretty simple relational setup:
* `users` - Basic profile info and bcrypt hashed passwords.
* `meetings` - Holds the 10-digit IDs, schedule times, status, and the host's ID.
* `participants` - Tracks who is in what meeting, their current role (host vs attendee), and state (muted/video on).

---

##  Running it Locally

If you want to spin this up on your own machine, it's pretty straightforward.

**Prerequisites:** Python 3.10+ and Node.js 18+

### 1. Backend

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate 
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
python seed.py  # Run this to get some dummy users and meetings!
uvicorn app.main:app --reload --port 8000
```
*The API docs will spin up at `http://localhost:8000/docs`*

### 2. Frontend

Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
*The app will be running at `http://localhost:3000`*


---

##  A Few Important Notes
1. **No actual video feeds (yet!):** Since this assignment was heavily focused on UI/UX and full-stack API architecture, I didn't integrate WebRTC (like Agora or LiveKit). The grid renders avatar placeholders for now!
2. **Polling over WebSockets:** The participant sidebar currently polls the backend every 10 seconds to keep the list updated. In a real production environment with video, this would be handled by WebSockets or Server-Sent Events.
3. **Cross-Domain Auth:** Originally I tried using HTTP-only cookies, but because I deployed the frontend to Vercel and the backend to Render, modern browsers blocked the cross-site cookies due to strict tracking protections. I ripped them out and switched to token-based `localStorage` auth which works perfectly across domains.
