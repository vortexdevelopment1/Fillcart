import os, glob
from PIL import Image
import numpy as np

brain = r'C:/Users/Administrator/.gemini/antigravity/brain/3466bb4f-c225-4bea-8bab-86d8b7e8c81d'

# Let's inspect each asset in catalog
# What does image 1 show? image 2? etc.
# Let's write down what each image is based on the catalog
# Let's write a script that identifies the exact image in each card
cards = [
    ("1_grocery_c1", "Grocery - Card 1"),
    ("1_grocery_c2", "Grocery - Card 2"),
    ("1_grocery_c3", "Grocery - Card 3"),
    ("2_fresh_c1", "Fresh - Card 1"),
    ("2_fresh_c2", "Fresh - Card 2"),
    ("2_fresh_c3", "Fresh - Card 3"),
    ("3_snacks_row1_c1", "Snacks - Card 1"),
    ("3_snacks_row1_c2", "Snacks - Card 2"),
    ("3_snacks_row1_c3", "Snacks - Card 3"),
    ("4_snacks_row2_c1", "Snacks - Card 4"),
    ("4_snacks_row2_c2", "Snacks - Card 5"),
    ("4_snacks_row2_c3", "Snacks - Card 6"),
    ("5_beauty_row1_c1", "Beauty - Card 1"),
    ("5_beauty_row1_c2", "Beauty - Card 2"),
    ("5_beauty_row1_c3", "Beauty - Card 3"),
    ("6_beauty_row2_c1", "Beauty - Card 4"),
    ("6_beauty_row2_c2", "Beauty - Card 5"),
    ("6_beauty_row2_c3", "Beauty - Card 6"),
    ("7_stationery_c1", "Stationery - Card 1"),
    ("7_stationery_c2", "Stationery - Card 2"),
    ("7_stationery_c3", "Stationery - Card 3"),
    ("8_essentials_c1", "Essentials - Card 1"),
    ("8_essentials_c2", "Essentials - Card 2"),
    ("8_essentials_c3", "Essentials - Card 3"),
    ("9_electronics_c1", "Electronics - Card 1"),
    ("9_electronics_c2", "Electronics - Card 2"),
    ("9_electronics_c3", "Electronics - Card 3"),
]

for card_id, title in cards:
    path = f"{brain}/scratch/{card_id}.png"
    im = Image.open(path)
    # Check bottom-right 60% of card
    w, h = im.size
    img_region = im.crop((w * 0.2, h * 0.35, w - 5, h - 5))
    img_region.save(f"{brain}/scratch/ir_{card_id}.png")

print("Saved all 27 card image regions")
