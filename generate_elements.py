import json
import random
import os

def generate_elements():
    elements = []

    # --- SHAPES (50) ---
    shapes_items = []
    basic_shapes = [
        ("Rectangle", "Square", "rectangle"), ("Circle", "Circle", "circle"),
        ("Triangle", "Triangle", "image"), ("Star", "Star", "image"),
        ("Heart", "Heart", "image"), ("Hexagon", "Hexagon", "image"),
        ("Octagon", "Octagon", "image"), ("Pentagon", "Pentagon", "image"),
        ("Cloud", "Cloud", "image"), ("Message", "MessageCircle", "image"),
        ("Zap", "Zap", "image"), ("Sun", "Sun", "image"),
        ("Moon", "Moon", "image"), ("Check", "Check", "image"),
        ("X", "X", "image"), ("Shield", "Shield", "image"),
        ("Tag", "Tag", "image"), ("Bookmark", "Bookmark", "image"),
        ("Arrow R", "ArrowRight", "image"), ("Arrow L", "ArrowLeft", "image"),
        ("Diamond", "Diamond", "image"), ("Ring", "CircleDot", "image"),
        ("User", "User", "image"), ("Home", "Home", "image"),
        ("Settings", "Settings", "image"), ("Search", "Search", "image"),
        ("Bell", "Bell", "image")
    ]
    
    # Add basic shapes
    for label, icon, type_ in basic_shapes:
        payload = {}
        if type_ == "image":
            icon_name = icon.lower()
            if icon == "Zap": icon_name = "lightning-bolt"
            elif icon == "MessageCircle": icon_name = "message"
            elif icon == "Sun": icon_name = "white-balance-sunny"
            elif icon == "Moon": icon_name = "moon-waning-crescent"
            elif icon == "Check": icon_name = "check-bold"
            elif icon == "X": icon_name = "close-thick"
            elif icon == "ArrowRight": icon_name = "arrow-right"
            elif icon == "ArrowLeft": icon_name = "arrow-left"
            elif icon == "Diamond": icon_name = "cards-diamond"
            elif icon == "CircleDot": icon_name = "ring"
            elif icon == "User": icon_name = "account"
            elif icon == "Settings": icon_name = "cog"
            elif icon == "Search": icon_name = "magnify"
            
            payload = {"src": f"https://api.iconify.design/mdi:{icon_name}.svg?color=%23666"}
        
        shapes_items.append({
            "label": label,
            "icon": icon,
            "type": type_,
            "payload": payload
        })

    # Add more icon shapes to reach ~50
    extra_icons = [
        ("Camera", "Camera", "camera"), ("Video", "Video", "video"), ("Music", "Music", "music-note"),
        ("Map", "Map", "map-marker"), ("Calendar", "Calendar", "calendar"), ("Clock", "Clock", "clock"),
        ("Phone", "Phone", "phone"), ("Mail", "Mail", "email"), ("Lock", "Lock", "lock"),
        ("Unlock", "Unlock", "lock-open"), ("Eye", "Eye", "eye"), ("Eye Off", "EyeOff", "eye-off"),
        ("Trash", "Trash2", "delete"), ("Edit", "Edit", "pencil"), ("Share", "Share", "share-variant"),
        ("Download", "Download", "download"), ("Upload", "Upload", "upload"), ("Filter", "Filter", "filter"),
        ("Sort", "List", "sort"), ("Grid", "Grid", "grid"), ("List", "List", "format-list-bulleted"),
        ("Menu", "Menu", "menu"), ("More", "MoreHorizontal", "dots-horizontal")
    ]
    
    for label, icon, mdi_name in extra_icons:
        shapes_items.append({
            "label": label,
            "icon": icon,
            "type": "image",
            "payload": {"src": f"https://api.iconify.design/mdi:{mdi_name}.svg?color=%23666"}
        })

    elements.append({"category": "shapes", "items": shapes_items})

    # --- FRAMES (50) ---
    frames_items = []
    # Existing frames
    frames_items.extend([
        { "label": "Phone", "icon": "Smartphone", "type": "rectangle", "payload": { "width": 180, "height": 320, "borderRadius": 24, "border": "4px solid #333", "backgroundColor": "transparent" } },
        { "label": "Tablet", "icon": "Tablet", "type": "rectangle", "payload": { "width": 240, "height": 320, "borderRadius": 16, "border": "4px solid #333", "backgroundColor": "transparent" } },
        { "label": "Browser", "icon": "Layout", "type": "rectangle", "payload": { "width": 300, "height": 200, "borderRadius": 8, "border": "2px solid #ccc", "backgroundColor": "#fff", "boxShadow": "0 4px 6px -1px rgba(0, 0, 0, 0.1)" } },
        { "label": "Polaroid", "icon": "Image", "type": "rectangle", "payload": { "width": 220, "height": 260, "backgroundColor": "#fff", "padding": "16px 16px 60px 16px", "boxShadow": "0 4px 6px rgba(0,0,0,0.1)" } },
        { "label": "Circle Frame", "icon": "CircleDashed", "type": "circle", "payload": { "width": 200, "height": 200, "border": "4px solid #333", "backgroundColor": "transparent" } },
    ])
    
    # Generate more frames
    border_styles = ["solid", "dashed", "dotted", "double"]
    colors = ["#000", "#333", "#666", "#2563eb", "#dc2626", "#16a34a", "#d97706", "#9333ea"]
    
    for i in range(45):
        style = random.choice(border_styles)
        color = random.choice(colors)
        width = random.randint(2, 8)
        radius = random.choice([0, 8, 16, 24, 999])
        
        frames_items.append({
            "label": f"Frame {i+1}",
            "icon": "Layout",
            "type": "rectangle",
            "payload": {
                "width": 200,
                "height": 200,
                "border": f"{width}px {style} {color}",
                "borderRadius": radius,
                "backgroundColor": "transparent"
            }
        })
        
    elements.append({"category": "frames", "items": frames_items})

    # --- BUTTONS (150) ---
    buttons_items = []
    btn_texts = ["Buy Now", "Sign Up", "Learn More", "Get Started", "Subscribe", "Join Us", "Shop Now", "Book Now", "Contact Us", "Read More", "Download", "Play", "Watch", "Listen", "Vote"]
    btn_colors = [
        ("#2563eb", "#fff"), ("#dc2626", "#fff"), ("#16a34a", "#fff"), ("#d97706", "#fff"), 
        ("#9333ea", "#fff"), ("#000000", "#fff"), ("#fff", "#000"), ("#f43f5e", "#fff"),
        ("#0ea5e9", "#fff"), ("#8b5cf6", "#fff"), ("#ec4899", "#fff"), ("#14b8a6", "#fff")
    ]
    
    for text in btn_texts:
        for bg, fg in btn_colors:
            # Flat
            buttons_items.append({
                "label": f"{text} Flat",
                "previewType": "css",
                "type": "text",
                "payload": { "content": text, "backgroundColor": bg, "color": fg, "borderRadius": 6, "padding": 12, "fontSize": 16, "textAlign": "center", "width": 120, "height": 44, "fontWeight": "600" }
            })
            # Outline
            buttons_items.append({
                "label": f"{text} Outline",
                "previewType": "css",
                "type": "text",
                "payload": { "content": text, "backgroundColor": "transparent", "color": bg, "border": f"2px solid {bg}", "borderRadius": 6, "padding": 12, "fontSize": 16, "textAlign": "center", "width": 120, "height": 44, "fontWeight": "600" }
            })
            # Pill
            buttons_items.append({
                "label": f"{text} Pill",
                "previewType": "css",
                "type": "text",
                "payload": { "content": text, "backgroundColor": bg, "color": fg, "borderRadius": 999, "padding": 12, "fontSize": 16, "textAlign": "center", "width": 120, "height": 44, "fontWeight": "600" }
            })
            
    # Shuffle and pick 150
    random.shuffle(buttons_items)
    buttons_items = buttons_items[:150]
    elements.append({"category": "buttons", "items": buttons_items})

    # --- BADGES (150) ---
    badges_items = []
    badge_texts = ["SALE", "NEW", "HOT", "FREE", "PRO", "BETA", "50% OFF", "SOLD OUT", "LIMITED", "TOP", "VIP", "BEST", "10%", "20%", "30%", "40%", "50%", "60%", "70%", "80%", "90%", "100%"]
    badge_colors = ["#dc2626", "#16a34a", "#ea580c", "#2563eb", "#000000", "#7c3aed", "#db2777", "#475569", "#ca8a04", "#0891b2"]
    
    for text in badge_texts:
        for color in badge_colors:
            badges_items.append({
                "label": f"{text}",
                "previewType": "css",
                "type": "text",
                "payload": { "content": text, "backgroundColor": color, "color": "#fff", "borderRadius": 4, "fontSize": 12, "fontWeight": "bold", "textAlign": "center", "width": "auto", "padding": "4px 8px" }
            })
            badges_items.append({
                "label": f"{text} Pill",
                "previewType": "css",
                "type": "text",
                "payload": { "content": text, "backgroundColor": color, "color": "#fff", "borderRadius": 999, "fontSize": 12, "fontWeight": "bold", "textAlign": "center", "width": "auto", "padding": "4px 8px" }
            })

    random.shuffle(badges_items)
    badges_items = badges_items[:150]
    elements.append({"category": "badges", "items": badges_items})

    # --- TITLES (100) ---
    titles_items = []
    title_texts = [
        "BIG SALE", "HUGE SAVINGS", "LIMITED TIME", "DON'T MISS OUT", "FLASH SALE", 
        "SUMMER VIBES", "WINTER SALE", "SPRING COLLECTION", "AUTUMN LOOK", 
        "NEW ARRIVALS", "BACK IN STOCK", "TRENDING NOW", "EDITOR'S PICK",
        "SPECIAL OFFER", "EXCLUSIVE DEAL", "MEMBERS ONLY", "JOIN THE CLUB",
        "HELLO WORLD", "WELCOME", "GOOD VIBES", "STAY TUNED", "COMING SOON",
        "GRAND OPENING", "FINAL CLEARANCE", "BEST SELLER", "TOP RATED"
    ]
    
    fonts = ["Inter", "Serif", "Monospace", "Cursive", "Fantasy"]
    title_colors = ["#000", "#333", "#2563eb", "#dc2626", "#16a34a", "#d97706", "#9333ea", "#db2777"]
    
    for text in title_texts:
        for color in title_colors:
            titles_items.append({
                "label": text,
                "previewType": "css",
                "type": "text",
                "payload": { 
                    "content": text, 
                    "color": color, 
                    "fontSize": 32, 
                    "fontWeight": "900", 
                    "textAlign": "center",
                    "fontFamily": random.choice(fonts),
                    "textTransform": "uppercase"
                }
            })
            
    random.shuffle(titles_items)
    titles_items = titles_items[:100]
    elements.append({"category": "titles", "items": titles_items})

    # Write to file
    output_path = r"c:\Users\Windows 11 Pro\saas\components\custom\TemplateBuilder\data\stockElements.json"
    with open(output_path, "w") as f:
        json.dump(elements, f, indent=2)
    
    print(f"Successfully wrote {sum(len(c['items']) for c in elements)} elements to {output_path}")

if __name__ == "__main__":
    generate_elements()
