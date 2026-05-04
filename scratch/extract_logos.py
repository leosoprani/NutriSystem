from PIL import Image
import os

img_path = 'doc/nova logo'
assets_dir = 'src/assets'

img = Image.open(img_path)

# Logo 2 (WebApp) - Corte Interno Radical
# Vamos cortar DENTRO da linha branca para eliminá-la de vez
logo2 = img.crop((1185, 415, 1395, 625))
logo2.save(os.path.join(assets_dir, 'logo-icon.png'))

print("Borda branca e moldura externa removidas com sucesso!")
