import os, glob
from PIL import Image

# Let's inspect the files in assets/images and print what each one contains:
# In previous scripts:
# image 1: Fortune Atta packet + Dal
# image 1 copy: Surf Excel laundry detergent
# image 2: Haldiram's / small pouch
# image 2 copy: small spice pouch
# image 3: Fortune Sunlite Oil bottle + spice packet
# image 3 copy: Harpic / Lizol toilet cleaner
# image 4: Milk pouch / Amul milk
# image 5: Potatoes / veggies
# image 6: Onions / vegetables
# image 7: Fish / prawns
# image 8: Raw chicken & meat
# image 9: Cadbury Dairy Milk chocolates
# image 10: Sweets / gulab jamun / soan papdi
# image 11: Nescafe Classic coffee jar
# image 14: Kissan ketchup / sauce bottle
# image 15: Maggi noodles packet
# image 16: Dettol soap / bath soap
# image 17: Colgate toothpaste
# image 18: Parachute coconut hair oil
# image 21: Gillette razor / men's grooming
# image 22: Nivea cream / face wash
# image 23: Durex condoms / wellness
# image 24: Classmate notebook
# image 25: Pampers baby diapers
# image 28: Cello pens / pencils
# image 29: glue / markers
# image 31: Document folder / file
# image 32: Ring binder / files
# image 33: Earphones / earbuds
# image 34: Mixer grinder / electric kettle
# image 35: Phone charger / power adapter
# image 36: keyboard / mouse
# image 38: Computer keyboard / tech
# image 49: lipstick / makeup
# image 50: spice box
# image 51: oil jar
# image 54: Coca-Cola bottle
# image 57: Lay's chips
# image 58: Haldiram Bhujia / namkeen
# image 59: Parle-G biscuits
# image 60: Britannia Good Day cookies
# image 61: Fortune Moong Dal
# image 61 copy: Fortune Rozana Basmati Rice
# image 62: small ketchup pouch
# image 63: candy
# image 78: Agarbatti / Pooja incense sticks
print("Asset mapping reference ready")
