import os
from PIL import Image
import numpy as np

# What is in ir_grocery_c3_large?
im = Image.open('C:/Users/Administrator/.gemini/antigravity/brain/3466bb4f-c225-4bea-8bab-86d8b7e8c81d/scratch/ir_grocery_c3_large.png')
arr = np.array(im)
# Find pixels with saturation
# Blue pouch: high blue
blue_pixels = arr[(arr[:,:,2] > arr[:,:,0] + 30) & (arr[:,:,2] > arr[:,:,1] + 30)]
print("Blue pixels count:", len(blue_pixels))
if len(blue_pixels) > 0:
    print("Mean blue pixel:", blue_pixels.mean(axis=0))

# What asset has blue pixels?
for f in sorted(os.listdir('apps/customer-app/assets/images')):
    if f.endswith('.png'):
        aim = Image.open(f'apps/customer-app/assets/images/{f}').convert('RGB')
        aarr = np.array(aim)
        b_pix = aarr[(aarr[:,:,2] > aarr[:,:,0] + 30) & (aarr[:,:,2] > aarr[:,:,1] + 30)]
        if len(b_pix) > 500:
            print(f"Asset with blue: {f:20s} (count={len(b_pix)})")
