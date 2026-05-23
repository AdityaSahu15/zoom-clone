import re

with open("src/app/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Modify Request a Demo button
content = content.replace(
    'className="hidden md:block h-[38px] px-4 rounded-full border border-white/40 text-white text-[14px] font-[600] hover:bg-white/10 transition-colors focus:outline-none">Request a Demo',
    'className="hidden md:block h-[38px] px-6 rounded-[6px] border border-white/40 text-white text-[14px] font-[600] hover:bg-white/10 transition-colors focus:outline-none">Request a Demo'
)

# Modify Sign Up Free button
content = content.replace(
    'className="h-[38px] px-5 rounded-full bg-[#0b5cff] text-white text-[14px] font-[600] hover:bg-[#004BD6] transition-colors focus:outline-none">Sign Up Free',
    'className="h-[38px] px-6 rounded-[6px] bg-[#0b5cff] text-white text-[14px] font-[600] hover:bg-[#004BD6] transition-colors focus:outline-none">Sign Up Free'
)

with open("src/app/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("SUCCESS")
