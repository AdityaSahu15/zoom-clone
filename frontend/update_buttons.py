import re

with open("src/app/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Remove long number from navbar
content = content.replace('<Link href="#" className="hidden lg:block text-[14px] font-[500] text-white/92 hover:text-white transition-colors focus:outline-none">1.888.799.9666</Link>', '')

# 2. Change bottom buttons to Explore products and Find your plan, and make them squared
# First, find the final CTA section
final_cta_pattern = r'<button onClick=\{\(\) => router\.push\(\'/register\'\)\} className="h-\[48px\] px-8 rounded-full bg-\[#0b5cff\] text-white text-\[16px\] font-\[600\] hover:bg-\[#004BD6\] transition-colors focus:outline-none">Get started today</button>'
replacement_cta_1 = '<button className="h-[48px] px-8 rounded-[6px] bg-[#0b5cff] text-white text-[16px] font-[600] hover:bg-[#004BD6] transition-colors focus:outline-none">Explore products</button>'
content = re.sub(final_cta_pattern, replacement_cta_1, content)

final_cta_2_pattern = r'<button className="h-\[48px\] px-8 rounded-full bg-white border border-\[#e7e9ee\] text-\[#111111\] text-\[16px\] font-\[600\] hover:bg-gray-100 transition-colors focus:outline-none shadow-\[0_1px_2px_rgba\(0,0,0,0\.03\)\]">Find your plan</button>'
replacement_cta_2 = '<button className="h-[48px] px-8 rounded-[6px] bg-white border border-[#e7e9ee] text-[#111111] text-[16px] font-[600] hover:bg-gray-100 transition-colors focus:outline-none shadow-[0_1px_2px_rgba(0,0,0,0.03)]">Find your plan</button>'
content = re.sub(final_cta_2_pattern, replacement_cta_2, content)

# 3. Just to be consistent, make Hero buttons squared too
content = content.replace(
    'className="h-[48px] px-8 rounded-full bg-white text-[#050b1f] text-[16px] font-[700] hover:bg-gray-100 transition-colors shadow-sm focus:outline-none"',
    'className="h-[48px] px-8 rounded-[6px] bg-white text-[#050b1f] text-[16px] font-[700] hover:bg-gray-100 transition-colors shadow-sm focus:outline-none"'
)
content = content.replace(
    'className="h-[48px] px-8 rounded-full bg-transparent border border-white/50 text-white text-[16px] font-[700] hover:bg-white/10 transition-colors focus:outline-none"',
    'className="h-[48px] px-8 rounded-[6px] bg-transparent border border-white/50 text-white text-[16px] font-[700] hover:bg-white/10 transition-colors focus:outline-none"'
)

with open("src/app/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("SUCCESS")
