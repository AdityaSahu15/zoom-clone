import re

with open("src/app/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Update imports
content = content.replace("import { ChevronDown, Globe, Star, ChevronRight, Check } from 'lucide-react';", "import { ChevronDown, Globe, Star, ChevronRight, Check, Linkedin, Twitter, Youtube, Facebook, Instagram } from 'lucide-react';")

# Locate footer
footer_pattern = re.compile(r'<footer.*?</footer>', re.DOTALL)

new_footer = """<footer className="w-full bg-[#050b1f] pt-[60px] pb-[40px] text-[#e7e9ee] shrink-0">
        <div className="max-w-[1440px] mx-auto px-[24px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-[40px] mb-[60px] text-left">
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
                 <button className="flex items-center justify-between px-4 py-3 border border-white/20 rounded-lg text-[14px] hover:border-white/40 transition-colors bg-[#0b1021] text-white">
                    English <ChevronDown className="w-4 h-4 opacity-70" />
                 </button>
                 <button className="flex items-center justify-between px-4 py-3 border border-white/20 rounded-lg text-[14px] hover:border-white/40 transition-colors bg-[#0b1021] text-white">
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
               <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer text-white"><Linkedin className="w-4 h-4"/></div>
               <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer text-white"><Twitter className="w-4 h-4"/></div>
               <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer text-white"><Youtube className="w-4 h-4"/></div>
               <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer text-white"><Facebook className="w-4 h-4"/></div>
               <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer text-white"><Instagram className="w-4 h-4"/></div>
            </div>
          </div>
        </div>
      </footer>"""

content = re.sub(footer_pattern, new_footer, content)

with open("src/app/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("SUCCESS")
