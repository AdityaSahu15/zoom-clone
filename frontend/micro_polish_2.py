import re

def process_file(filepath, replacements):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    for old, new in replacements:
        content = content.replace(old, new)
        
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)

with open("src/app/dashboard/page.tsx", "r", encoding="utf-8") as f:
    page_content = f.read()

# Meetings Card Button
page_content = page_content.replace('rounded-full text-[14px] bg-white font-medium hover:bg-gray-50', 'rounded-[6px] text-[14px] bg-white font-medium hover:bg-gray-50')
page_content = page_content.replace('px-[20px] border border-[#d1d5db]', 'px-[16px] border border-[#d1d5db]')

# Global Shadows & Borders
page_content = page_content.replace('border-[#e8eaee]', 'border-[#e7e9ee]')
page_content = page_content.replace('border-[#E5E5E5]', 'border-[#e7e9ee]')
page_content = page_content.replace('shadow-sm', 'shadow-[0_1px_2px_rgba(0,0,0,0.03)]')
page_content = page_content.replace('shadow-[0_1px_2px_rgba(0,0,0,0.03)]', 'shadow-[0_1px_2px_rgba(0,0,0,0.03)]') # ensure idempotency

# Typography: replace some extra bold text with medium/semibold
page_content = page_content.replace('font-extrabold', 'font-bold')
page_content = page_content.replace('font-[800]', 'font-[700]')

# Max Widths and centering
page_content = page_content.replace('w-full xl:w-[320px]', 'w-[320px] min-w-[320px]')

with open("src/app/dashboard/page.tsx", "w", encoding="utf-8") as f:
    f.write(page_content)

print("SUCCESS")
