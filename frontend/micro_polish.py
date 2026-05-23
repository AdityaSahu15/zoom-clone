import re

def process_file(filepath, replacements):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    for old, new in replacements:
        content = content.replace(old, new)
        
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)

# ==================== NAVBAR ====================
navbar_replacements = [
    # Top nav
    ('h-[60px]', 'h-[58px]'),
    ('px-[22px]', 'px-[24px]'),
    ('gap-[18px]', 'gap-[18px] items-center'),
    # Typography
    ('text-[13px]', 'text-[14px] leading-[20px]'),
    ('gap-[28px]', 'gap-[30px]'),
]
process_file("src/components/Navbar.tsx", navbar_replacements)

# ==================== SIDEBAR ====================
sidebar_replacements = [
    # Typography weight tweaks
    ('font-semibold', 'font-[500]'),
    ('text-[11px] font-bold tracking-wider uppercase text-[#7c8594]', 'text-[11px] font-[500] tracking-wider uppercase text-[#7c8594]'),
    # Active state
    ('bg-[#e8f1ff] text-[#2563eb]', 'bg-[#e8f1ff] text-[#2563eb] font-[500]'),
]
process_file("src/components/Sidebar.tsx", sidebar_replacements)

# ==================== PAGE.TSX (Main Content) ====================
with open("src/app/dashboard/page.tsx", "r", encoding="utf-8") as f:
    page_content = f.read()

# 1. Main container spacing & width
page_content = page_content.replace('pt-[64px]', 'pt-[22px]')
page_content = page_content.replace('max-w-[1300px]', 'max-w-[1440px]')
page_content = page_content.replace('px-[24px]', 'px-[24px]')

# 2. Profile Card
page_content = page_content.replace('px-[52px] py-[22px] flex items-center justify-center gap-[80px] min-h-[102px]', 'px-[22px] py-[22px] flex items-center justify-between min-h-[102px] h-[102px]')
page_content = page_content.replace('gap-[80px]', 'gap-[20px]') # in case
# Button on profile
page_content = page_content.replace('h-[42px] px-[48px]', 'h-[38px] px-[24px]')

# 3. Promo Banner
page_content = page_content.replace('px-[40px] py-[56px] flex flex-col', 'px-[30px] py-[30px] flex flex-col h-[238px]')
page_content = page_content.replace('gap-[60px]', 'gap-[30px]')

# 4. Recent Activity Card
page_content = page_content.replace('h-[290px] overflow-hidden', 'h-[290px] overflow-hidden')
page_content = page_content.replace('pt-[22px] px-[22px] pb-[14px]', 'pt-[22px] px-[22px] pb-[14px]')

# 5. Right Utility Card
page_content = page_content.replace('py-[28px] px-[24px]', 'py-[22px] px-[18px]')
page_content = page_content.replace('w-[52px] h-[52px]', 'w-[48px] h-[48px]')
page_content = page_content.replace('gap-[8px]', 'gap-[14px]')
page_content = page_content.replace('tracking-[0.08em]', 'tracking-[0.12em] text-[16px]')

# 6. Meetings Card Button
page_content = page_content.replace('px-4 py-2 rounded-lg bg-blue-600', 'h-[38px] px-[16px] rounded-[6px] bg-[#0b5cff]') # if matches
page_content = page_content.replace('h-[42px]', 'h-[38px]')

# 7. Footer
page_content = page_content.replace('pt-[60px] pb-[40px]', 'pt-[28px] pb-[14px]')
page_content = page_content.replace('gap-[64px]', 'gap-[36px]')
page_content = page_content.replace('max-w-[1300px]', 'max-w-[1440px]')

with open("src/app/dashboard/page.tsx", "w", encoding="utf-8") as f:
    f.write(page_content)

print("SUCCESS")
