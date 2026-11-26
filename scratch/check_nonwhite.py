import glob, os
from PIL import Image
import numpy as np

brain = r'C:/Users/Administrator/.gemini/antigravity/brain/3466bb4f-c225-4bea-8bab-86d8b7e8c81d'

# Let's inspect each card's image region
cards = [
    ("1_grocery_c1", "Atta, Dal & Rice"),
    ("1_grocery_c2", "Oil, Ghee & Masala"),
    ("1_grocery_c3", "Dry Fruits & Cereals"),
    ("2_fresh_c1", "Fruits & Veggies"),
    ("2_fresh_c2", "Dairy"),
    ("2_fresh_c3", "Eggs, Meat & Fish"),
    ("3_snacks_row1_c1", "Hot & Cold Beverages"),
    ("3_snacks_row1_c2", "Namkeen & Chips"),
    ("3_snacks_row1_c3", "Biscuits & Cookies"),
    ("4_snacks_row2_c1", "Sweets & Chocolates"),
    ("4_snacks_row2_c2", "Instant & Frozen Food"),
    ("4_snacks_row2_c3", "Sauces & Spreads"),
    ("5_beauty_row1_c1", "Bath, Body & Oral Care"),
    ("5_beauty_row1_c2", "Hair"),
    ("5_beauty_row1_c3", "Skin & Face"),
    ("6_beauty_row2_c1", "Men's Grooming"),
    ("6_beauty_row2_c2", "Sexual Wellness"),
    ("6_beauty_row2_c3", "Baby Care"),
    ("7_stationery_c1", "Notebooks"),
    ("7_stationery_c2", "Pens, Pencils & Glue"),
    ("7_stationery_c3", "Files & Folders"),
    ("8_essentials_c1", "Home Cleaning"),
    ("8_essentials_c2", "Laundry Essentials"),
    ("8_essentials_c3", "Pooja Products"),
    ("9_electronics_c1", "Home Electronics"),
    ("9_electronics_c2", "Mobile & Accessories"),
    ("9_electronics_c3", "Computer & Tech"),
]

# Let's check the dominant colors and shapes of each image region
for cid, name in cards:
    p = f"{brain}/scratch/ir_{cid}.png"
    im = Image.open(p).convert('RGB')
    arr = np.array(im)
    # Background is roughly 255 (white)
    non_white = arr[(arr[:,:,0] < 245) | (arr[:,:,1] < 245) | (arr[:,:,2] < 245)]
    if len(non_white) > 0:
        mean_c = non_white.mean(axis=0).astype(int)
        print(f"{cid:18s} ({name:25s}): non_white={len(non_white):5d}, mean={mean_c.tolist()}")
    else:
        print(f"{cid:18s} ({name:25s}): EMPTY")
