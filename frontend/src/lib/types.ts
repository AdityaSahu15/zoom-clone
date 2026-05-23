// Shared TypeScript types matching the backend schemas

export interface User {
  id: number;
  name: string;
  email: string;
  avatar_url?: string;
  created_at: string;
}

export interface Meeting {
  id: number;
  meeting_id: string;
  host_id: number;
  title: string;
  description?: string;
  start_time: string;
  duration: number;
  is_instant: boolean;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  passcode?: string;
  invite_link?: string;
  created_at: string;
  host_name?: string;
  participant_count?: number;
}

export interface Participant {
  id: number;
  display_name: string;
  role: 'host' | 'attendee';
  is_muted: boolean;
  is_video_on: boolean;
  joined_at: string;
  user_id?: number;
}

export interface AuthResponse {
  message: string;
  user: User;
}
