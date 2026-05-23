'use client';

import { ChevronDown, ChevronRight, ExternalLink } from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, mobileOpen, onCloseMobile }: SidebarProps) {
  // Local state for sidebar collapsible accordions
  const [myAccountOpen, setMyAccountOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    // Auto-close mobile drawer when tab is clicked
    onCloseMobile();
  };

  const isMeetingsTabActive = activeTab === 'meetings' || activeTab === 'schedule';
 
  const sidebarContent = (
    <div className="flex-1 flex flex-col text-left py-1 text-[13px]">
      {/* 1. Home Link */}
      <button
        onClick={() => handleTabClick('home')}
        className={`w-full h-[42px] pl-[48px] pr-[16px] flex items-center justify-start transition-colors focus:outline-none cursor-pointer rounded-none gap-[10px] text-[14px] ${
          activeTab === 'home'
            ? 'bg-[#e8f1ff] text-[#2563eb] font-[500] font-[500]'
            : 'text-[#303749] hover:bg-[#F1F3F5]/50 font-medium hover:text-[#2563eb]'
        }`}
      >
        <span>Home</span>
      </button>
  
      {/* 2. My Products Category Header */}
      <div className="text-[11px] font-[500] tracking-wider uppercase text-[#7c8594] pl-[38px] mt-[14px] mb-[8px] select-none">
        My Products
      </div>
  
      {/* 3. AI Companion Link */}
      <button
        onClick={() => {}}
        className="w-full h-[42px] pl-[48px] pr-[16px] text-[14px] font-medium text-[#303749] hover:bg-[#F1F3F5]/50 hover:text-[#2563eb] flex items-center justify-between focus:outline-none cursor-pointer rounded-none gap-[10px]"
      >
        <div className="flex items-center gap-1.5">
          <span>AI Companion</span>
          <span className="text-[8px] font-bold text-[#2563eb] border border-[#AECBFA] px-1 py-0.25 rounded-[3px] bg-[#e8f1ff] leading-none">
            New
          </span>
        </div>
        <ExternalLink className="w-[11px] h-[11px] opacity-[0.55] text-[#7c8594] shrink-0" />
      </button>
  
      {/* 4. Meetings Link */}
      <button
        onClick={() => handleTabClick('meetings')}
        className={`w-full h-[42px] pl-[48px] pr-[16px] flex items-center justify-start transition-colors focus:outline-none cursor-pointer rounded-none gap-[10px] text-[14px] ${
          isMeetingsTabActive
            ? 'bg-[#e8f1ff] text-[#2563eb] font-[500] font-[500]'
            : 'text-[#303749] hover:bg-[#F1F3F5]/50 font-medium hover:text-[#2563eb]'
        }`}
      >
        <span>Meetings</span>
      </button>
  
      {/* 5. Recordings */}
      <button
        onClick={() => {}}
        className="w-full h-[42px] pl-[48px] pr-[16px] text-[14px] font-medium text-[#303749] hover:bg-[#F1F3F5]/50 hover:text-[#2563eb] flex items-center justify-start focus:outline-none cursor-pointer rounded-none gap-[10px]"
      >
        <span>Recordings</span>
      </button>
  
      {/* 6. Summaries */}
      <button
        onClick={() => {}}
        className="w-full h-[42px] pl-[48px] pr-[16px] text-[14px] font-medium text-[#303749] hover:bg-[#F1F3F5]/50 hover:text-[#2563eb] flex items-center justify-start focus:outline-none cursor-pointer rounded-none gap-[10px]"
      >
        <span>Summaries</span>
      </button>
  
      {/* 7. Hub */}
      <button
        onClick={() => {}}
        className="w-full h-[42px] pl-[48px] pr-[16px] text-[14px] font-medium text-[#303749] hover:bg-[#F1F3F5]/50 hover:text-[#2563eb] flex items-center justify-between focus:outline-none cursor-pointer rounded-none gap-[10px]"
      >
        <div className="flex items-center gap-1.5">
          <span>Hub</span>
          <span className="text-[8px] font-bold text-[#2563eb] border border-[#AECBFA] px-1 py-0.25 rounded-[3px] bg-[#e8f1ff] leading-none">
            New
          </span>
        </div>
        <ExternalLink className="w-[11px] h-[11px] opacity-[0.55] text-[#7c8594] shrink-0" />
      </button>
  
      {/* 8. Whiteboards */}
      <button
        onClick={() => {}}
        className="w-full h-[42px] pl-[48px] pr-[16px] text-[14px] font-medium text-[#303749] hover:bg-[#F1F3F5]/50 hover:text-[#2563eb] flex items-center justify-between focus:outline-none cursor-pointer rounded-none gap-[10px]"
      >
        <span>Whiteboards</span>
        <ExternalLink className="w-[11px] h-[11px] opacity-[0.55] text-[#7c8594] shrink-0" />
      </button>
  
      {/* 9. Notes */}
      <button
        onClick={() => {}}
        className="w-full h-[42px] pl-[48px] pr-[16px] text-[14px] font-medium text-[#303749] hover:bg-[#F1F3F5]/50 hover:text-[#2563eb] flex items-center justify-start focus:outline-none cursor-pointer rounded-none gap-[10px]"
      >
        <span>Notes</span>
      </button>
  
      {/* 10. Clips */}
      <button
        onClick={() => {}}
        className="w-full h-[42px] pl-[48px] pr-[16px] text-[14px] font-medium text-[#303749] hover:bg-[#F1F3F5]/50 hover:text-[#2563eb] flex items-center justify-between focus:outline-none cursor-pointer rounded-none gap-[10px]"
      >
        <span>Clips</span>
        <ExternalLink className="w-[11px] h-[11px] opacity-[0.55] text-[#7c8594] shrink-0" />
      </button>
  
      {/* 11. Canvas */}
      <button
        onClick={() => {}}
        className="w-full h-[42px] pl-[48px] pr-[16px] text-[14px] font-medium text-[#303749] hover:bg-[#F1F3F5]/50 hover:text-[#2563eb] flex items-center justify-between focus:outline-none cursor-pointer rounded-none gap-[10px]"
      >
        <span>Canvas</span>
        <ExternalLink className="w-[11px] h-[11px] opacity-[0.55] text-[#7c8594] shrink-0" />
      </button>
  
      {/* 12. Tasks */}
      <button
        onClick={() => {}}
        className="w-full h-[42px] pl-[48px] pr-[16px] text-[14px] font-medium text-[#303749] hover:bg-[#F1F3F5]/50 hover:text-[#2563eb] flex items-center justify-between focus:outline-none cursor-pointer rounded-none gap-[10px]"
      >
        <span>Tasks</span>
        <ExternalLink className="w-[11px] h-[11px] opacity-[0.55] text-[#7c8594] shrink-0" />
      </button>
  
      {/* 13. Scheduler */}
      <button
        onClick={() => {}}
        className="w-full h-[42px] pl-[48px] pr-[16px] text-[14px] font-medium text-[#303749] hover:bg-[#F1F3F5]/50 hover:text-[#2563eb] flex items-center justify-between focus:outline-none cursor-pointer rounded-none gap-[10px]"
      >
        <span>Scheduler</span>
        <ExternalLink className="w-[11px] h-[11px] opacity-[0.55] text-[#7c8594] shrink-0" />
      </button>
  
      {/* 14. Discover More Products */}
      <button
        onClick={() => {}}
        className="w-full h-[42px] pl-[48px] pr-[16px] text-[14px] font-medium text-[#303749] hover:bg-[#F1F3F5]/50 hover:text-[#2563eb] flex items-center justify-start focus:outline-none cursor-pointer rounded-none gap-[10px]"
      >
        <span>Discover More Products</span>
      </button>
  
      {/* --- Collapsible Submenus (Bottom Sections) --- */}
  
      {/* A. My Account */}
      <div className="mt-[10px] border-t border-[#eceef2] pt-[8px]">
        <button
          onClick={() => setMyAccountOpen(!myAccountOpen)}
          className="w-full h-[42px] pl-[48px] pr-[16px] font-medium text-[14px] text-[#303749] hover:bg-[#F1F3F5]/50 hover:text-[#2563eb] flex items-center justify-between focus:outline-none cursor-pointer rounded-none gap-[10px]"
        >
          <span className={myAccountOpen ? 'text-[#2563eb] font-[500]' : ''}>My Account</span>
          {myAccountOpen ? (
            <ChevronDown className="w-[11px] h-[11px] text-[#7c8594]" />
          ) : (
            <ChevronRight className="w-[11px] h-[11px] text-[#7c8594]" />
          )}
        </button>
  
        {myAccountOpen && (
          <div className="py-0.5 space-y-0.5">
            <button className="w-full h-[32px] pl-[64px] pr-[16px] text-[#303749] hover:text-[#2563eb] hover:bg-[#F1F3F5]/50 flex items-center justify-start focus:outline-none font-medium cursor-pointer text-[13px] rounded-none">
              Profile
            </button>
            <button className="w-full h-[32px] pl-[64px] pr-[16px] text-[#303749] hover:text-[#2563eb] hover:bg-[#F1F3F5]/50 flex items-center justify-start focus:outline-none font-medium cursor-pointer text-[13px] rounded-none">
              Settings
            </button>
          </div>
        )}
      </div>
  
      {/* B. Admin */}
      <div className="mt-[10px] border-t border-[#eceef2] pt-[8px]">
        <button
          onClick={() => setAdminOpen(!adminOpen)}
          className="w-full h-[42px] pl-[48px] pr-[16px] font-medium text-[14px] text-[#303749] hover:bg-[#F1F3F5]/50 hover:text-[#2563eb] flex items-center justify-between focus:outline-none cursor-pointer rounded-none gap-[10px]"
        >
          <span className={adminOpen ? 'text-[#2563eb] font-[500]' : ''}>Admin</span>
          {adminOpen ? (
            <ChevronDown className="w-[11px] h-[11px] text-[#7c8594]" />
          ) : (
            <ChevronRight className="w-[11px] h-[11px] text-[#7c8594]" />
          )}
        </button>
  
        {adminOpen && (
          <div className="py-0.5 space-y-0.5">
            <button className="w-full h-[32px] pl-[64px] pr-[16px] text-[#303749] hover:text-[#2563eb] hover:bg-[#F1F3F5]/50 flex items-center justify-start focus:outline-none font-medium cursor-pointer text-[13px] rounded-none">
              User Management
            </button>
            <button className="w-full h-[32px] pl-[64px] pr-[16px] text-[#303749] hover:text-[#2563eb] hover:bg-[#F1F3F5]/50 flex items-center justify-start focus:outline-none font-medium cursor-pointer text-[13px] rounded-none">
              Room Management
            </button>
          </div>
        )}
      </div>
  
      {/* C. Support */}
      <div className="mt-[10px] border-t border-[#eceef2] pt-[8px]">
        <button
          onClick={() => setSupportOpen(!supportOpen)}
          className="w-full h-[42px] pl-[48px] pr-[16px] font-medium text-[14px] text-[#303749] hover:bg-[#F1F3F5]/50 hover:text-[#2563eb] flex items-center justify-between focus:outline-none cursor-pointer rounded-none gap-[10px]"
        >
          <span className={supportOpen ? 'text-[#2563eb] font-[500]' : ''}>Support</span>
          {supportOpen ? (
            <ChevronDown className="w-[11px] h-[11px] text-[#7c8594]" />
          ) : (
            <ChevronRight className="w-[11px] h-[11px] text-[#7c8594]" />
          )}
        </button>
  
        {supportOpen && (
          <div className="py-0.5 space-y-0.5">
            <button className="w-full h-[32px] pl-[64px] pr-[16px] text-[#303749] hover:text-[#2563eb] hover:bg-[#F1F3F5]/50 flex items-center justify-start focus:outline-none font-medium cursor-pointer text-[13px] rounded-none">
              Support Center
            </button>
            <button className="w-full h-[32px] pl-[64px] pr-[16px] text-[#303749] hover:text-[#2563eb] hover:bg-[#F1F3F5]/50 flex items-center justify-start focus:outline-none font-medium cursor-pointer text-[13px] rounded-none">
              Contact Support
            </button>
          </div>
        )}
      </div>
    </div>
  );
 
  return (
    <>
      {/* 1. Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-[240px] shrink-0 sticky top-[60px] h-[calc(100vh-60px)] self-start overflow-y-auto bg-[#f7f7f8] border-r border-[#e5e7eb] select-none pt-[10px] pb-[12px]">
        {sidebarContent}
      </aside>
 
      {/* 2. Mobile Responsive Slide-out Overlay Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden select-none">
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-black/40 transition-opacity" 
            onClick={onCloseMobile} 
          />
          
          {/* Slide-out Drawer Panel */}
          <aside className="relative w-[240px] h-full bg-[#f7f7f8] shadow-2xl flex flex-col overflow-y-auto pt-[10px] pb-[12px] animate-slide-in-left border-r border-[#e5e7eb]">
            <div className="px-5 pb-4 border-b border-[#e5e7eb] flex items-center justify-between mb-2">
              <span className="text-gray-900 font-extrabold text-[18px] tracking-tight">zoom</span>
              <button 
                onClick={onCloseMobile} 
                className="text-gray-500 hover:text-gray-900 font-bold text-xs cursor-pointer p-1"
              >
                Close
              </button>
            </div>
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
