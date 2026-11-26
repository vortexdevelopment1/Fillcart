import os
from PIL import Image

for f in ['image 3.png', 'image 2 copy.png', 'image 61.png', 'image 62.png', 'image 63.png']:
    im = Image.open(f'apps/customer-app/assets/images/{f}')
    print(f, im.size)
