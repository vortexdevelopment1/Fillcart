import os, re

with open('apps/customer-app/lib/features/home/presentation/screens/customer_home_screen.dart', 'r', encoding='utf-8') as f:
    text = f.read()

pattern = re.compile(r"_CategoryItem\(\s*name:\s*'([^']+)',\s*primaryImage:\s*'([^']+)'(?:,\s*secondaryImage:\s*'([^']+)')?", re.MULTILINE)
matches = pattern.findall(text)
for name, p, s in matches:
    clean_name = name.replace('\\n', ' ')
    p_base = os.path.basename(p)
    s_base = os.path.basename(s) if s else "None"
    print(f"{clean_name:25s} -> primary: {p_base:18s} secondary: {s_base}")
