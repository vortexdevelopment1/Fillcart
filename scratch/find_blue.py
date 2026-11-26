from PIL import Image
import numpy as np

# What image is in 1_grocery_c3?
# In 1_grocery_c3:
# In Figma, it has a blue pouch / package!
# What asset has blue packaging?
# Let's check assets with blue packaging:
for f in ['image 1.png', 'image 2.png', 'image 3.png', 'image 4.png', 'image 10.png', 'image 21.png', 'image 50.png', 'image 51.png']:
    im = Image.open(f'apps/customer-app/assets/images/{f}')
    arr = np.array(im.convert('RGB'))
    # Check if blue dominant
    if arr[:,:,2].mean() > arr[:,:,0].mean() + 5:
        print(f, "is bluish!")
    else:
        print(f, "mean RGB:", arr.mean(axis=(0,1)).astype(int))
