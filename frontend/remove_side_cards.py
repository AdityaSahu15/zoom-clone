import re

with open("src/app/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Pattern to match the <div className="flex flex-col gap-[60px]"> containing the two smaller cards
# The section starts with <div className="flex flex-col gap-[60px]"> and ends before </div>\n          </div>\n        </div>\n      </section>
pattern = re.compile(r'<div className="flex flex-col gap-\[\d+px\]">\s*\{\/\* Smaller side card 1 \*\/}.*?\{\/\* Smaller side card 2 \*\/}.*?</div>\s*</div>', re.DOTALL)

# Let's verify and just remove the specific cards
content = re.sub(r'<div className="flex flex-col gap-\[\d+px\]">\s*\{\/\* Smaller side card 1 \*\/}.*?<\/div>\s*<\/div>\s*', '</div>\n', content, flags=re.DOTALL)

with open("src/app/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("SUCCESS")
