#!/usr/bin/env python3
"""
Gera as imagens otimizadas do site a partir dos logos originais.

Uso (precisa do Pillow: pip install pillow):
    python3 scripts/gerar-imagens.py

Gera em assets/img/:
  - logo-horizontal-480/960 (.webp + .png)  -> rodapé
  - logo-quadrada-512 (.webp + .png)        -> JSON-LD / compartilhamento
  - og-image.png (1200x630)                 -> Open Graph / Twitter
  - favicon-32.png, apple-touch-icon.png    -> ícones (bug em pixel art)
"""
from pathlib import Path

from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
ASSETS = RAIZ / "assets"
SAIDA = ASSETS / "img"
FUNDO = (0x0D, 0x0C, 0x08)
VERDE_BUG = (0x8D, 0xB3, 0x3F)

# Grade 13x13 do bug, copiada pixel a pixel do logo
BUG = [
    "..##.....##..",
    "..##.....##..",
    "...##...##...",
    "....#####....",
    "...#######...",
    "##.#######.##",
    "#############",
    "##.#######.##",
    "...#######...",
    "....#####....",
    "..###...###..",
    ".##.......##.",
    ".##.......##.",
]


def salvar_par(img, nome, largura):
    """Redimensiona e salva em WebP + PNG (fallback)."""
    altura = round(img.height * largura / img.width)
    menor = img.resize((largura, altura), Image.LANCZOS).convert("RGB")
    menor.save(SAIDA / f"{nome}-{largura}.webp", "WEBP", quality=88, method=6)
    menor.save(SAIDA / f"{nome}-{largura}.png", "PNG", optimize=True)
    print(f"  {nome}-{largura}: {largura}x{altura}")


def desenhar_bug(tamanho, margem):
    """Desenha o bug pixel a pixel num quadrado com fundo da marca."""
    img = Image.new("RGB", (tamanho, tamanho), FUNDO)
    px = (tamanho - 2 * margem) // 13
    inicio = (tamanho - px * 13) // 2
    for y, linha in enumerate(BUG):
        for x, c in enumerate(linha):
            if c == "#":
                x0, y0 = inicio + x * px, inicio + y * px
                img.paste(VERDE_BUG, (x0, y0, x0 + px, y0 + px))
    return img


def main():
    SAIDA.mkdir(parents=True, exist_ok=True)
    horizontal = Image.open(ASSETS / "logo-horizontal.png").convert("RGB")
    quadrada = Image.open(ASSETS / "logo-quadrada.png").convert("RGB")

    print("Logos:")
    for largura in (480, 960):
        salvar_par(horizontal, "logo-horizontal", largura)
    salvar_par(quadrada, "logo-quadrada", 512)

    print("Open Graph:")
    og = Image.new("RGB", (1200, 630), FUNDO)
    largura = 900
    logo = horizontal.resize((largura, round(horizontal.height * largura / horizontal.width)), Image.LANCZOS)
    og.paste(logo, ((1200 - logo.width) // 2, (630 - logo.height) // 2))
    og.save(SAIDA / "og-image.png", "PNG", optimize=True)
    print("  og-image.png: 1200x630")

    print("Favicons:")
    desenhar_bug(32, 2).save(SAIDA / "favicon-32.png", "PNG", optimize=True)
    desenhar_bug(180, 24).save(SAIDA / "apple-touch-icon.png", "PNG", optimize=True)
    print("  favicon-32.png, apple-touch-icon.png")


if __name__ == "__main__":
    main()
