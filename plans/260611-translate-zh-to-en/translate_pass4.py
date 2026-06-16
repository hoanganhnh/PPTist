#!/usr/bin/env python3
"""Fourth pass - fix remaining template text and inline Chinese."""
import sys

TRANSLATIONS = {
    # Template HTML text (partial translations from earlier passes)
    '最近使用：': 'Recently Used:',
    'Dot击更换': 'Click to Change',
    'Clear数据': 'Clear Data',
    'Fill色：': 'Fill Color:',
    'None可用属性': 'No available properties',
    '置顶': 'To Front',
    '置底': 'To Back',
    '退出Edit': 'Exit Edit',
    '新Slide': 'New Slide',
    '退出Play': 'Exit Play',
    '双击Edit': 'Double-click to Edit',
    '循环': 'Loop',
    '上方Insert Row': 'Insert Row Above',
    '下方Insert Row': 'Insert Row Below',
    '左侧Insert Column': 'Insert Column Left',
    '右侧Insert Column': 'Insert Column Right',
    'Edit数据': 'Edit Data',
    '更换': 'Change',
    '从下方挑选合适的TemplateGeneratePPT，或': 'Pick a template below to generate PPT, or',
    '使用本地TemplateGenerate': 'Use Local Template',
    'Confirm下方ContentOutline（Dot击EditContent，右键Add/DeleteOutline项），StartSelect Template': 'Confirm the content outline below (click to edit content, right-click to add/delete outline items), then select a template to start',
    '在下方输入您的PPTTheme，并适当补充信息，如行业、岗位、学科、用途等': 'Enter your PPT topic below, and optionally add details such as industry, position, subject, or purpose',
    '语言：': 'Language:',
    '风格：': 'Style:',
    '模型：': 'Model:',
    '配图：': 'Images:',
    '覆盖已有Slide': 'Overwrite Existing Slides',
    'Back重新Generate': 'Back to Regenerate',
    'Export范围：': 'Export Range:',
    'Custom范围：': 'Custom Range:',
    'Export模式：': 'Export Mode:',
    'Standard版': 'Standard',
    '纯图版': 'Image Only',
    '忽略Audio/Video：': 'Ignore Audio/Video:',
    '覆盖默认母版：': 'Override Default Master:',
    'Image质量：': 'Image Quality:',
    '忽略在线Font：': 'Ignore Online Fonts:',
    
    # More inline text and comments
    '数据初始化Medium，请稍等 ...': 'Initializing data, please wait ...',
    'AIGenerateMedium，请耐心等待 ...': 'AI is generating, please wait ...',
    
    # Remaining inline template text
    '第 {{ slideIndex + 1 }} 页 / 共 {{ slides.length }} 页': 'Slide {{ slideIndex + 1 }} / {{ slides.length }}',
    '更多模板': 'More Templates',
    '请输入PPTTheme，如：College Student Career Planning': 'Enter PPT topic, e.g.: College Student Career Planning',
    
    # Export dialog remaining
    '忽略在线Font': 'Ignore Online Fonts',
    '忽略音Video': 'Ignore Audio/Video',
    
    # Mobile remaining
    '退出': 'Exit',
    '退出放映': 'End Show',
}

def translate_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        return 0
    original = content
    count = 0
    for zh, en in sorted(TRANSLATIONS.items(), key=lambda x: len(x[0]), reverse=True):
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
