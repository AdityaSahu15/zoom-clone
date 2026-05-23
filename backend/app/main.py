from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import engine, Base
from .config import get_settings
from .routers import auth, meetings, participants

settings = get_settings()

# Create all database tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Zoom Clone API",
    description="Backend API for the Zoom Clone video conferencing platform",
    version="1.0.0",
)

# ─── CORS Middleware ──────────────────────────────────────────────────────────
# Allow the Next.js frontend to communicate with the backend.
# credentials=True is required to send/receive HTTP-only cookies.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,      # CRITICAL for cookies
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Include Routers ──────────────────────────────────────────────────────────
app.include_router(auth.router)
app.include_router(meetings.router)
app.include_router(participants.router)


@app.get("/")
def root():
    return {"message": "Zoom Clone API is running", "docs": "/docs"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}
