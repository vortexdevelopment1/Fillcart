import os, glob
from PIL import Image

brain = r'C:/Users/Administrator/.gemini/antigravity/brain/3466bb4f-c225-4bea-8bab-86d8b7e8c81d'

# Let's inspect the 3 cards in each of the 9 rows:
for row_name in ["1_grocery", "2_fresh", "3_snacks_row1", "4_snacks_row2", "5_beauty_row1", "6_beauty_row2", "7_stationery", "8_essentials", "9_electronics"]:
    im = Image.open(f'{brain}/scratch/figma_row_{row_name}.png')
    w, h = im.size
    # Card 1: 0 to 170
    # Card 2: 175 to 350
    # Card 3: 355 to 525
    c1 = im.crop((10, 0, 170, h))
    c2 = im.crop((180, 0, 345, h))
    c3 = im.crop((355, 0, 515, h))
    c1.save(f'{brain}/scratch/{row_name}_c1.png')
    c2.save(f'{brain}/scratch/{row_name}_c2.png')
    c3.save(f'{brain}/scratch/{row_name}_c3.png')

print("All individual card crops saved")
