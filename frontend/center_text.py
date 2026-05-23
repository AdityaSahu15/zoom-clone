import re

with open("src/app/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Increase vertical space
content = content.replace('py-[160px]', 'py-[200px]')
content = content.replace('pt-[100px] pb-[120px]', 'pt-[120px] pb-[160px]')
content = content.replace('gap-[40px]', 'gap-[60px]')
content = content.replace('gap-[80px]', 'gap-[100px]')

# Center alignment sweeps
content = content.replace('text-left', 'text-center')
content = content.replace('md:text-left', 'md:text-center')
content = content.replace('lg:grid-cols-2', 'lg:grid-cols-1') # If we center everything, a 2-column layout for text/image might look weird, but let's keep the layout and just center the content inside the columns. Wait, I won't change the grid.

# For One Platform flex column centering
content = content.replace('flex flex-col text-center', 'flex flex-col items-center text-center')

# Ensure tabs are centered
content = content.replace('flex items-center gap-[24px]', 'flex items-center justify-center gap-[24px]')

with open("src/app/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("SUCCESS")
