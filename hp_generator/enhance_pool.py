# -*- coding: utf-8 -*-
# Enhanced Harry Potter Question Builder

import json
import os
import random
import sys

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE_DIR)

from film1_felsefe_tasi import FILM1_QUESTIONS
from film2_sirlar_odasi import FILM2_QUESTIONS
from film3_azkaban_tutsagi import FILM3_QUESTIONS
from film4_ates_kadehi import FILM4_QUESTIONS
from film5_zumruduanka import FILM5_QUESTIONS
from film6_melez_prens import FILM6_QUESTIONS
from film7_olum_yadigarlari_1 import FILM7_QUESTIONS
from film8_olum_yadigarlari_2 import FILM8_QUESTIONS
from spells_lore import SPELLS_QUESTIONS
from creatures_potions import CREATURES_POTIONS_QUESTIONS

# Thematic Image Catalog (Verified, Fast HTTPS Global CDN)
IMAGE_CATALOG = {
    "castle": "https://images.unsplash.com/photo-1547756536-cde3673fa2e5?auto=format&fit=crop&w=800&q=80",
    "express": "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80",
    "wand": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
    "potion": "https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&w=800&q=80",
    "book": "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
    "snitch": "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80",
    "owl": "https://images.unsplash.com/photo-1516934024742-b461fba47600?auto=format&fit=crop&w=800&q=80",
    "snake": "https://images.unsplash.com/photo-1531386151447-fd76ad50012f?auto=format&fit=crop&w=800&q=80",
    "lion": "https://images.unsplash.com/photo-1614027164847-1b28caa1228f?auto=format&fit=crop&w=800&q=80",
    "eagle": "https://images.unsplash.com/photo-1611689342806-0863700ce1e4?auto=format&fit=crop&w=800&q=80",
    "badger": "https://images.unsplash.com/photo-1535083783855-76ae62b2914e?auto=format&fit=crop&w=800&q=80",
    "hat": "https://images.unsplash.com/photo-1514533450685-4493e01d1fdc?auto=format&fit=crop&w=800&q=80",
    "dementor": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80",
    "dragon": "https://images.unsplash.com/photo-1577493340887-b7bdef05080f?auto=format&fit=crop&w=800&q=80",
    "spider": "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=800&q=80",
    "cat": "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80",
    "rat": "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?auto=format&fit=crop&w=800&q=80",
    "wolf": "https://images.unsplash.com/photo-1516083684046-84225a9b4c17?auto=format&fit=crop&w=800&q=80",
    "stag": "https://images.unsplash.com/photo-1484406566174-9da000fda645?auto=format&fit=crop&w=800&q=80",
    "lake": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    "bus": "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80",
    "car": "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80",
    "candles": "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80",
    "chess": "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=800&q=80",
    "graveyard": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
    "bridge": "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80",
    "sword": "https://images.unsplash.com/photo-1589256469067-ea99122bbdc4?auto=format&fit=crop&w=800&q=80",
    "hourglass": "https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=800&q=80",
    "gold": "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=800&q=80",
    "duel": "https://images.unsplash.com/photo-1516912481808-3406841bd33c?auto=format&fit=crop&w=800&q=80",
    "forest": "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80"
}

def pick_image(q_text, category):
    text = q_text.lower()
    if any(k in text for k in ["tren", "ekspres", "peron", "istasyon", "king's cross"]):
        return IMAGE_CATALOG["express"]
    if any(k in text for k in ["süpürge", "snitch", "quidditch", "kuasl", "savuran", "nimbus", "ateşoku"]):
        return IMAGE_CATALOG["snitch"]
    if any(k in text for k in ["baykuş", "hedwig"]):
        return IMAGE_CATALOG["owl"]
    if any(k in text for k in ["yılan", "basilisk", "nagini", "slytherin", "çataldil"]):
        return IMAGE_CATALOG["snake"]
    if any(k in text for k in ["gryffindor", "aslan"]):
        return IMAGE_CATALOG["lion"]
    if any(k in text for k in ["ravenclaw", "kartal"]):
        return IMAGE_CATALOG["eagle"]
    if any(k in text for k in ["hufflepuff", "porsuk"]):
        return IMAGE_CATALOG["badger"]
    if any(k in text for k in ["seçmen şapka", "şapka"]):
        return IMAGE_CATALOG["hat"]
    if any(k in text for k in ["ruh emici", "dementor", "azkaban"]):
        return IMAGE_CATALOG["dementor"]
    if any(k in text for k in ["ejderha", "norbert", "boynuzkuyruk"]):
        return IMAGE_CATALOG["dragon"]
    if any(k in text for k in ["örümcek", "aragog", "acromantula"]):
        return IMAGE_CATALOG["spider"]
    if any(k in text for k in ["kedi", "crookshanks", "mrs. norris", "mcgonagall"]):
        return IMAGE_CATALOG["cat"]
    if any(k in text for k in ["sıçan", "fare", "scabbers", "pettigrew"]):
        return IMAGE_CATALOG["rat"]
    if any(k in text for k in ["kurt", "kurtadam", "lupin", "dolunay"]):
        return IMAGE_CATALOG["wolf"]
    if any(k in text for k in ["patronus", "geyik", "expecto"]):
        return IMAGE_CATALOG["stag"]
    if any(k in text for k in ["göl", "kara göl", "su", "yüzgeç", "galsamotu"]):
        return IMAGE_CATALOG["lake"]
    if any(k in text for k in ["otobüs", "hızır"]):
        return IMAGE_CATALOG["bus"]
    if any(k in text for k in ["araba", "anglia", "çamarcı söğüt"]):
        return IMAGE_CATALOG["car"]
    if any(k in text for k in ["mum", "büyük salon", "şölen", "tavan"]):
        return IMAGE_CATALOG["candles"]
    if any(k in text for k in ["satranç"]):
        return IMAGE_CATALOG["chess"]
    if any(k in text for k in ["mezar", "voldemort", "riddle"]):
        return IMAGE_CATALOG["graveyard"]
    if any(k in text for k in ["köprü", "milenyum"]):
        return IMAGE_CATALOG["bridge"]
    if any(k in text for k in ["kılıç", "godric", "silah"]):
        return IMAGE_CATALOG["sword"]
    if any(k in text for k in ["zaman", "saat", "kolye"]):
        return IMAGE_CATALOG["hourglass"]
    if any(k in text for k in ["altın", "gringotts", "kasa", "para"]):
        return IMAGE_CATALOG["gold"]
    if any(k in text for k in ["iksir", "kazan", "felix", "çoközlü", "veritaserum", "amortentia"]):
        return IMAGE_CATALOG["potion"]
    if any(k in text for k in ["kitap", "günlük", "kütüphane", "melez prens"]):
        return IMAGE_CATALOG["book"]
    if any(k in text for k in ["düello", "büyü", "expelliarmus", "avada", "crucio", "lumos"]):
        return IMAGE_CATALOG["duel"]
    if any(k in text for k in ["orman", "yasak orman", "sentor", "ağaç"]):
        return IMAGE_CATALOG["forest"]
    if any(k in text for k in ["asa", "ollivander"]):
        return IMAGE_CATALOG["wand"]

    # Default fallback to majestic Hogwarts castle atmosphere
    return IMAGE_CATALOG["castle"]

# Easy difficulty keywords (Iconic / Fundamental Lore known to any viewer)
EASY_MARKERS = [
    "alnındaki", "şimşek", "simge hayvanı", "hangi peron", "renkleri", 
    "vaftiz babası", "en hızlı süpürge", "silahsızlandırma", "ölüm laneti", 
    "ev cini", "kurbağa", "kar baykuşu", "çikolata kurbağa", "seçmen şapka", 
    "fluffy", "fawkes", "kelid aynası", "anka kuşu", "karanlık işaret", 
    "yara izi", "hedwig", "nagini", "üç başlı", "görünmezlik pelerini",
    "büyülü satranç", "çapulcu haritası", "şahgaga", "buckbeak", "patronus",
    "ateş kadehi", "mürver asa", "diriltme taşı", "horcrux", "hortkuluk",
    "mcgonagall", "dumbledore", "snape", "ron", "hermione", "dobby",
    "alohomora", "lumos", "wingardium leviosa", "avada kedavra", "snitch"
]

def determine_difficulty(q_text, cat, idx):
    text = q_text.lower()
    # Check if iconic
    is_easy = any(marker in text for marker in EASY_MARKERS)
    
    # Check question length / complexity: shorter & simpler questions tend to be easier
    if is_easy and len(q_text) < 110:
        return "Kolay"
    
    # Moderate distribution: roughly 35% Kolay, 65% Orta
    if is_easy and (idx % 3 == 0):
        return "Kolay"
    
    return "Orta"

def build():
    random.seed(101)

    raw_lists = [
        ("Felsefe Taşı", FILM1_QUESTIONS),
        ("Sırlar Odası", FILM2_QUESTIONS),
        ("Azkaban Tutsağı", FILM3_QUESTIONS),
        ("Ateş Kadehi", FILM4_QUESTIONS),
        ("Zümrüdüanka Yoldaşlığı", FILM5_QUESTIONS),
        ("Melez Prens", FILM6_QUESTIONS),
        ("Ölüm Yadigarları 1", FILM7_QUESTIONS),
        ("Ölüm Yadigarları 2", FILM8_QUESTIONS),
        ("Büyüler & Tılsımlar", SPELLS_QUESTIONS),
        ("Yaratıklar & İksirler", CREATURES_POTIONS_QUESTIONS)
    ]

    all_raw = []
    for cat, q_list in raw_lists:
        all_raw.extend(q_list)

    cleaned_questions = []
    seen = set()
    easy_count = 0
    medium_count = 0

    for idx, item in enumerate(all_raw):
        q_text = item["question"].strip()
        if q_text in seen:
            continue
        seen.add(q_text)

        options = [opt.strip() for opt in item["options"]]
        correct_idx = item["correct"]
        correct_answer = options[correct_idx]

        # Shuffle options
        shuffled_options = options[:]
        random.shuffle(shuffled_options)
        new_correct_idx = shuffled_options.index(correct_answer)

        # Determine difficulty
        diff = determine_difficulty(q_text, item.get("category", ""), idx)
        if diff == "Kolay":
            easy_count += 1
        else:
            medium_count += 1

        # Determine photo
        img_url = pick_image(q_text, item.get("category", ""))

        cleaned_item = {
            "id": len(cleaned_questions) + 1,
            "film": item.get("film", "Harry Potter"),
            "category": item.get("category", "Genel"),
            "difficulty": diff,
            "icon": item.get("icon", "⚡"),
            "image": img_url,
            "question": q_text,
            "options": shuffled_options,
            "correct": new_correct_idx,
            "explanation": item.get("explanation", "").strip()
        }
        cleaned_questions.append(cleaned_item)

    print(f"Total questions: {len(cleaned_questions)}")
    print(f"Kolay (Easy) questions: {easy_count} ({(easy_count/len(cleaned_questions))*100:.1f}%)")
    print(f"Orta (Medium) questions: {medium_count} ({(medium_count/len(cleaned_questions))*100:.1f}%)")

    # Output paths in HarryPotterQuiz root
    target_dir = os.path.dirname(BASE_DIR)
    js_path = os.path.join(target_dir, "questions.js")
    json_path = os.path.join(target_dir, "questions.json")

    js_content = f"// Harry Potter 560+ Soru Havuzu - Zorluk & Fotoğraf Destekli\n"
    js_content += f"// Kolay: {easy_count} | Orta: {medium_count}\n"
    js_content += f"window.HP_QUESTIONS = " + json.dumps(cleaned_questions, ensure_ascii=False, indent=2) + ";\n"

    with open(js_path, "w", encoding="utf-8") as f:
        f.write(js_content)
    print(f"Wrote: {js_path}")

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(cleaned_questions, f, ensure_ascii=False, indent=2)
    print(f"Wrote: {json_path}")

if __name__ == '__main__':
    build()
