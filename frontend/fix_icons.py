import re

with open("src/app/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Fix imports
content = content.replace("import { ChevronDown, Globe, Star, ChevronRight, Check, Linkedin, Twitter, Youtube, Facebook, Instagram } from 'lucide-react';", "import { ChevronDown, Globe, Star, ChevronRight, Check } from 'lucide-react';")

# Fix JSX components
content = content.replace("<Linkedin className=\"w-4 h-4\"/>", "<Globe className=\"w-4 h-4\"/>")
content = content.replace("<Twitter className=\"w-4 h-4\"/>", "<Globe className=\"w-4 h-4\"/>")
content = content.replace("<Youtube className=\"w-4 h-4\"/>", "<Globe className=\"w-4 h-4\"/>")
content = content.replace("<Facebook className=\"w-4 h-4\"/>", "<Globe className=\"w-4 h-4\"/>")
content = content.replace("<Instagram className=\"w-4 h-4\"/>", "<Globe className=\"w-4 h-4\"/>")

with open("src/app/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("SUCCESS")
