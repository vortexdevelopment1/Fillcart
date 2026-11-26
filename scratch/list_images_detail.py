import os
from PIL import Image

# Let's inspect the images in detail
brain = r'C:/Users/Administrator/.gemini/antigravity/brain/3466bb4f-c225-4bea-8bab-86d8b7e8c81d'

# Let's write a script that displays crops or details of all image *.png files
files = sorted(os.listdir('apps/customer-app/assets/images'))
for f in files:
    if f.startswith('image ') and f.endswith('.png'):
        p = os.path.join('apps/customer-app/assets/images', f)
        im = Image.open(p)
        print(f"{f:20s}: size={im.size}")
