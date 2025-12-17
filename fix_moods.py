import os
import re

# Mood replacements
mood_map = {
    'beauty': 'luxury', 'travel': 'energetic', 'entertainment': 'playful', 
    'dark': 'calm', 'cinematic': 'energetic', 'warm': 'calm', 'cozy': 'calm',
    'elegant': 'luxury', 'vibrant': 'energetic', 'adventurous': 'energetic',
    'inspiring': 'trustworthy', 'bold': 'urgent', 'positive': 'energetic',
    'appetizing': 'urgent', 'modern': 'minimalist', 'tech': 'energetic',
    'professional': 'corporate', 'serious': 'corporate', 'futuristic': 'energetic',
    'sleek': 'minimalist', 'informative': 'trustworthy', 'clean': 'calm',
    'visual': 'energetic', 'header': 'energetic', 'content': 'engagement',
    'exciting': 'energetic', 'viral': 'energetic', 'legal': 'engagement',
    'information': 'engagement', 'product': 'urgent', 'icon': 'energetic'
}

# Purpose replacements
purpose_map = {
    'social-proof': 'engagement', 'announcement': 'awareness', 'authority': 'trustworthy',
    'header': 'awareness', 'content': 'engagement', 'promotion': 'conversion',
    'event': 'engagement', 'launch': 'awareness', 'discussion': 'engagement',
    'legal': 'engagement', 'lead-gen': 'conversion'
}

for root, dirs, files in os.walk('lib/builder/sections'):
    for file in files:
        if file.endswith('.ts'):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original = content
            
            # Fix moods
            for invalid, valid in mood_map.items():
                content = re.sub(rf"'{invalid}'", f"'{valid}'", content)
                content = re.sub(rf'"{invalid}"', f'"{valid}"', content)
            
            # Fix purposes - need to be careful not to mess up other words
            for invalid, valid in purpose_map.items():
                # Match within purpose array or object
                pattern = rf"purpose:\s*\[([^\]]*'{invalid}'[^\]]*)\]"
                def replace_purpose(match):
                    group = match.group(1)
                    group = re.sub(rf"'{invalid}'", f"'{valid}'", group)
                    group = re.sub(rf'"{invalid}"', f'"{valid}"', group)
                    return f"purpose: [{group}]"
                content = re.sub(pattern, replace_purpose, content)
            
            if content != original:
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f'Fixed: {path}')

print('Done fixing all files!')
