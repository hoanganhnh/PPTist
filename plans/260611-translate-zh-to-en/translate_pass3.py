#!/usr/bin/env python3
"""Third pass - fix the last 7 quoted strings."""
import sys

TRANSLATIONS = {
    "'上传.pptistFormatTemplateFile'": "'Upload .pptist format template file'",
    "'到上方'": "'Above'",
    "'到下方'": "'Below'",
    "'到右侧'": "'To the Right'",
    "'到左侧'": "'To the Left'",
    "'置于底层'": "'Send to Back'",
    "'置于顶层'": "'Bring to Front'",
}

def translate_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        return 0
    original = content
    count = 0
    for zh, en in TRANSLATIONS.items():
        if zh in content:
            content = content.replace(zh, en)
            count += 1
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return count
    return 0

def main():
    files = sys.argv[1:]
    total = 0
    for f in files:
        n = translate_file(f)
        if n > 0:
            print(f"  ✓ {f} ({n})")
            total += n
    print(f"\nTotal: {total}")

if __name__ == '__main__':
    main()
