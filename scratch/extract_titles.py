import os
from PIL import Image

brain = r'C:/Users/Administrator/.gemini/antigravity/brain/3466bb4f-c225-4bea-8bab-86d8b7e8c81d'

cards = [
    "1_grocery_c1", "1_grocery_c2", "1_grocery_c3",
    "2_fresh_c1", "2_fresh_c2", "2_fresh_c3",
    "3_snacks_row1_c1", "3_snacks_row1_c2", "3_snacks_row1_c3",
    "4_snacks_row2_c1", "4_snacks_row2_c2", "4_snacks_row2_c3",
    "5_beauty_row1_c1", "5_beauty_row1_c2", "5_beauty_row1_c3",
    "6_beauty_row2_c1", "6_beauty_row2_c2", "6_beauty_row2_c3",
    "7_stationery_c1", "7_stationery_c2", "7_stationery_c3",
    "8_essentials_c1", "8_essentials_c2", "8_essentials_c3",
    "9_electronics_c1", "9_electronics_c2", "9_electronics_c3",
]

for card_id in cards:
    im = Image.open(f"{brain}/scratch/{card_id}.png")
    w, h = im.size
    title_part = im.crop((5, 5, w - 5, int(h * 0.42)))
    title_part.save(f"{brain}/scratch/title_{card_id}.png")

print("Saved all 27 title crops")
