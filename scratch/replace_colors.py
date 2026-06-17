import os
import re

files_to_update = ['src/routes/index.tsx', 'src/routes/home.tsx']

replacements = [
    (r'bg-\[#050505\]', 'bg-background'),
    (r'bg-\[#070b14\]', 'bg-surface'),
    (r'text-white', 'text-foreground'),
    (r'border-white/(\d+)', r'border-foreground/\1'),
    (r'bg-white/(\d+)', r'bg-foreground/\1'),
    (r'from-\[#050505\]', 'from-background'),
    (r'to-\[#050505\]', 'to-background'),
    # The gradient that was hardcoded
    (r'\[background:linear-gradient\(180deg,#050505,#070b14_30%,#050505\)\]', 'bg-gradient-to-b from-background via-surface to-background')
]

for f in files_to_update:
    filepath = os.path.join(os.getcwd(), f)
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as file:
            content = file.read()
        
        for old, new in replacements:
            content = re.sub(old, new, content)
            
        with open(filepath, 'w', encoding='utf-8') as file:
            file.write(content)
        print(f"Updated {f}")
