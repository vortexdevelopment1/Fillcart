from PIL import Image

brain = r'C:/Users/Administrator/.gemini/antigravity/brain/3466bb4f-c225-4bea-8bab-86d8b7e8c81d'
im = Image.open(f"{brain}/scratch/ir_1_grocery_c3.png")
im.resize((im.width * 4, im.height * 4), Image.Resampling.NEAREST).save(f"{brain}/scratch/ir_grocery_c3_large.png")
print("Saved ir_grocery_c3_large.png")
