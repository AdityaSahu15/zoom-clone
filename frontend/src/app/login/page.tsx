'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Eye, EyeOff, ChevronDown } from 'lucide-react';

export default function LoginPage() {
  const { login, user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) router.push('/dashboard');
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error('Please fill in all fields'); return; }
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      toast.error(error.response?.data?.detail || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAutofill = () => {
    setEmail('alex@zoomclone.dev');
    setPassword('password123');
    toast.success('Demo credentials autofilled!');
  };

  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 36, height: 36, border: '2px solid #e5e7eb', borderTopColor: '#0b5cff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, sans-serif' }}>

      {/* ─── HEADER ─────────────────────────────────────────────────────────── */}
      <header style={{
        height: '74px',
        minHeight: '74px',
        background: '#ffffff',
        borderBottom: '1px solid #eceef2',
        padding: '0 56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        zIndex: 50,
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', lineHeight: 1 }}>
          <span style={{ color: '#0b5cff', fontSize: '26px', fontWeight: 800, letterSpacing: '-1.2px', lineHeight: 1 }}>zoom</span>
        </Link>

        {/* Right nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px', fontSize: '14px', fontWeight: 400, lineHeight: '20px', color: '#374151' }}>
          <span style={{ color: '#374151' }}>
            New to Zoom?{' '}
            <Link href="/register" style={{ color: '#0b5cff', fontWeight: 600, textDecoration: 'none' }}>Sign Up Free</Link>
          </span>
          <Link href="#" style={{ color: '#374151', textDecoration: 'none' }}>Support</Link>
          <button style={{ display: 'flex', alignItems: 'center', gap: '3px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: '#374151', padding: 0 }}>
            English <ChevronDown style={{ width: 13, height: 13, opacity: 0.55 }} />
          </button>
        </div>
      </header>

      {/* ─── BODY: two-column split ───────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 'calc(100vh - 74px)' }}
        className="max-lg:flex max-lg:flex-col">

        {/* ══════════════════════════════
            LEFT PANEL — promotional area
        ══════════════════════════════ */}
        <div style={{
          background: '#f7f7f8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px',
        }} className="hidden lg:flex">

          {/* Flat marketing poster — NO border-radius, NO shadow */}
          <div style={{
            width: '100%',
            maxWidth: '670px',
            height: '470px',
            borderRadius: 0,
            boxShadow: 'none',
            overflow: 'hidden',
            position: 'relative',
            background: 'linear-gradient(135deg, #04113a 0%, #0b3baa 45%, #1a6eff 80%, #0ac8f5 100%)',
            flexShrink: 0,
          }}>
            {/* Subtle grid mesh */}
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }} />
            {/* Soft glow spots */}
            <div style={{ position: 'absolute', top: '-60px', right: '-40px', width: '320px', height: '320px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,200,255,0.22) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-80px', left: '-60px', width: '360px', height: '360px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(11,92,255,0.28) 0%, transparent 70%)', pointerEvents: 'none' }} />

            {/* Poster content */}
            <div style={{ position: 'relative', zIndex: 10, padding: '40px 44px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxSizing: 'border-box' }}>

              {/* Top row: logo + badge */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ color: '#fff', fontSize: '20px', fontWeight: 800, letterSpacing: '-0.8px', display: 'block' }}>zoom</span>
                  <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '11px', fontWeight: 600, letterSpacing: '2.5px', textTransform: 'uppercase', marginTop: '2px', display: 'block' }}>Events</span>
                </div>
                <div style={{
                  width: '76px', height: '76px', borderRadius: '50%',
                  border: '1px solid rgba(255,255,255,0.22)',
                  background: 'rgba(4,17,58,0.72)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  textAlign: 'center', padding: '6px',
                }}>
                  <span style={{ fontSize: '9px', fontWeight: 900, letterSpacing: '2px', color: '#0ac8f5', textTransform: 'uppercase', display: 'block' }}>APAC</span>
                  <span style={{ fontSize: '8.5px', fontWeight: 700, color: '#fff', lineHeight: 1.35, marginTop: '3px', display: 'block' }}>11 June<br />2026</span>
                </div>
              </div>

              {/* Mid: headline */}
              <div>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px', marginTop: 0 }}>
                  The future of work
                </p>
                <h2 style={{ color: '#fff', fontSize: '56px', fontWeight: 900, lineHeight: 1.02, letterSpacing: '-2.5px', margin: 0 }}>
                  Marketing<br />
                  <span style={{ color: '#0ac8f5', fontStyle: 'italic' }}>Remix</span>
                  <span style={{ color: '#fff', marginLeft: '8px', fontSize: '40px', verticalAlign: 'middle', opacity: 0.8 }}>✦</span>
                </h2>
              </div>

              {/* Bottom row: tagline + CTA */}
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: '14px', fontWeight: 500, lineHeight: 1.65, margin: 0 }}>
                  Reboot your virtual events.<br />
                  Pump up the human connection.
                </p>
                <button
                  onClick={() => toast.success('Pre-registering for Zoom Marketing Remix 2026!')}
                  style={{
                    background: '#0ac8f5', color: '#04113a', fontSize: '12px', fontWeight: 800,
                    padding: '10px 24px', borderRadius: '9999px', border: 'none', cursor: 'pointer',
                    letterSpacing: '0.4px', whiteSpace: 'nowrap', flexShrink: 0, marginLeft: '24px',
                  }}
                >
                  Register now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════
            RIGHT PANEL — auth form
        ══════════════════════════════ */}
        <div style={{
          background: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px 24px',
        }}>
          {/* Auth container — exactly 430px wide */}
          <div style={{ width: '430px', maxWidth: '100%' }}>

            {/* Title */}
            <h1
              onClick={handleDemoAutofill}
              title="Click to autofill demo account"
              style={{
                fontSize: '32px',
                fontWeight: 400,
                lineHeight: '40px',
                color: '#111827',
                margin: '0 0 28px 0',
                textAlign: 'center',
                cursor: 'pointer',
                userSelect: 'none',
                letterSpacing: '-1.5px',
              }}
            >
              Sign in
            </h1>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

              {/* Email */}
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                autoComplete="email"
                required
                style={{
                  width: '100%', height: '46px', boxSizing: 'border-box',
                  border: '1px solid #d1d5db', borderRadius: '12px',
                  background: '#ffffff', padding: '0 16px',
                  fontSize: '15px', fontWeight: 400, color: '#111827',
                  outline: 'none', transition: 'border-color 0.15s, box-shadow 0.15s',
                }}
                onFocus={(e) => { e.target.style.borderColor = '#0b5cff'; e.target.style.boxShadow = '0 0 0 3px rgba(11,92,255,0.12)'; }}
                onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; }}
              />

              {/* Password */}
              <div style={{ position: 'relative' }}>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  autoComplete="current-password"
                  required
                  style={{
                    width: '100%', height: '46px', boxSizing: 'border-box',
                    border: '1px solid #d1d5db', borderRadius: '12px',
                    background: '#ffffff', padding: '0 48px 0 16px',
                    fontSize: '15px', fontWeight: 400, color: '#111827',
                    outline: 'none', transition: 'border-color 0.15s, box-shadow 0.15s',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = '#0b5cff'; e.target.style.boxShadow = '0 0 0 3px rgba(11,92,255,0.12)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', display: 'flex', padding: 0 }}
                >
                  {showPassword
                    ? <EyeOff style={{ width: 18, height: 18 }} />
                    : <Eye style={{ width: 18, height: 18 }} />}
                </button>
              </div>

              {/* Submit */}
              <button
                id="login-submit"
                type="submit"
                disabled={loading}
                style={{
                  width: '100%', height: '46px', boxSizing: 'border-box',
                  background: loading ? '#6b9fff' : '#0b5cff',
                  color: '#ffffff', fontSize: '16px', fontWeight: 500,
                  borderRadius: '9999px', border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  boxShadow: 'none', transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = '#0047cc'; }}
                onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = '#0b5cff'; }}
              >
                {loading
                  ? <><span style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.35)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} /> Signing in…</>
                  : 'Sign In'}
              </button>
            </form>

            {/* Divider */}
            <div style={{ marginTop: '28px', marginBottom: '22px', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ flex: 1, height: '1px', background: '#eceef2' }} />
              <span style={{ fontSize: '13px', color: '#6b7280', whiteSpace: 'nowrap', lineHeight: 1 }}>Or sign in with</span>
              <div style={{ flex: 1, height: '1px', background: '#eceef2' }} />
            </div>

            {/* Social buttons */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: '18px' }}>

              {/* Google */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <button style={socialBtnStyle}
                  onMouseEnter={(e) => socialHover(e, true)}
                  onMouseLeave={(e) => socialHover(e, false)}>
                  <svg width="26" height="26" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                </button>
                <span style={socialLabelStyle}>Google</span>
              </div>

              {/* SSO */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <button style={socialBtnStyle}
                  onMouseEnter={(e) => socialHover(e, true)}
                  onMouseLeave={(e) => socialHover(e, false)}>
                  <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                    <rect width="26" height="26" rx="5" fill="#0b5cff" />
                    <path d="M8 13h10M13 8v10" stroke="#fff" strokeWidth="2.3" strokeLinecap="round" />
                  </svg>
                </button>
                <span style={socialLabelStyle}>SSO</span>
              </div>

              {/* Apple */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <button style={socialBtnStyle}
                  onMouseEnter={(e) => socialHover(e, true)}
                  onMouseLeave={(e) => socialHover(e, false)}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#111827">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.28.07 2.16.67 2.89.72.91-.17 1.77-.78 2.74-.84 1.81-.14 3.17.68 4.05 1.96-3.69 2.25-2.85 6.85.69 8.22-.47 1.2-.92 2.45-2.37 2.82zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                  </svg>
                </button>
                <span style={socialLabelStyle}>Apple</span>
              </div>

              {/* Facebook */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <button style={socialBtnStyle}
                  onMouseEnter={(e) => socialHover(e, true)}
                  onMouseLeave={(e) => socialHover(e, false)}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="#1877F2">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </button>
                <span style={socialLabelStyle}>Facebook</span>
              </div>
            </div>

            {/* Bottom links */}
            <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
              <button type="button" onClick={() => toast('Redirecting to account recovery…')}
                style={{ fontSize: '13px', color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'Inter, sans-serif' }}>
                Forgot email?
              </button>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '18px' }}>
                <Link href="#" style={{ fontSize: '13px', color: '#2563eb', textDecoration: 'none' }}>Help</Link>
                <Link href="#" style={{ fontSize: '13px', color: '#2563eb', textDecoration: 'none' }}>Terms</Link>
                <Link href="#" style={{ fontSize: '13px', color: '#2563eb', textDecoration: 'none' }}>Privacy</Link>
              </div>
            </div>

            {/* reCAPTCHA */}
            <p style={{
              marginTop: '18px', marginLeft: 'auto', marginRight: 'auto', marginBottom: 0,
              width: '420px', maxWidth: '100%',
              textAlign: 'center', fontSize: '11px', lineHeight: '18px', color: '#6b7280',
            }}>
              Zoom is protected by reCAPTCHA and the Google{' '}
              <a href="#" style={{ color: '#6b7280', textDecoration: 'underline' }}>Privacy Policy</a>{' '}
              and{' '}
              <a href="#" style={{ color: '#6b7280', textDecoration: 'underline' }}>Terms of Service</a>{' '}
              apply.
            </p>

          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 1023px) {
          .lg\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
}

/* ─── Shared style objects ──────────────────────────────────────── */
const socialBtnStyle: React.CSSProperties = {
  width: '64px', height: '64px',
  borderRadius: '18px',
  border: '1px solid #e5e7eb',
  background: '#ffffff',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer',
  transition: 'border-color 0.15s, box-shadow 0.15s',
  boxShadow: 'none',
  padding: 0,
};

const socialLabelStyle: React.CSSProperties = {
  fontSize: '15px', fontWeight: 400, color: '#6b7280', lineHeight: 1,
};

function socialHover(e: React.MouseEvent<HTMLButtonElement>, entering: boolean) {
  const el = e.currentTarget;
  el.style.borderColor = entering ? '#d1d5db' : '#e5e7eb';
  el.style.boxShadow = entering ? '0 2px 8px rgba(0,0,0,0.08)' : 'none';
}
