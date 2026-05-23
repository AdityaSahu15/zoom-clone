import re

with open("src/app/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Make the Final CTA buttons vertical and add more space
content = content.replace(
    '<div className="flex items-center gap-[14px]"><button className="h-[48px]',
    '<div className="flex flex-col items-center gap-[24px] mt-[16px] w-full max-w-[280px]"><button className="h-[48px] w-full'
)

# Replace the specific buttons to also make them full width inside the 280px container so they look even
content = content.replace(
    'Explore products</button>',
    'Explore products</button>'
)

# Wait, let's just make them flex-col and increase gap without strictly setting w-full unless needed. But usually vertical buttons look best full width in a small container or just padding.
# Let's do a more robust replace for the container div.
content = content.replace(
    '<div className="flex items-center gap-[14px]"><button className="h-[48px] px-8 rounded-[6px] bg-[#0b5cff]',
    '<div className="flex flex-col items-center gap-[24px] mt-[16px]"><button className="h-[48px] px-[60px] rounded-[6px] bg-[#0b5cff]'
)

content = content.replace(
    '<button className="h-[48px] px-8 rounded-[6px] bg-white border border-[#e7e9ee] text-[#111111] text-[16px] font-[600] hover:bg-gray-100 transition-colors focus:outline-none shadow-[0_1px_2px_rgba(0,0,0,0.03)]">Find your plan</button>',
    '<button className="h-[48px] px-[60px] rounded-[6px] bg-white border border-[#e7e9ee] text-[#111111] text-[16px] font-[600] hover:bg-gray-100 transition-colors focus:outline-none shadow-[0_1px_2px_rgba(0,0,0,0.03)]">Find your plan</button>'
)

with open("src/app/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("SUCCESS")
