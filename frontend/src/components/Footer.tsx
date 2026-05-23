'use client';

import { ChevronDown } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#23233f] text-white/90 font-sans border-t border-white/5 select-none text-left mt-[24px] w-full shrink-0" style={{ paddingTop: '64px', paddingBottom: '48px', paddingLeft: '80px', paddingRight: '80px' }}>
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-[40px]">
        {/* Column 1: About */}
        <div className="flex flex-col space-y-[2px] lg:ml-[40px]">
          <h4 className="text-[15px] font-bold text-white mb-[14px]">About</h4>
          <ul className="text-[13px] font-normal text-white/80 flex flex-col space-y-0.5 leading-[28px]">
            <li><a href="#" className="hover:text-white transition-colors leading-[28px] block">Zoom Blog</a></li>
            <li><a href="#" className="hover:text-white transition-colors leading-[28px] block">Customers</a></li>
            <li><a href="#" className="hover:text-white transition-colors leading-[28px] block">Our Team</a></li>
            <li><a href="#" className="hover:text-white transition-colors leading-[28px] block">Careers</a></li>
            <li><a href="#" className="hover:text-white transition-colors leading-[28px] block">Integrations</a></li>
            <li><a href="#" className="hover:text-white transition-colors leading-[28px] block">Partners</a></li>
            <li><a href="#" className="hover:text-white transition-colors leading-[28px] block">Investors</a></li>
            <li><a href="#" className="hover:text-white transition-colors leading-[28px] block">Press</a></li>
            <li><a href="#" className="hover:text-white transition-colors leading-[28px] block">Sustainability & ESG</a></li>
            <li><a href="#" className="hover:text-white transition-colors leading-[28px] block">Zoom Cares</a></li>
            <li><a href="#" className="hover:text-white transition-colors leading-[28px] block">Media Kit</a></li>
            <li><a href="#" className="hover:text-white transition-colors leading-[28px] block">How to Videos</a></li>
            <li><a href="#" className="hover:text-white transition-colors leading-[28px] block">Developer Platform</a></li>
            <li><a href="#" className="hover:text-white transition-colors leading-[28px] block">Zoom Ventures</a></li>
            <li><a href="#" className="hover:text-white transition-colors leading-[28px] block">Zoom Merchandise Store</a></li>
          </ul>
        </div>

        {/* Column 2: Download */}
        <div className="flex flex-col space-y-[2px]">
          <h4 className="text-[15px] font-bold text-white mb-[14px]">Download</h4>
          <ul className="text-[13px] font-normal text-white/80 flex flex-col space-y-0.5 leading-[28px]">
            <li><a href="#" className="hover:text-white transition-colors leading-[28px] block">Zoom Workplace App</a></li>
            <li><a href="#" className="hover:text-white transition-colors leading-[28px] block">Zoom Rooms Client</a></li>
            <li><a href="#" className="hover:text-white transition-colors leading-[28px] block">Browser Extension</a></li>
            <li><a href="#" className="hover:text-white transition-colors leading-[28px] block">Outlook Plug-in</a></li>
            <li><a href="#" className="hover:text-white transition-colors leading-[28px] block">Zoom Plugin for HCL Notes</a></li>
            <li><a href="#" className="hover:text-white transition-colors leading-[28px] block">Zoom Plugin Admin Tool for HCL Notes</a></li>
            <li><a href="#" className="hover:text-white transition-colors leading-[28px] block">Android App</a></li>
            <li><a href="#" className="hover:text-white transition-colors leading-[28px] block">Zoom Virtual Backgrounds</a></li>
          </ul>
        </div>

        {/* Column 3: Sales */}
        <div className="flex flex-col space-y-[2px]">
          <h4 className="text-[15px] font-bold text-white mb-[14px]">Sales</h4>
          <ul className="text-[13px] font-normal text-white/80 flex flex-col space-y-0.5 leading-[28px]">
            <li><span className="text-[#D0D2DE]/90 font-semibold select-text leading-[28px] block">0008000503335</span></li>
            <li><a href="#" className="hover:text-white transition-colors leading-[28px] block">Contact Sales</a></li>
            <li><a href="#" className="hover:text-white transition-colors leading-[28px] block">Plans & Pricing</a></li>
            <li><a href="#" className="hover:text-white transition-colors leading-[28px] block">Request a Demo</a></li>
            <li><a href="#" className="hover:text-white transition-colors leading-[28px] block">Webinars and Events</a></li>
            <li><a href="#" className="hover:text-white transition-colors leading-[28px] block">Zoom Experience Center</a></li>
          </ul>
        </div>

        {/* Column 4: Support */}
        <div className="flex flex-col space-y-[2px]">
          <h4 className="text-[15px] font-bold text-white mb-[14px]">Support</h4>
          <ul className="text-[13px] font-normal text-white/80 flex flex-col space-y-0.5 leading-[28px]">
            <li><a href="#" className="hover:text-white transition-colors leading-[28px] block">Test Zoom</a></li>
            <li><a href="#" className="hover:text-white transition-colors leading-[28px] block">Account</a></li>
            <li><a href="#" className="hover:text-white transition-colors leading-[28px] block">Support Center</a></li>
            <li><a href="#" className="hover:text-white transition-colors leading-[28px] block">Learning Center</a></li>
            <li><a href="#" className="hover:text-white transition-colors leading-[28px] block">Zoom Workplace App</a></li>
            <li><a href="#" className="hover:text-white transition-colors leading-[28px] block">Feedback</a></li>
            <li><a href="#" className="hover:text-white transition-colors leading-[28px] block">Contact Us</a></li>
            <li><a href="#" className="hover:text-white transition-colors leading-[28px] block">Accessibility</a></li>
            <li><a href="#" className="hover:text-white transition-colors leading-[28px] block">Developer support</a></li>
            <li><a href="#" className="hover:text-white transition-colors leading-[28px] block">Privacy, Security, Legal Policies, and Modern Slavery Act</a></li>
            <li><a href="#" className="hover:text-white transition-colors leading-[28px] block">Transparency Statement</a></li>
          </ul>
        </div>

        {/* Column 5: Settings / Language & Currency & Socials */}
        <div className="space-y-4 flex flex-col">
          {/* Language */}
          <div className="space-y-1">
            <h4 className="text-[15px] font-bold text-white mb-[14px]">Language</h4>
            <div className="relative w-40">
              <select className="appearance-none w-full bg-[#2F344C] border border-[#484F6E] text-white font-semibold text-[13px] rounded-lg px-3 py-2 pr-7 hover:bg-[#383E5B] transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#0E71EB]">
                <option>English</option>
                <option>Español</option>
                <option>Français</option>
                <option>Deutsch</option>
                <option>日本語</option>
              </select>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <ChevronDown className="w-3 h-3" />
              </div>
            </div>
          </div>
 
          {/* Currency */}
          <div className="space-y-1">
            <h4 className="text-[15px] font-bold text-white mb-[14px]">Currency</h4>
            <div className="relative w-40">
              <select className="appearance-none w-full bg-[#2F344C] border border-[#484F6E] text-white font-semibold text-[13px] rounded-lg px-3 py-2 pr-7 hover:bg-[#383E5B] transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#0E71EB]">
                <option>Indian Rupee ₹</option>
                <option>US Dollar $</option>
                <option>Euro €</option>
                <option>British Pound £</option>
              </select>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <ChevronDown className="w-3 h-3" />
              </div>
            </div>
          </div>
 
          {/* Social Icons row */}
          <div className="pt-2 flex flex-wrap items-center gap-[10px]">
            {/* WordPress icon */}
            <a href="#" className="w-[30px] h-[30px] rounded-full bg-white/8 hover:bg-[#0b5cff] text-white flex items-center justify-center transition-colors">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                <path d="M12.158 12.786l-2.698 7.84c.813.254 1.678.394 2.576.394.757 0 1.487-.1 2.19-.288-.04-.012-.078-.027-.116-.04l-2.812-7.906zm-4.708-3.95c.29-.028.562-.056.815-.056.407 0 .76.014 1.05.014.288 0 .668-.014 1.14-.014.506 0 .993.028 1.446.056.126.01.21-.085.195-.197-.013-.1-.082-.14-.247-.14-.492.014-1.042.028-1.57.028-.52 0-1.127-.014-1.74-.028-.14 0-.21.056-.21.14 0 .098.07.183.16.197zm5.542 3.652c.07.225.127.464.127.717 0 .52-.225 1.054-.422 1.49l-2.094 5.92c3.415-1.42 5.864-4.8 5.864-8.777 0-1.168-.225-2.28-.604-3.32l-2.87 3.97zm-5.076-1.533l2.87 8.356c.14.408.28.816.28 1.223 0 1.055-.773 2.025-1.617 2.025-.562 0-1.012-.422-1.378-1.11L4.697 10.96c-.464 1.745-.717 3.587-.717 5.485 0 2.222.394 4.332 1.11 6.273l2.84-8.256zM12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"/>
              </svg>
            </a>
            {/* LinkedIn */}
            <a href="#" className="w-[30px] h-[30px] rounded-full bg-white/8 hover:bg-[#0b5cff] text-white flex items-center justify-center transition-colors">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
            {/* Twitter/X */}
            <a href="#" className="w-[30px] h-[30px] rounded-full bg-white/8 hover:bg-[#0b5cff] text-white flex items-center justify-center transition-colors">
              <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            {/* YouTube */}
            <a href="#" className="w-[30px] h-[30px] rounded-full bg-white/8 hover:bg-[#0b5cff] text-white flex items-center justify-center transition-colors">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                <path d="M23.498 6.163c-.272-1.022-1.074-1.826-2.097-2.098C19.558 3.5 12 3.5 12 3.5s-7.558 0-9.401.565c-1.023.272-1.825 1.076-2.098 2.098C0 8.006 0 12 0 12s0 3.994.565 5.837c.273 1.022 1.075 1.826 2.098 2.098C4.442 20.5 12 20.5 12 20.5s7.558 0 9.401-.565c1.023-.272 1.825-1.076 2.098-2.098C24 15.994 24 12 24 12s0-3.994-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
            {/* Facebook */}
            <a href="#" className="w-[30px] h-[30px] rounded-full bg-white/8 hover:bg-[#0b5cff] text-white flex items-center justify-center transition-colors">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
              </svg>
            </a>
            {/* Instagram */}
            <a href="#" className="w-[30px] h-[30px] rounded-full bg-white/8 hover:bg-[#0b5cff] text-white flex items-center justify-center transition-colors">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204 0-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
 
      {/* Copyright and Legal Section */}
      <div className="max-w-[1440px] mx-auto mt-[28px] pt-[16px] border-t border-white/8 flex flex-col xl:flex-row items-center justify-between gap-3 text-[12px] font-normal text-white/60">
        <p className="select-text text-center xl:text-left">
          Copyright ©2026 Zoom Communications, Inc. All rights reserved.
        </p>
 
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-white/60">
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <span className="opacity-30">|</span>
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <span className="opacity-30">|</span>
          <a href="#" className="hover:text-white transition-colors">Trust Center</a>
          <span className="opacity-30">|</span>
          <a href="#" className="hover:text-white transition-colors">Acceptable Use Guidelines</a>
          <span className="opacity-30">|</span>
          <a href="#" className="hover:text-white transition-colors">Legal & Compliance</a>
          <span className="opacity-30">|</span>
          <span className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer select-none">
            <svg viewBox="0 0 26 12" className="w-5 h-2.5 inline-block align-middle" fill="none">
              <rect width="26" height="12" rx="6" fill="#2563EB"/>
              <rect x="2" y="2" width="22" height="8" rx="4" fill="white"/>
              <path d="M12 4h4v4h-4z" fill="#2563EB"/>
              <circle cx="8" cy="6" r="3" fill="#2563EB"/>
              <circle cx="18" cy="6" r="3" fill="#10B981"/>
            </svg>
            <span>Your Privacy Choices</span>
          </span>
          <span className="opacity-30">|</span>
          <a href="#" className="hover:text-white transition-colors">Cookie Preferences</a>
        </div>
      </div>
    </footer>
  );
}
