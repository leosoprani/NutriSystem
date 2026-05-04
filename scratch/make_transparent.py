from PIL import Image
import os

assets_dir = 'src/assets'
filename = 'logo-icon.png'
path = os.path.join(assets_dir, filename)

if os.path.exists(path):
    img = Image.open(path).convert("RGBA")
    datas = img.getdata()

    newData = []
    for item in datas:
        r, g, b, a = item
        # Se for o fundo escuro (tom de azul da logo)
        # Vamos tornar transparente. 
        # O ícone é branco (255,255,255) ou verde vibrante.
        if r < 100 and g < 100 and b < 110:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)

    img.putdata(newData)
    img.save(path, "PNG")

print("Fundo escuro da logo removido com sucesso!")
