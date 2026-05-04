from PIL import Image

img_path = 'doc/nova logo'
img = Image.open(img_path).convert("RGB")

# Pega a cor de um pixel do fundo (canto superior esquerdo)
background_color = img.getpixel((10, 10))
hex_color = '#{:02x}{:02x}{:02x}'.format(*background_color)

print(f"Cor detectada: {hex_color}")
