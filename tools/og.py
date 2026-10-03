"""SNS シェア用のカード画像（1200x630）を data.js から生成する。

  python3 tools/og.py

og/default.png（トップページ用）と og/<作品id>.png を書き出す。
Pillow とmacOS標準のヒラギノ角ゴ・Apple Color Emoji を使う。
"""
import json
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "og"
W, H = 1200, 630

NAVY_900 = (8, 15, 25)
NAVY_700 = (18, 35, 58)
ORANGE = (242, 98, 46)
GOLD = (200, 169, 106)
TXT = (232, 237, 244)
TXT_2 = (159, 176, 198)
TXT_3 = (108, 129, 155)

FONT_DIR = Path("/System/Library/Fonts")
EMOJI_FONT = FONT_DIR / "Apple Color Emoji.ttc"


def font(weight, size):
    return ImageFont.truetype(str(FONT_DIR / f"ヒラギノ角ゴシック W{weight}.ttc"), size)


def background():
    img = Image.new("RGB", (W, H), NAVY_900)
    px = img.load()
    # 左上ネイビー → 右下ほぼ黒のグラデーション
    for y in range(H):
        for x in range(0, W, 2):
            t = min(1, (x / W) * 0.55 + (y / H) * 0.45)
            c = tuple(int(NAVY_700[i] * (1 - t) + NAVY_900[i] * t) for i in range(3))
            px[x, y] = c
            if x + 1 < W:
                px[x + 1, y] = c
    d = ImageDraw.Draw(img, "RGBA")
    for x in range(0, W, 60):
        d.line([(x, 0), (x, H)], fill=(244, 246, 249, 9))
    for y in range(0, H, 60):
        d.line([(0, y), (W, y)], fill=(244, 246, 249, 9))
    # 右上のオレンジのにじみ
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    for r in range(380, 0, -8):
        a = int(26 * (1 - r / 380))
        gd.ellipse([W - 160 - r, -120 - r, W - 160 + r, -120 + r], fill=(*ORANGE, a))
    img.paste(glow, (0, 0), glow)
    # 上端のアクセントライン
    for x in range(W):
        t = x / W
        c = tuple(int(ORANGE[i] * (1 - t) + GOLD[i] * t) for i in range(3))
        d.line([(x, 0), (x, 5)], fill=(*c, int(255 * (1 - t * 0.7))))
    return img, d


def wrap(draw, text, fnt, max_w, max_lines):
    """日本語を1文字単位で折り返す。収まらなければ最終行を…で切る。"""
    lines, cur = [], ""
    for ch in text:
        if draw.textlength(cur + ch, font=fnt) <= max_w:
            cur += ch
        else:
            lines.append(cur)
            cur = ch
    if cur:
        lines.append(cur)
    if len(lines) > max_lines:
        lines = lines[:max_lines]
        last = lines[-1]
        while draw.textlength(last + "…", font=fnt) > max_w:
            last = last[:-1]
        lines[-1] = last + "…"
    return lines


def emoji_image(ch, size):
    try:
        f = ImageFont.truetype(str(EMOJI_FONT), 160)
    except OSError:
        return None
    tmp = Image.new("RGBA", (220, 220), (0, 0, 0, 0))
    ImageDraw.Draw(tmp).text((110, 110), ch, font=f, embedded_color=True, anchor="mm")
    bbox = tmp.getbbox()
    if not bbox:
        return None
    tmp = tmp.crop(bbox)
    tmp.thumbnail((size, size), Image.LANCZOS)
    return tmp


def footer(d, name):
    d.text((80, H - 92), name, font=font(7, 30), fill=TXT)
    d.text((80, H - 52), "理学療法学生 × 個人開発 ／ 目標はNBAのアスレティックトレーナー", font=font(4, 21), fill=TXT_3)
    d.text((W - 80, H - 52), "celties.github.io/hashi-portfolio", font=font(5, 21), fill=TXT_2, anchor="ra")


def work_card(p, cat_label, name):
    img, d = background()
    # 右側の絵文字タイル
    tile = 220
    tx, ty = W - 80 - tile, 92
    d.rounded_rectangle([tx, ty, tx + tile, ty + tile], radius=48, fill=(242, 98, 46, 34), outline=(242, 98, 46, 90), width=2)
    em = emoji_image(p["emoji"], 130)
    if em:
        img.paste(em, (tx + (tile - em.width) // 2, ty + (tile - em.height) // 2), em)

    text_w = tx - 80 - 50
    d.text((80, 92), f"WORKS  ／  {cat_label}", font=font(6, 22), fill=ORANGE)
    y = 140
    title_font = font(8, 70 if len(p["title"]) <= 12 else 58)
    for line in wrap(d, p["title"], title_font, text_w, 2):
        d.text((80, y), line, font=title_font, fill=TXT)
        y += title_font.size + 16
    y += 6
    for line in wrap(d, p["subtitle"], font(6, 32), text_w, 1):
        d.text((80, y), line, font=font(6, 32), fill=GOLD)
        y += 48
    y = max(y + 10, ty + tile + 34)
    for line in wrap(d, p["summary"], font(4, 24), W - 160, 2):
        d.text((80, y), line, font=font(4, 24), fill=TXT_2)
        y += 38
    d.line([(80, H - 118), (W - 80, H - 118)], fill=(244, 246, 249, 26), width=1)
    footer(d, name)
    return img


def default_card(data):
    img, d = background()
    prof = data["PROFILE"]
    d.text((80, 92), "HASHI — WORKS", font=font(6, 22), fill=ORANGE)
    d.text((80, 140), "人生は、", font=font(9, 84), fill=TXT)
    # 「一瞬一瞬」をオレンジ→ゴールドで
    x = 80
    for i, ch in enumerate("一瞬一瞬"):
        t = i / 3
        c = tuple(int(ORANGE[k] * (1 - t) + GOLD[k] * t) for k in range(3))
        d.text((x, 244), ch, font=font(9, 84), fill=c)
        x += d.textlength(ch, font=font(9, 84))
    d.text((x, 244), "の積み重ね。", font=font(9, 84), fill=TXT)
    d.text((80, 370), prof["tagline"], font=font(5, 30), fill=TXT_2)
    n = len(data["PROJECTS"])
    d.text((80, 420), f"つくったもの {n} 本 ／ 習慣・バスケ・動画・自動化・学び", font=font(5, 24), fill=TXT_3)
    em = emoji_image("🏀", 150)
    if em:
        img.paste(em, (W - 80 - em.width, 120), em)
    d.line([(80, H - 118), (W - 80, H - 118)], fill=(244, 246, 249, 26), width=1)
    footer(d, f"{prof['nameJa']}  /  {prof['nameEn']}")
    return img


def icon():
    s = 512
    img = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([0, 0, s - 1, s - 1], radius=112, fill=NAVY_700)
    w = 46
    d.line([(154, 133), (154, 379)], fill=ORANGE, width=w)
    d.line([(358, 133), (358, 379)], fill=ORANGE, width=w)
    d.line([(154, 256), (358, 256)], fill=ORANGE, width=w)
    for cx, cy in [(154, 133), (154, 379), (358, 133), (358, 379), (154, 256), (358, 256)]:
        d.ellipse([cx - w / 2, cy - w / 2, cx + w / 2, cy + w / 2], fill=ORANGE)
    return img


def main():
    data = json.loads(subprocess.check_output(["node", str(ROOT / "tools/dump-data.mjs")]))
    OUT.mkdir(exist_ok=True)
    cats = {c["id"]: c["label"] for c in data["CATEGORIES"]}
    name = data["PROFILE"]["nameJa"]
    default_card(data).save(OUT / "default.png", optimize=True)
    for p in data["PROJECTS"]:
        work_card(p, cats.get(p["category"], ""), name).save(OUT / f"{p['id']}.png", optimize=True)
    ic = icon()
    ic.resize((180, 180), Image.LANCZOS).save(ROOT / "apple-touch-icon.png", optimize=True)
    ic.resize((512, 512), Image.LANCZOS).save(ROOT / "icon-512.png", optimize=True)
    print(f"og/ に {len(data['PROJECTS']) + 1} 枚、アイコン2枚を書き出しました")


if __name__ == "__main__":
    main()
