import os
from PIL import Image

brain = r'C:/Users/Administrator/.gemini/antigravity/brain/3466bb4f-c225-4bea-8bab-86d8b7e8c81d'

# Let's inspect each card:
# In customer_home_screen.dart, currently:
# 1. Atta, Dal & Rice: primaryImage: 'assets/images/image 51.png', secondaryImage: 'assets/images/image 50.png'
# WAIT! What is image 51.png? Let's check!
# What is image 1.png? image 1.png is Fortune Soya Health Atta!
# And in Figma card 1 (Atta, Dal & Rice):
# Is it image 1.png (Fortune Atta) + image 2.png (Haldiram / Dal)?
# Let's inspect!
for f in ['image 1.png', 'image 2.png', 'image 3.png', 'image 4.png', 'image 50.png', 'image 51.png']:
    im = Image.open(f'apps/customer-app/assets/images/{f}')
    print(f, im.size)
