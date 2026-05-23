import re

with open("src/app/page.tsx", "r", encoding="utf-8") as f:
    page_content = f.read()

# Increase Section Vertical Spacing heavily
page_content = page_content.replace('py-[120px]', 'py-[160px]')
page_content = page_content.replace('py-[112px]', 'py-[160px]')
page_content = page_content.replace('pt-[80px] pb-[80px]', 'pt-[100px] pb-[120px]')

# Increase component gap spacing (horizontal/vertical grids)
page_content = page_content.replace('gap-[20px]', 'gap-[40px]')
page_content = page_content.replace('gap-[40px]', 'gap-[80px]')
page_content = page_content.replace('gap-[16px]', 'gap-[32px]') # carousel

with open("src/app/page.tsx", "w", encoding="utf-8") as f:
    f.write(page_content)

print("SUCCESS")
