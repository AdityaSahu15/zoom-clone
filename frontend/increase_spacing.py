import re

with open("src/app/page.tsx", "r", encoding="utf-8") as f:
    page_content = f.read()

# Increase spacing on main sections
page_content = page_content.replace('py-[80px]', 'py-[120px]')
page_content = page_content.replace('py-[72px]', 'py-[112px]')
page_content = page_content.replace('pt-[56px] pb-[48px]', 'pt-[80px] pb-[80px]')

with open("src/app/page.tsx", "w", encoding="utf-8") as f:
    f.write(page_content)

print("SUCCESS")
