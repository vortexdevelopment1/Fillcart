import os
from PIL import Image

brain = r'C:/Users/Administrator/.gemini/antigravity/brain/3466bb4f-c225-4bea-8bab-86d8b7e8c81d'
h = Image.open(f'{brain}/.user_uploaded/media_1795590082754_3b82f6e7.jpg')

# Let's crop each category row from h (width 105)
# Row by row:
rows = [
    ("1_grocery", 125, 168),
    ("2_fresh", 185, 230),
    ("3_snacks_row1", 248, 290),
    ("4_snacks_row2", 295, 338),
    ("5_beauty_row1", 355, 398),
    ("6_beauty_row2", 402, 445),
    ("7_stationery", 465, 508),
    ("8_essentials", 522, 565),
    ("9_electronics", 580, 622),
]

for name, y1, y2 in rows:
    row_crop = h.crop((0, y1, 105, y2))
    row_crop.resize((105 * 5, (y2 - y1) * 5), Image.Resampling.NEAREST).save(f'{brain}/scratch/figma_row_{name}.png')

print("Figma rows saved")
