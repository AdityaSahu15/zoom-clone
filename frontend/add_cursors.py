import re

with open("src/app/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Add cursor-pointer to all buttons that don't have it
def add_cursor(match):
    cls = match.group(1)
    if 'cursor-pointer' not in cls:
        cls = 'cursor-pointer ' + cls
    return f'<button className="{cls}"'

content = re.sub(r'<button className="([^"]+)"', add_cursor, content)

# Also apply to Link tags if they look like buttons? Not needed, standard a tags have cursor pointer.

with open("src/app/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("SUCCESS")
