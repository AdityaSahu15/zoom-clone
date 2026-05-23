'use client';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ChevronDown, LogOut, Search, Menu } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface NavbarProps {
  onToggleMobileSidebar: () => void;
}

export default function Navbar({ onToggleMobileSidebar }: NavbarProps) {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Signed out successfully');
    } catch {
      toast.error('Failed to sign out');
    }
  };

  const name = user?.name || 'Aditya Sahu';
  const firstInitial = name.charAt(0).toUpperCase();

  return (
    <div className="w-full flex flex-col shrink-0 select-none font-sans antialiased">
      {/* ── Layer 1: Dark Top Navbar (60px) ── */}
      <header className="w-full h-[45px] bg-[#050b1f] border-b border-white/5 flex items-center shrink-0">
        <div className="w-full max-w-[1440px] mx-auto px-[16px] flex items-center justify-between text-[14px] font-medium text-white/88">
          {/* Left: Hamburger (mobile only) */}
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden text-white/90 hover:text-white cursor-pointer focus:outline-none flex items-center justify-center p-1"
            aria-label="Toggle Sidebar Menu"
          >
            <Menu className="w-4 h-4" />
          </button>
          <div className="hidden lg:block" />

          {/* Right: Utility links + Cart */}
          <div className="flex items-center gap-[18px] items-center">
            <div className="flex items-center gap-1.5 cursor-pointer text-white/88 hover:text-white transition-colors">
              <Search className="w-3.5 h-3.5" />
              <span className="tracking-tight text-[14px] leading-[20px] font-medium">Search</span>
            </div>
            <div className="w-[1px] h-[8px] bg-white/20 shrink-0" />
            <Link href="#" className="text-white/88 hover:text-white transition-colors tracking-tight text-[14px] leading-[20px] font-medium">Support</Link>
            <div className="w-[1px] h-[8px] bg-white/20 shrink-0" />
            <span className="text-white/88 font-normal select-text tracking-tight text-[14px] leading-[20px]">0008000503335</span>
            <div className="w-[1px] h-[8px] bg-white/20 shrink-0" />
            <Link href="#" className="text-white/88 hover:text-white transition-colors tracking-tight text-[14px] leading-[20px] font-medium">Contact Sales</Link>
            <div className="w-[1px] h-[8px] bg-white/20 shrink-0" />
            <Link href="#" className="text-white/88 hover:text-white transition-colors tracking-tight text-[14px] leading-[20px] font-medium">Request a Demo</Link>
            <div className="w-[1px] h-[8px] bg-white/20 shrink-0" />
            <button className="text-white/88 hover:text-white transition-colors cursor-pointer focus:outline-none" aria-label="Cart">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* ── Layer 2: Light Bottom Navbar (60px) ── */}
      <div className="w-full h-[60px] bg-white border-b border-[#e5e5e5] flex items-center shrink-0">
        <div className="w-full max-w-[1440px] mx-auto px-[36px] flex items-center justify-between h-full">
          {/* Left: Logo + Nav links */}
          <div className="flex items-center gap-[30px]">
            <Link href="/" className="flex items-center select-none focus:outline-none">
              <span className="text-[#0b5cff] text-[40px] font-[800] tracking-tighter leading-none select-none">zoom</span>
            </Link>
            <nav className="hidden lg:flex items-center gap-[24px]">
              <Link href="#" className="text-[#5b6472] hover:text-black transition-colors text-[16px] leading-[20px] font-medium tracking-tight">Products</Link>
              <Link href="#" className="text-[#5b6472] hover:text-black transition-colors text-[16px] leading-[20px] font-medium tracking-tight">Solutions</Link>
              <Link href="#" className="text-[#5b6472] hover:text-black transition-colors text-[16px] leading-[20px] font-medium tracking-tight">Resources</Link>
              <Link href="#" className="text-[#5b6472] hover:text-black transition-colors text-[16px] leading-[20px] font-medium tracking-tight">Plans &amp; Pricing</Link>
            </nav>
          </div>

          {/* Right: Schedule | Join | Host | Web App | Avatar */}
          <div className="flex items-center gap-[20px]">
            <Link
              href="#"
              className="text-[#5b6472] hover:text-black transition-colors font-semibold text-[16px] leading-[20px] tracking-tight"
            >
              Schedule
            </Link>
            <Link
              href="#"
              className="text-[#5b6472] hover:text-black transition-colors font-medium text-[16px] leading-[20px] tracking-tight"
            >
              Join
            </Link>

            <button className="flex items-center gap-[3px] text-[#5b6472] hover:text-black transition-colors cursor-pointer focus:outline-none font-medium text-[16px] leading-[20px] tracking-tight">
              Host
              <ChevronDown className="w-3.5 h-3.5 mt-[1px]" />
            </button>

            <button className="hidden sm:flex items-center gap-[3px] text-[#5b6472] hover:text-black transition-colors cursor-pointer focus:outline-none font-medium text-[16px] leading-[20px] tracking-tight">
              Web App
              <ChevronDown className="w-3.5 h-3.5 mt-[1px]" />
            </button>

            {/* Profile Avatar */}
            <div className="relative flex items-center" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-[32px] h-[32px] rounded-full bg-[#0891b2] text-white flex items-center justify-center font-semibold text-[14px] leading-[20px] hover:opacity-90 transition-opacity cursor-pointer shadow-sm focus:outline-none border-0"
              >
                {firstInitial}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-[calc(100%+6px)] w-56 bg-white rounded-xl shadow-xl border border-[#E5E5E5] py-2 z-50 text-[#1A1A1A]">
                  <div className="px-4 py-2 border-b border-gray-100 mb-1 select-text">
                    <p className="text-sm font-semibold text-gray-900 truncate">{name}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email || 'aditya@zoomclone.dev'}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
