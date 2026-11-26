import os, glob
from PIL import Image
import numpy as np

brain = r'C:/Users/Administrator/.gemini/antigravity/brain/3466bb4f-c225-4bea-8bab-86d8b7e8c81d'

# Let's inspect each card in Figma:
# In Figma:
# Category 1: Grocery
# Card 1: Atta, Dal & Rice -> Has Fortune Atta pack (image 1.png) and dal pack
# Card 2: Oil, Ghee & Masala -> Has oil bottle and spice box (image 51.png / image 50.png or image 3.png)
# Card 3: Dry Fruits & Cereals (or Dairy & Breakfast?) -> Has blue box / pouch
# Category 2: Fresh
# Card 1: Fruits & Veggies -> image 5.png (potatoes / veggies) + image 6.png (onions)
# Card 2: Dairy -> image 4.png (milk pouch) + bread
# Card 3: Eggs, Meat & Fish -> image 8.png (raw chicken) + image 7.png (meat/fish)
# Category 3: Snacks & Beverages
# Card 1: Hot & Cold Beverages -> image 11.png (Nescafe coffee jar) + image 54.png (Coca-Cola bottle)
# Card 2: Namkeen & Chips -> image 58.png (Haldiram's bhujia) + image 57.png (Lay's)
# Card 3: Biscuits & Cookies -> image 59.png (Parle-G) + image 60.png (Good Day)
# Card 4: Sweets & Chocolates -> image 9.png (Cadbury Dairy Milk) + image 10.png (sweets box)
# Card 5: Instant & Frozen Food -> image 15.png (Maggi noodles)
# Card 6: Sauces & Spreads -> image 14.png (Kissan ketchup bottle) + image 62.png (spread)
# Category 4: Beauty & Care
# Card 1: Bath, Body & Oral Care -> image 16.png (Dettol soap / wash) + image 17.png (Colgate)
# Card 2: Hair -> image 18.png (Parachute hair oil bottle)
# Card 3: Skin & Face -> image 22.png (Nivea / face lotion)
# Card 4: Men's Grooming -> image 21.png (Gillette razor)
# Card 5: Sexual Wellness -> image 23.png (Durex box)
# Card 6: Baby Care -> image 25.png (Pampers diaper pack)
# Category 5: Stationery
# Card 1: Notebooks -> image 24.png (Classmate notebook)
# Card 2: Pens, Pencils & Glue -> image 28.png (Cello pens)
# Card 3: Files & Folders -> image 31.png (file folders) + image 32.png
# Category 6: Essentials
# Card 1: Home Cleaning -> image 3 copy.png (Harpic toilet cleaner bottle)
# Card 2: Laundry Essentials -> image 1 copy.png (Surf Excel laundry detergent bottle)
# Card 3: Pooja Products -> image 78.png (Agarbatti / incense sticks box)
# Category 7: Electronics
# Card 1: Home Electronics -> image 34.png (Mixer grinder / kettle)
# Card 2: Mobile & Accessories -> image 35.png (Charger / power adapter) + image 33.png (Earphones)
# Card 3: Computer & Tech -> image 38.png (Keyboard / tech)

print("Mapping verification script ready")
