import os
from PIL import Image

brain = r'C:/Users/Administrator/.gemini/antigravity/brain/3466bb4f-c225-4bea-8bab-86d8b7e8c81d'
h = Image.open(f'{brain}/.user_uploaded/media_1795590082754_3b82f6e7.jpg')

# The home screenshot is 105 x 1024.
# Let's crop vertical slices of each category section and save them with 4x nearest zoom:
sections = {
    'grocery': (0, 115, 105, 175),
    'fresh': (0, 175, 105, 235),
    'snacks': (0, 235, 105, 355),
    'beauty': (0, 355, 105, 475),
    'stationery': (0, 475, 105, 535),
    'essentials': (0, 535, 105, 595),
    'electronics': (0, 595, 105, 655),
}

for name, box in sections.items():
    crop = h.crop(box)
    crop_4x = crop.resize((crop.width * 5, crop.height * 5), Image.Resampling.NEAREST)
    crop_4x.save(f'{brain}/scratch/zoom_{name}.png')

print("Zoomed sections saved")
