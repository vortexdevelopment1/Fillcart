import os
from PIL import Image

brain = r'C:/Users/Administrator/.gemini/antigravity/brain/3466bb4f-c225-4bea-8bab-86d8b7e8c81d'

# Let's inspect title crops:
for name in ["title_1_grocery_c1", "title_1_grocery_c2", "title_1_grocery_c3"]:
    im = Image.open(f"{brain}/scratch/{name}.png")
    print(name, im.size)
