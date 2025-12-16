import json
import random

def generate_text_styles():
    styles = []
    
    # Helper to generate random hex color
    def random_color():
        return "#{:06x}".format(random.randint(0, 0xFFFFFF))

    # Helper for vibrant colors
    def vibrant_color():
        colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#00FFFF', '#FF00FF', '#FF4500', '#FF1493', '#00BFFF', '#32CD32']
        return random.choice(colors)

    # Helper for pastel colors
    def pastel_color():
        colors = ['#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF', '#E6E6FA', '#FFC0CB', '#DDA0DD']
        return random.choice(colors)

    # 1. Headlines (Bold, Impactful)
    headlines_text = ["BREAKING NEWS", "JUST IN", "BIG ANNOUNCEMENT", "DON'T MISS OUT", "LIMITED TIME", "EXCLUSIVE", "NEW ARRIVAL", "BEST SELLER", "TOP RATED", "TRENDING NOW", "HEADLINE", "ATTENTION", "IMPORTANT", "UPDATE", "NOTICE"]
    fonts_headline = ['Impact, sans-serif', 'Arial Black, sans-serif', 'Verdana, sans-serif', 'Tahoma, sans-serif']
    for i in range(50):
        text = random.choice(headlines_text)
        color = random.choice(['#000000', '#1a1a1a', '#2d3748', '#1e3a8a', '#b91c1c'])
        styles.append({
            "category": "Headlines",
            "label": text,
            "preview": text,
            "style": {
                "fontSize": 60,
                "fontFamily": random.choice(fonts_headline),
                "fontWeight": "900",
                "color": color,
                "textTransform": "uppercase",
                "letterSpacing": random.randint(-2, 2),
                "lineHeight": 1.1
            }
        })

    # 2. Sale / Offer (Urgent, Red/Yellow)
    sale_text = ["SALE", "50% OFF", "BUY 1 GET 1", "CLEARANCE", "FLASH SALE", "PROMO", "DISCOUNT", "SAVE BIG", "HOT DEAL", "FINAL CALL", "OFFER", "DEAL", "BEST PRICE", "HUGE SAVINGS", "LIMITED OFFER"]
    for i in range(50):
        text = random.choice(sale_text)
        base_color = random.choice(['#ef4444', '#f97316', '#eab308', '#dc2626'])
        styles.append({
            "category": "Sale",
            "label": text,
            "preview": text,
            "style": {
                "fontSize": 72,
                "fontFamily": "Arial Black, sans-serif",
                "fontWeight": "900",
                "color": base_color,
                "textTransform": "uppercase",
                "textShadow": "2px 2px 0px #ffffff, 4px 4px 0px #000000",
                "transform": f"rotate({random.randint(-5, 5)}deg)"
            }
        })

    # 3. Luxury (Serif, Gold/Silver/Black)
    luxury_text = ["Elegant", "Premium", "Exclusive", "Luxury", "Finest Quality", "Sophisticated", "Timeless", "Signature", "Collection", "Boutique", "Opulence", "Grandeur", "Prestige", "Elite", "Refined"]
    fonts_luxury = ['Georgia, serif', 'Times New Roman, serif', 'Palatino, serif']
    luxury_colors = ['#D4AF37', '#C0C0C0', '#000000', '#2C3E50', '#800020']
    for i in range(50):
        text = random.choice(luxury_text)
        styles.append({
            "category": "Luxury",
            "label": text,
            "preview": text,
            "style": {
                "fontSize": 54,
                "fontFamily": random.choice(fonts_luxury),
                "fontWeight": "400",
                "fontStyle": random.choice(["normal", "italic"]),
                "color": random.choice(luxury_colors),
                "letterSpacing": random.randint(1, 4),
                "textShadow": "1px 1px 2px rgba(0,0,0,0.1)"
            }
        })

    # 4. Tech / Cyber (Neon, Monospace)
    tech_text = ["CYBER MONDAY", "TECH WEEK", "FUTURE", "DIGITAL", "ONLINE ONLY", "APP EXCLUSIVE", "LOADING...", "SYSTEM READY", "VIRTUAL", "INNOVATION", "DATA", "NETWORK", "CODE", "MATRIX", "GLITCH"]
    fonts_tech = ['Courier New, monospace', 'Lucida Console, monospace']
    neon_colors = ['#00ff00', '#ff00ff', '#00ffff', '#ffff00']
    for i in range(50):
        text = random.choice(tech_text)
        color = random.choice(neon_colors)
        styles.append({
            "category": "Tech",
            "label": text,
            "preview": text,
            "style": {
                "fontSize": 48,
                "fontFamily": random.choice(fonts_tech),
                "fontWeight": "bold",
                "color": "#ffffff",
                "textShadow": f"0 0 5px {color}, 0 0 10px {color}, 0 0 20px {color}",
                "textTransform": "uppercase",
                "letterSpacing": 2
            }
        })

    # 5. Retro (Layered Shadows, Serif/Display)
    retro_text = ["RETRO", "VINTAGE", "CLASSIC", "OLD SCHOOL", "THROWBACK", "NOSTALGIA", "GROOVY", "RADICAL", "ARCADE", "REWIND", "DISCO", "FUNKY", "VIBE", "STYLE", "COOL"]
    for i in range(50):
        text = random.choice(retro_text)
        c1 = vibrant_color()
        c2 = vibrant_color()
        styles.append({
            "category": "Retro",
            "label": text,
            "preview": text,
            "style": {
                "fontSize": 60,
                "fontFamily": "Georgia, serif",
                "fontWeight": "900",
                "color": c1,
                "textShadow": f"3px 3px 0px {c2}, 6px 6px 0px #000000",
                "fontStyle": "italic"
            }
        })

    # 6. Minimal (Clean, Sans-serif)
    minimal_text = ["Simple.", "Clean.", "Minimal.", "Less is more.", "Pure.", "Essential.", "Basic.", "Modern.", "Sleek.", "Fresh.", "White.", "Space.", "Calm.", "Soft.", "Light."]
    fonts_minimal = ['Arial, sans-serif', 'Helvetica, sans-serif', 'Segoe UI, sans-serif']
    for i in range(50):
        text = random.choice(minimal_text)
        styles.append({
            "category": "Minimal",
            "label": text,
            "preview": text,
            "style": {
                "fontSize": 42,
                "fontFamily": random.choice(fonts_minimal),
                "fontWeight": random.choice(["300", "400", "500"]),
                "color": "#333333",
                "letterSpacing": random.randint(1, 3),
                "textTransform": random.choice(["none", "uppercase", "lowercase"])
            }
        })

    # 7. Fun / Playful (Rounded, Colorful)
    fun_text = ["Party!", "Fun!", "Wow!", "Amazing!", "Cool!", "Yay!", "Pop!", "Boom!", "Zap!", "Omg!", "Super!", "Sweet!", "Nice!", "Yolo!", "Epic!"]
    fonts_fun = ['Comic Sans MS, cursive', 'Arial Rounded MT Bold, sans-serif']
    for i in range(50):
        text = random.choice(fun_text)
        color = vibrant_color()
        styles.append({
            "category": "Fun",
            "label": text,
            "preview": text,
            "style": {
                "fontSize": 56,
                "fontFamily": random.choice(fonts_fun),
                "fontWeight": "bold",
                "color": color,
                "WebkitTextStroke": "1px #000000",
                "textShadow": "2px 2px 0px rgba(0,0,0,0.2)"
            }
        })

    # 8. Quote (Italic, Serif)
    quote_text = ["“Dream Big”", "“Stay Wild”", "“Be Kind”", "“Good Vibes”", "“Just Do It”", "“Live Laugh Love”", "“Carpe Diem”", "“Stay Focused”", "“Keep Going”", "“You Got This”", "“Believe”", "“Inspire”", "“Create”", "“Love”", "“Hope”"]
    for i in range(50):
        text = random.choice(quote_text)
        styles.append({
            "category": "Quote",
            "label": text,
            "preview": text,
            "style": {
                "fontSize": 48,
                "fontFamily": "Georgia, serif",
                "fontStyle": "italic",
                "color": "#4a5568",
                "textAlign": "center",
                "lineHeight": 1.4
            }
        })

    # 9. Social Media (Trendy, Bold)
    social_text = ["#OOTD", "#TBT", "#FYP", "#Viral", "#Trending", "#Love", "#InstaGood", "#FollowMe", "#Like", "#Share", "#Subscribe", "#LinkInBio", "#NewPost", "#Giveaway", "#Contest"]
    for i in range(50):
        text = random.choice(social_text)
        styles.append({
            "category": "Social",
            "label": text,
            "preview": text,
            "style": {
                "fontSize": 52,
                "fontFamily": "Arial, sans-serif",
                "fontWeight": "800",
                "color": "#ffffff",
                "backgroundColor": vibrant_color(),
                "padding": "10px",
                "borderRadius": "8px",
                "textTransform": "uppercase"
            }
        })

    # 10. Outline (Stroke heavy)
    outline_text = ["OUTLINE", "STROKE", "HOLLOW", "BORDER", "EDGE", "FRAME", "TRANSPARENT", "GHOST", "SKETCH", "DRAWING", "LINE", "SHAPE", "FORM", "CONTOUR", "TRACE"]
    for i in range(50):
        text = random.choice(outline_text)
        color = vibrant_color()
        styles.append({
            "category": "Outline",
            "label": text,
            "preview": text,
            "style": {
                "fontSize": 64,
                "fontFamily": "Impact, sans-serif",
                "fontWeight": "900",
                "color": "transparent",
                "WebkitTextStroke": f"2px {color}"
            }
        })

    return styles

styles = generate_text_styles()

with open('components/custom/TemplateBuilder/data/textStyles.json', 'w') as f:
    json.dump(styles, f, indent=2)

print(f"Generated {len(styles)} text styles.")
