"""MAKASI QR — traitement QR côté Python (optionnel).
Usage : python qr_processing.py "https://exemple.com" -o qr.png --fg "#1B1240" --bg "#FFFFFF" --logo logo.png
Dépendances : pip install "qrcode[pil]"
Le site fonctionne sans ce script : Vercel héberge très bien le front statique."""
import argparse
import qrcode
from qrcode.constants import ERROR_CORRECT_H, ERROR_CORRECT_M
from PIL import Image


def make_qr(data, fg="#1B1240", bg="#FFFFFF", size=1024, logo=None, border=2):
    qr = qrcode.QRCode(error_correction=ERROR_CORRECT_H if logo else ERROR_CORRECT_M, border=border, box_size=10)
    qr.add_data(data)
    qr.make(fit=True)
    img = qr.make_image(fill_color=fg, back_color=bg).convert("RGB").resize((size, size), Image.NEAREST)
    if logo:
        lg = Image.open(logo).convert("RGBA")
        lg.thumbnail((int(size * 0.22),) * 2)
        img.paste(lg, ((size - lg.width) // 2, (size - lg.height) // 2), lg)
    return img


if __name__ == "__main__":
    p = argparse.ArgumentParser(description="Générateur de QR code MAKASI QR")
    p.add_argument("data")
    p.add_argument("-o", "--out", default="qr.png")
    p.add_argument("--fg", default="#1B1240")
    p.add_argument("--bg", default="#FFFFFF")
    p.add_argument("--size", type=int, default=1024)
    p.add_argument("--logo")
    a = p.parse_args()
    make_qr(a.data, a.fg, a.bg, a.size, a.logo).save(a.out)
    print("QR code enregistré :", a.out)
