import os, glob
from PIL import Image

def analyze_asset(path):
    im = Image.open(path)
    base = os.path.basename(path)
    # Check dimensions
    w, h = im.size
    aspect = round(w / h, 2)
    return f"{base:25s} {w}x{h} (ar={aspect})"

for a in sorted(glob.glob('apps/customer-app/assets/images/image *.png')):
    print(analyze_asset(a))
