'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ChevronDown, Globe, Star, ChevronRight, Check } from 'lucide-react';
import Link from 'next/link';

export default function ZoomGuestHomepage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect authenticated users
  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-t-[#0B5CFF] border-gray-200 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#111111] font-sans antialiased overflow-x-hidden">
      
      {/* HEADER / NAVBAR */}
      <header className="w-full h-[58px] bg-[#050b1f] flex items-center shrink-0 sticky top-0 z-50">
        <div className="w-full max-w-[1440px] mx-auto px-[24px] flex items-center justify-between">
          <div className="flex items-center gap-[28px]">
            <Link href="/" className="flex items-center select-none focus:outline-none">
              <span className="text-white text-[28px] font-[800] tracking-tighter leading-none select-none">zoom</span>
            </Link>
            <nav className="hidden lg:flex items-center gap-[28px]">
              <button className="cursor-pointer text-[14px] font-[500] text-white/92 hover:text-white transition-colors focus:outline-none flex items-center gap-1">Products <ChevronDown className="w-3.5 h-3.5 opacity-70" /></button>
              <button className="cursor-pointer text-[14px] font-[500] text-white/92 hover:text-white transition-colors focus:outline-none flex items-center gap-1">Solutions <ChevronDown className="w-3.5 h-3.5 opacity-70" /></button>
              <button className="cursor-pointer text-[14px] font-[500] text-white/92 hover:text-white transition-colors focus:outline-none flex items-center gap-1">Resources <ChevronDown className="w-3.5 h-3.5 opacity-70" /></button>
              <Link href="#" className="text-[14px] font-[500] text-white/92 hover:text-white transition-colors focus:outline-none">Plans</Link>
            </nav>
          </div>
          <div className="flex items-center gap-[18px]">
            <button className="cursor-pointer hidden xl:flex items-center gap-1 text-[14px] font-[500] text-white/92 hover:text-white transition-colors focus:outline-none">
              <Globe className="w-4 h-4" /> EN <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </button>
            <Link href="#" className="hidden md:block text-[14px] font-[500] text-white/92 hover:text-white transition-colors focus:outline-none">Support</Link>
            
            <button onClick={() => router.push('/login')} className="cursor-pointer text-[14px] font-[500] text-white/92 hover:text-white transition-colors focus:outline-none">Sign In</button>
            <button className="cursor-pointer hidden md:block h-[38px] px-6 rounded-[6px] border border-white/40 text-white text-[14px] font-[600] hover:bg-white/10 transition-colors focus:outline-none">Request a Demo</button>
            <button onClick={() => router.push('/register')} className="h-[38px] px-6 rounded-[6px] bg-[#0b5cff] text-white text-[14px] font-[600] hover:bg-[#004BD6] transition-colors focus:outline-none">Sign Up Free</button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="w-full bg-gradient-to-b from-[#050b1f] to-[#1d4ed8] overflow-hidden" style={{ paddingTop: '80px', paddingBottom: '96px' }}>
        <div className="max-w-[1440px] mx-auto px-[24px] flex flex-col items-center text-center">
          <h1 className="text-white text-[64px] font-[800] leading-[68px] max-w-[760px]">
            Find out what's possible when work connects
          </h1>
          <p className="text-[20px] leading-[32px] text-white/80 max-w-[700px]" style={{ marginTop: '24px' }}>
            Zoom Workplace brings communication, collaboration, and AI together on one platform.
          </p>
          <div className="flex items-center justify-center gap-[14px]" style={{ marginTop: '40px', marginBottom: '80px' }}>
            <button onClick={() => router.push('/register')} className="h-[48px] px-8 rounded-[6px] bg-white text-[#050b1f] text-[16px] font-[700] hover:bg-gray-100 transition-colors shadow-sm focus:outline-none">Sign up, it's free</button>
            <button className="cursor-pointer h-[48px] px-8 rounded-[6px] bg-transparent border border-white/50 text-white text-[16px] font-[700] hover:bg-white/10 transition-colors focus:outline-none">Contact sales</button>
          </div>

          {/* FEATURE CAROUSEL ROW */}
          <div className="flex flex-nowrap items-center justify-center gap-[32px] w-full overflow-x-auto pb-[20px] hide-scrollbar snap-x">
            
            {/* Card 1 */}
            <div className="w-[220px] h-[250px] rounded-[18px] overflow-hidden relative shrink-0 snap-center group cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.1)] border border-white/10">
              <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=400" alt="Meetings" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050b1f]/90 via-[#050b1f]/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col items-center text-center">
                <span className="text-white text-[18px] font-[700] mb-1">Meetings</span>
                <span className="text-white/80 text-[13px] font-[500] group-hover:text-white transition-colors">Learn more &rarr;</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="w-[220px] h-[250px] rounded-[18px] overflow-hidden relative shrink-0 snap-center group cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.1)] border border-white/10">
              <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=400" alt="Team Chat" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050b1f]/90 via-[#050b1f]/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col items-center text-center">
                <span className="text-white text-[18px] font-[700] mb-1">Team Chat</span>
                <span className="text-white/80 text-[13px] font-[500] group-hover:text-white transition-colors">Learn more &rarr;</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="w-[220px] h-[250px] rounded-[18px] overflow-hidden relative shrink-0 snap-center group cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.1)] border border-white/10">
              <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=400" alt="Phone" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050b1f]/90 via-[#050b1f]/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col items-center text-center">
                <span className="text-white text-[18px] font-[700] mb-1">Zoom Phone</span>
                <span className="text-white/80 text-[13px] font-[500] group-hover:text-white transition-colors">Learn more &rarr;</span>
              </div>
            </div>

            {/* Card 4 */}
            <div className="w-[220px] h-[250px] rounded-[18px] overflow-hidden relative shrink-0 snap-center group cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.1)] border border-white/10">
              <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=400" alt="Rooms" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050b1f]/90 via-[#050b1f]/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col items-center text-center">
                <span className="text-white text-[18px] font-[700] mb-1">Zoom Rooms</span>
                <span className="text-white/80 text-[13px] font-[500] group-hover:text-white transition-colors">Learn more &rarr;</span>
              </div>
            </div>

            {/* Card 5 */}
            <div className="w-[220px] h-[250px] rounded-[18px] overflow-hidden relative shrink-0 snap-center group cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.1)] border border-white/10">
              <img src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=400" alt="AI Companion" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050b1f]/90 via-[#050b1f]/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col items-center text-center">
                <span className="text-white text-[18px] font-[700] mb-1">AI Companion</span>
                <span className="text-white/80 text-[13px] font-[500] group-hover:text-white transition-colors">Learn more &rarr;</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* TRUSTED LOGOS SECTION */}
      <section className="bg-white border-b border-[#e7e9ee]" style={{ padding: '60px 0' }}>
        <div className="max-w-[1440px] mx-auto px-[24px] flex flex-col items-center">
          <p className="text-[14px] font-[600] text-[#6b7280] mb-8 uppercase tracking-widest text-center">Trusted by millions of enterprises worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-[60px] opacity-60 grayscale">
            <svg viewBox="0 0 100 30" className="h-6"><text x="0" y="22" fontSize="24" fontWeight="bold" fill="#111">Uber</text></svg>
            <svg viewBox="0 0 100 30" className="h-6"><text x="0" y="22" fontSize="24" fontWeight="bold" fill="#111">Rakuten</text></svg>
            <svg viewBox="0 0 100 30" className="h-6"><text x="0" y="22" fontSize="24" fontWeight="bold" fill="#111">Nasdaq</text></svg>
            <svg viewBox="0 0 100 30" className="h-6"><text x="0" y="22" fontSize="24" fontWeight="bold" fill="#111">VMware</text></svg>
            <svg viewBox="0 0 100 30" className="h-6"><text x="0" y="22" fontSize="24" fontWeight="bold" fill="#111">Target</text></svg>
          </div>
        </div>
      </section>

      {/* MY NOTES SECTION */}
      <section className="bg-white" style={{ padding: '60px 0' }}>
        <div className="max-w-[1440px] mx-auto px-[24px] flex flex-col items-center text-center">
          <h2 className="text-[52px] font-[800] text-[#111111] leading-tight mb-2">AI-powered note taking</h2>
          <p className="text-[24px] font-[600] text-[#4b5563] mb-8">Focus on the meeting, not the minutes.</p>
          <button className="cursor-pointer h-[40px] px-6 rounded-full bg-[#0b5cff] text-white text-[14px] font-[600] hover:bg-[#004BD6] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.03)] focus:outline-none mb-12">
            Explore My Notes
          </button>
          
          <div className="w-full max-w-[1000px] rounded-[16px] shadow-[0_12px_40px_rgba(0,0,0,0.1)] border border-[#e7e9ee] overflow-hidden bg-white">
            <div className="h-[44px] bg-[#f8f9fa] border-b border-[#e7e9ee] flex items-center px-4">
               <div className="flex gap-2">
                 <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                 <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                 <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
               </div>
            </div>
            <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200" alt="Meeting Dashboard" className="w-full h-auto object-cover" />
          </div>
        </div>
      </section>

      {/* REPORT CARDS ROW */}
      <section className="bg-gray-50" style={{ padding: '60px 0' }}>
        <div className="max-w-[1440px] mx-auto px-[24px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[100px]">
            
            <div className="h-[320px] rounded-[18px] bg-white border border-[#e7e9ee] shadow-[0_1px_2px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col relative group cursor-pointer">
              <img src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=600" className="w-full h-[180px] object-cover group-hover:scale-105 transition-transform duration-500" alt="Report" />
              <div className="p-6 flex-1 flex flex-col justify-between bg-white z-10 text-center">
                <h3 className="text-[20px] font-[700] text-[#111111]">UCaaS Industry Leader</h3>
                <span className="text-[#0b5cff] text-[14px] font-[600]">Read Report &rarr;</span>
              </div>
            </div>

            <div className="h-[320px] rounded-[18px] bg-white border border-[#e7e9ee] shadow-[0_1px_2px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col relative group cursor-pointer">
              <img src="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&q=80&w=600" className="w-full h-[180px] object-cover group-hover:scale-105 transition-transform duration-500" alt="Report" />
              <div className="p-6 flex-1 flex flex-col justify-between bg-white z-10 text-center">
                <h3 className="text-[20px] font-[700] text-[#111111]">Best Software Award 2024</h3>
                <span className="text-[#0b5cff] text-[14px] font-[600]">View Awards &rarr;</span>
              </div>
            </div>

            <div className="h-[320px] rounded-[18px] bg-white border border-[#e7e9ee] shadow-[0_1px_2px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col relative group cursor-pointer">
              <img src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?auto=format&fit=crop&q=80&w=600" className="w-full h-[180px] object-cover group-hover:scale-105 transition-transform duration-500" alt="Report" />
              <div className="p-6 flex-1 flex flex-col justify-between bg-white z-10 text-center">
                <h3 className="text-[20px] font-[700] text-[#111111]">Global Enterprise ROI</h3>
                <span className="text-[#0b5cff] text-[14px] font-[600]">Download Study &rarr;</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ONE PLATFORM SECTION */}
      <section className="bg-white" style={{ padding: '60px 0' }}>
        <div className="max-w-[1440px] mx-auto px-[24px] grid grid-cols-1 lg:grid-cols-1 gap-[60px] items-center">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-[56px] font-[800] leading-[64px] text-[#111111]" style={{ marginBottom: '40px' }}>One platform.<br/>Limitless connection.</h2>
            
            <div className="flex items-center justify-center gap-[24px] border-b border-[#e7e9ee] overflow-x-auto hide-scrollbar w-full max-w-[600px]" style={{ marginBottom: '40px' }}>
              <button className="cursor-pointer pb-3 border-b-2 border-[#0b5cff] text-[#111111] font-[700] text-[16px] whitespace-nowrap">Collaborate</button>
              <button className="cursor-pointer pb-3 border-b-2 border-transparent text-[#6b7280] font-[500] text-[16px] whitespace-nowrap">Organize</button>
              <button className="cursor-pointer pb-3 border-b-2 border-transparent text-[#6b7280] font-[500] text-[16px] whitespace-nowrap">Workspaces</button>
              <button className="cursor-pointer pb-3 border-b-2 border-transparent text-[#6b7280] font-[500] text-[16px] whitespace-nowrap">Events</button>
            </div>

            <p className="text-[16px] text-[#4b5563] font-[400] leading-[26px]" style={{ marginBottom: '32px' }}>
              Keep teamwork moving seamlessly with AI-powered meeting notes, team chat, whiteboards, and intelligent tools that integrate perfectly.
            </p>
            <ul className="space-y-4" style={{ marginBottom: '40px' }}>
              <li className="flex items-center gap-3"><Check className="w-5 h-5 text-[#0b5cff]" /><span className="text-[16px] font-[500] text-[#111111]">Streamlined communication channels</span></li>
              <li className="flex items-center gap-3"><Check className="w-5 h-5 text-[#0b5cff]" /><span className="text-[16px] font-[500] text-[#111111]">Integrated enterprise-grade security</span></li>
              <li className="flex items-center gap-3"><Check className="w-5 h-5 text-[#0b5cff]" /><span className="text-[16px] font-[500] text-[#111111]">Scalable solutions for growing teams</span></li>
            </ul>
            <button className="cursor-pointer h-[48px] px-8 rounded-full bg-[#0b5cff] text-white text-[16px] font-[600] w-max hover:bg-[#004BD6] transition-colors focus:outline-none shadow-[0_1px_2px_rgba(0,0,0,0.03)]" style={{ marginTop: '10px' }}>
              Discover Zoom Workplace
            </button>
          </div>
          <div className="relative rounded-[24px] overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.1)] border border-[#e7e9ee] bg-gray-100 h-full min-h-[400px]">
             <img src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=1000" className="absolute inset-0 w-full h-full object-cover" alt="Platform Screenshot" />
          </div>
        </div>
      </section>

      {/* RATINGS SECTION */}
      <section className="bg-gray-50 border-y border-[#e7e9ee]" style={{ padding: '60px 0' }}>
         <div className="max-w-[1440px] mx-auto px-[24px] grid grid-cols-1 md:grid-cols-3 gap-[100px] text-center">
            <div className="flex flex-col items-center">
              <div className="flex text-[#ffb000] mb-3">
                <Star className="w-6 h-6 fill-current" /><Star className="w-6 h-6 fill-current" /><Star className="w-6 h-6 fill-current" /><Star className="w-6 h-6 fill-current" /><Star className="w-6 h-6 fill-current" />
              </div>
              <span className="text-[48px] font-[800] text-[#111111] leading-none mb-1">4.6</span>
              <span className="text-[14px] text-[#6b7280] font-[500]">G2 Crowd Reviews</span>
            </div>
            <div className="flex flex-col items-center md:border-l md:border-r border-[#e7e9ee]">
              <div className="flex text-[#ffb000] mb-3">
                <Star className="w-6 h-6 fill-current" /><Star className="w-6 h-6 fill-current" /><Star className="w-6 h-6 fill-current" /><Star className="w-6 h-6 fill-current" /><Star className="w-6 h-6 fill-current" />
              </div>
              <span className="text-[48px] font-[800] text-[#111111] leading-none mb-1">4.7</span>
              <span className="text-[14px] text-[#6b7280] font-[500]">App Store Reviews</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex text-[#ffb000] mb-3">
                <Star className="w-6 h-6 fill-current" /><Star className="w-6 h-6 fill-current" /><Star className="w-6 h-6 fill-current" /><Star className="w-6 h-6 fill-current" /><Star className="w-6 h-6 fill-current" />
              </div>
              <span className="text-[48px] font-[800] text-[#111111] leading-none mb-1">4.5</span>
              <span className="text-[14px] text-[#6b7280] font-[500]">TrustRadius Score</span>
            </div>
         </div>
      </section>

      {/* CUSTOMER STORIES */}
      <section className="bg-white" style={{ padding: '60px 0' }}>
        <div className="max-w-[1440px] mx-auto px-[24px]">
          <h2 className="text-[40px] font-[800] text-[#111111] mb-[40px] text-center md:text-center">Powering modern teams</h2>
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-[100px]">
            {/* Featured Case Study */}
            <div className="h-[380px] rounded-[20px] overflow-hidden relative group cursor-pointer border border-[#e7e9ee] shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
               <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1000" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Customer" />
               <div className="absolute inset-0 bg-gradient-to-t from-[#050b1f] via-[#050b1f]/60 to-transparent" />
               <div className="absolute inset-0 p-8 flex flex-col justify-end text-center items-center">
                 <h3 className="text-white text-[28px] font-[800] leading-[36px] mb-4">"Zoom has unified our global workforce, increasing collaboration efficiency by 45%."</h3>
                 <span className="text-white/80 font-[500] text-[14px] flex items-center gap-2 hover:text-white transition-colors cursor-pointer w-max">Read Case Study <ChevronRight className="w-4 h-4" /></span>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEWS SECTION */}
      <section className="bg-gray-50" style={{ padding: '60px 0' }}>
        <div className="max-w-[1440px] mx-auto px-[24px]">
          <h2 className="text-[32px] font-[800] text-[#111111] mb-[40px] text-center md:text-center">Latest from Zoom</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[100px]">
            <div className="h-[260px] rounded-[18px] overflow-hidden relative group cursor-pointer border border-[#e7e9ee] shadow-[0_1px_2px_rgba(0,0,0,0.03)] bg-gradient-to-tr from-[#050b1f] to-[#1d4ed8]">
              <div className="absolute inset-0 p-8 flex flex-col justify-end text-center">
                <span className="text-white/70 text-[13px] font-[600] mb-2 uppercase tracking-wider">Product News</span>
                <h3 className="text-white text-[20px] font-[800] leading-[28px]">Zoom AI Companion Expands Language Support</h3>
              </div>
            </div>
            <div className="h-[260px] rounded-[18px] overflow-hidden relative group cursor-pointer border border-[#e7e9ee] shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
               <img src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=800" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="News" />
               <div className="absolute inset-0 bg-gradient-to-t from-[#050b1f]/90 to-transparent" />
               <div className="absolute inset-0 p-8 flex flex-col justify-end text-center">
                 <span className="text-white/70 text-[13px] font-[600] mb-2 uppercase tracking-wider">Company</span>
                 <h3 className="text-white text-[20px] font-[800] leading-[28px]">Q1 2026 Earnings and Growth Strategy</h3>
               </div>
            </div>
            <div className="h-[260px] rounded-[18px] overflow-hidden relative group cursor-pointer border border-[#e7e9ee] shadow-[0_1px_2px_rgba(0,0,0,0.03)] bg-gradient-to-tr from-[#1e293b] to-[#475569]">
              <div className="absolute inset-0 p-8 flex flex-col justify-end text-center">
                <span className="text-white/70 text-[13px] font-[600] mb-2 uppercase tracking-wider">Awards</span>
                <h3 className="text-white text-[20px] font-[800] leading-[28px]">Recognized as Top Workplace 2026</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-white" style={{ padding: '60px 0' }}>
        <div className="max-w-[1440px] mx-auto px-[24px] flex flex-col items-center text-center">
           <h2 className="text-[40px] font-[800] text-[#111111] mb-8">See what Zoom can do for your business</h2>
           <div className="flex items-center gap-[14px]">
              <button className="cursor-pointer h-[48px] px-8 rounded-[6px] bg-[#0b5cff] text-white text-[16px] font-[600] hover:bg-[#004BD6] transition-colors focus:outline-none">Explore products</button>
              <button className="cursor-pointer h-[48px] px-[60px] rounded-[6px] bg-white border border-[#e7e9ee] text-[#111111] text-[16px] font-[600] hover:bg-gray-100 transition-colors focus:outline-none shadow-[0_1px_2px_rgba(0,0,0,0.03)]">Find your plan</button>
           </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full bg-[#050b1f] text-[#e7e9ee] shrink-0" style={{ padding: '80px 40px' }}>
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 text-left" style={{ gap: '40px', marginBottom: '60px' }}>
            {/* Left Section - Logo & Dropdowns */}
            <div className="col-span-1 lg:col-span-3 flex flex-col gap-[24px]">
              <div className="text-white text-[36px] font-[800] tracking-tighter leading-none mb-2">zoom</div>
              <div className="flex items-center gap-3 p-3 rounded-xl border border-white/20 hover:bg-white/5 transition-colors cursor-pointer w-max mb-2">
                 <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                    <span className="text-white font-[700] text-[13px]">App</span>
                 </div>
                 <div className="flex flex-col text-left">
                   <span className="text-white text-[14px] font-[600]">Download the App</span>
                   <span className="text-white/60 text-[12px]">iOS and Android</span>
                 </div>
              </div>
              <div className="flex flex-col gap-3 w-[220px]">
                 <button className="cursor-pointer flex items-center justify-between px-4 py-3 border border-white/20 rounded-lg text-[14px] hover:border-white/40 transition-colors bg-[#0b1021] text-white">
                    English <ChevronDown className="w-4 h-4 opacity-70" />
                 </button>
                 <button className="cursor-pointer flex items-center justify-between px-4 py-3 border border-white/20 rounded-lg text-[14px] hover:border-white/40 transition-colors bg-[#0b1021] text-white">
                    US Dollars $ <ChevronDown className="w-4 h-4 opacity-70" />
                 </button>
              </div>
            </div>

            {/* Right Section - Links Grid */}
            <div className="col-span-1 lg:col-span-9 grid grid-cols-2 md:grid-cols-4 gap-[40px] lg:pl-[60px]">
              <div className="flex flex-col gap-4">
                <h4 className="text-white font-[700] text-[16px] mb-2">About</h4>
                <Link href="#" className="text-white/70 hover:text-white transition-colors text-[14px]">Zoom Blog</Link>
                <Link href="#" className="text-white/70 hover:text-white transition-colors text-[14px]">Customers</Link>
                <Link href="#" className="text-white/70 hover:text-white transition-colors text-[14px]">Our Team</Link>
                <Link href="#" className="text-white/70 hover:text-white transition-colors text-[14px]">Careers</Link>
                <Link href="#" className="text-white/70 hover:text-white transition-colors text-[14px]">Integrations</Link>
                <Link href="#" className="text-white/70 hover:text-white transition-colors text-[14px]">Partners</Link>
                <Link href="#" className="text-white/70 hover:text-white transition-colors text-[14px]">Investors</Link>
                <Link href="#" className="text-white/70 hover:text-white transition-colors text-[14px]">Media Kit</Link>
              </div>
              <div className="flex flex-col gap-4">
                <h4 className="text-white font-[700] text-[16px] mb-2">Download</h4>
                <Link href="#" className="text-white/70 hover:text-white transition-colors text-[14px]">Meetings Client</Link>
                <Link href="#" className="text-white/70 hover:text-white transition-colors text-[14px]">Zoom Rooms Client</Link>
                <Link href="#" className="text-white/70 hover:text-white transition-colors text-[14px]">Browser Extension</Link>
                <Link href="#" className="text-white/70 hover:text-white transition-colors text-[14px]">Outlook Plug-in</Link>
                <Link href="#" className="text-white/70 hover:text-white transition-colors text-[14px]">Lync Plug-in</Link>
                <Link href="#" className="text-white/70 hover:text-white transition-colors text-[14px]">iPhone/iPad App</Link>
                <Link href="#" className="text-white/70 hover:text-white transition-colors text-[14px]">Android App</Link>
              </div>
              <div className="flex flex-col gap-4">
                <h4 className="text-white font-[700] text-[16px] mb-2">Sales</h4>
                <Link href="#" className="text-white/70 hover:text-white transition-colors text-[14px]">1.888.799.9666</Link>
                <Link href="#" className="text-white/70 hover:text-white transition-colors text-[14px]">Contact Sales</Link>
                <Link href="#" className="text-white/70 hover:text-white transition-colors text-[14px]">Plans & Pricing</Link>
                <Link href="#" className="text-white/70 hover:text-white transition-colors text-[14px]">Request a Demo</Link>
                <Link href="#" className="text-white/70 hover:text-white transition-colors text-[14px]">Webinars and Events</Link>
              </div>
              <div className="flex flex-col gap-4">
                <h4 className="text-white font-[700] text-[16px] mb-2">Support</h4>
                <Link href="#" className="text-white/70 hover:text-white transition-colors text-[14px]">Test Zoom</Link>
                <Link href="#" className="text-white/70 hover:text-white transition-colors text-[14px]">Account</Link>
                <Link href="#" className="text-white/70 hover:text-white transition-colors text-[14px]">Support Center</Link>
                <Link href="#" className="text-white/70 hover:text-white transition-colors text-[14px]">Live Training</Link>
                <Link href="#" className="text-white/70 hover:text-white transition-colors text-[14px]">Feedback</Link>
                <Link href="#" className="text-white/70 hover:text-white transition-colors text-[14px]">Accessibility</Link>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/20 pt-[40px] pb-[20px] flex flex-col md:flex-row items-center justify-between gap-[20px]">
            <div className="flex flex-col md:flex-row items-center gap-[24px]">
              <span className="text-[12px] text-white/50 font-[500]">Copyright ©2026 Zoom Video Communications, Inc. All rights reserved.</span>
              <div className="flex items-center gap-[24px]">
                <Link href="#" className="text-[12px] text-white/70 hover:text-white transition-colors">Terms</Link>
                <Link href="#" className="text-[12px] text-white/70 hover:text-white transition-colors">Privacy</Link>
                <Link href="#" className="text-[12px] text-white/70 hover:text-white transition-colors">Trust Center</Link>
                <Link href="#" className="text-[12px] text-white/70 hover:text-white transition-colors">Legal & Compliance</Link>
                <Link href="#" className="text-[12px] text-white/70 hover:text-white transition-colors">Do Not Sell My Personal Information</Link>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
               <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer text-white"><Globe className="w-4 h-4"/></div>
               <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer text-white"><Globe className="w-4 h-4"/></div>
               <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer text-white"><Globe className="w-4 h-4"/></div>
               <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer text-white"><Globe className="w-4 h-4"/></div>
               <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer text-white"><Globe className="w-4 h-4"/></div>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
