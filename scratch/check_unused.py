import os
from PIL import Image

# Used images:
used = {
    'image 1.png', 'image 2.png', 'image 51.png', 'image 50.png',
    'image 5.png', 'image 6.png', 'image 4.png', 'image 8.png', 'image 7.png',
    'image 11.png', 'image 54.png', 'image 58.png', 'image 57.png', 'image 59.png', 'image 60.png',
    'image 9.png', 'image 10.png', 'image 15.png', 'image 14.png', 'image 16.png', 'image 17.png',
    'image 18.png', 'image 22.png', 'image 21.png', 'image 23.png', 'image 25.png',
    'image 24.png', 'image 28.png', 'image 29.png', 'image 31.png', 'image 32.png',
    'image 3 copy.png', 'image 1 copy.png', 'image 78.png',
    'image 34.png', 'image 35.png', 'image 33.png', 'image 38.png',
    'image 69.png', 'Offer Card Component 2.png', 'image 71.png', 'image 73.png', 'Image.png'
}

all_imgs = set(os.listdir('apps/customer-app/assets/images'))
unused = sorted(list(all_imgs - used))
print("Unused assets in assets/images:")
for u in unused:
    if u.endswith('.png'):
        im = Image.open(f'apps/customer-app/assets/images/{u}')
        print(f"  {u:25s}: {im.size}")
