import os, glob
from PIL import Image, ImageDraw, ImageFont

files = sorted(glob.glob('apps/customer-app/assets/images/image *.png'))

cols = 5
rows = (len(files) + cols - 1) // cols
cell_w, cell_h = 160, 160

canvas = Image.new('RGB', (cols * cell_w, rows * cell_h), (240, 240, 240))
draw = ImageDraw.Draw(canvas)

for i, f in enumerate(files):
    r = i // cols
    c = i % cols
    x = c * cell_w
    y = r * cell_h
    
    # draw background box
    draw.rectangle([x+2, y+2, x+cell_w-2, y+cell_h-2], fill=(255, 255, 255), outline=(200, 200, 200))
    
    # draw image
    try:
        im = Image.open(f).convert('RGBA')
        im.thumbnail((cell_w - 20, cell_h - 40))
        # paste with alpha
        canvas.paste(im, (x + (cell_w - im.width)//2, y + 10), im)
    except Exception as e:
        pass
    
    name = os.path.basename(f).replace('.png', '')
    draw.text((x + 8, y + cell_h - 22), name, fill=(0, 0, 0))

canvas.save('C:/Users/Administrator/.gemini/antigravity/brain/3466bb4f-c225-4bea-8bab-86d8b7e8c81d/scratch/all_assets_catalog.png')
print("Catalog saved to all_assets_catalog.png")
