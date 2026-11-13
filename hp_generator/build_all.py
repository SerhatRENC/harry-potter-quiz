# -*- coding: utf-8 -*-
"""
Builder and Validator for Harry Potter Quiz Questions
Reads all question modules, shuffles options to ensure balanced A/B/C/D distribution,
checks for duplicates and errors, and writes harry_potter_duel/questions.js
"""

import json
import os
import random
import sys

# Add hp_generator directory to sys.path
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

def build():
    # Set seed for reproducible shuffle
    random.seed(42)

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
    category_counts = {}
    for cat, q_list in raw_lists:
        category_counts[cat] = len(q_list)
        all_raw.extend(q_list)

    print(f"Total raw questions collected: {len(all_raw)}")
    for cat, count in category_counts.items():
        print(f"  - {cat}: {count} questions")

    # Deduplication and Validation
    seen_questions = set()
    cleaned_questions = []
    
    correct_distribution = {0: 0, 1: 0, 2: 0, 3: 0}

    for idx, item in enumerate(all_raw):
        q_text = item["question"].strip()
        if q_text in seen_questions:
            print(f"[UYARI] Çift soru bulundu: {q_text}")
            continue
        seen_questions.add(q_text)

        options = [opt.strip() for opt in item["options"]]
        if len(options) != 4:
            raise ValueError(f"Soru {idx} seçenek sayısı 4 değil: {q_text}")
        if len(set(options)) != 4:
            raise ValueError(f"Soru {idx} seçenekler benzersiz değil: {options}")

        correct_idx = item["correct"]
        correct_answer = options[correct_idx]

        # Shuffle options so the correct answer isn't always in position 0
        shuffled_options = options[:]
        random.shuffle(shuffled_options)
        new_correct_idx = shuffled_options.index(correct_answer)
        correct_distribution[new_correct_idx] += 1

        cleaned_item = {
            "id": len(cleaned_questions) + 1,
            "film": item.get("film", "Harry Potter"),
            "category": item.get("category", "Genel"),
            "icon": item.get("icon", "⚡"),
            "image": item.get("image", None),
            "question": q_text,
            "options": shuffled_options,
            "correct": new_correct_idx,
            "explanation": item.get("explanation", "").strip()
        }
        cleaned_questions.append(cleaned_item)

    print(f"\nFinal validated question count: {len(cleaned_questions)}")
    print(f"Correct answer option distribution (A/B/C/D):")
    letters = ["A", "B", "C", "D"]
    for i in range(4):
        pct = (correct_distribution[i] / len(cleaned_questions)) * 100
        print(f"  {letters[i]} ({i}): {correct_distribution[i]} ({pct:.1f}%)")

    # Output paths
    output_dir = os.path.join(os.path.dirname(BASE_DIR), "harry_potter_duel")
    js_path = os.path.join(output_dir, "questions.js")
    json_path = os.path.join(output_dir, "questions.json")

    # Write JS file
    js_content = f"// Harry Potter 560+ Soru Havuzu - Otomatik Doğrulanmış ve Dengelenmiş\n"
    js_content += f"// Toplam Soru Sayısı: {len(cleaned_questions)}\n"
    js_content += f"window.HP_QUESTIONS = " + json.dumps(cleaned_questions, ensure_ascii=False, indent=2) + ";\n"

    with open(js_path, "w", encoding="utf-8") as f:
        f.write(js_content)
    print(f"\nSuccessfully wrote {js_path}")

    # Write JSON file as well for convenience
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(cleaned_questions, f, ensure_ascii=False, indent=2)
    print(f"Successfully wrote {json_path}")

if __name__ == '__main__':
    build()
