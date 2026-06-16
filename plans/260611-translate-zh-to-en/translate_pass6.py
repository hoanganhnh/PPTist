#!/usr/bin/env python3
"""Pass 6 - fix all remaining partial translations in Vue templates."""
import sys

TRANSLATIONS = {
    # Partial translations (longer matches first)
    '当Font Size过Large且行高较Small时，会出现TextHeight溢出的情况，导致拖拽区域None法被选Medium，因此Add了以下SectionDot避免该情况': 'When font size is too large and line height is too small, text height overflows causing drag area to be unselectable, so this section was added to avoid that',
    '请输入Hyperlink': 'Please enter a hyperlink',
    '减Small首行缩进': 'Decrease First Line Indent',
    '增Large首行缩进': 'Increase First Line Indent',
    'Blur距离：': 'Blur Distance:',
    'Settings首帧为Cover': 'Set First Frame as Cover',
    '图标Color：': 'Icon Color:',
    'Dot击ReplaceLineType': 'Click to Replace Line Type',
    '起DotStyle：': 'Start Point Style:',
    '终DotStyle：': 'End Point Style:',
    'Line方向：': 'Line Direction:',
    '交换方向': 'Swap Direction',
    'ChartTheme配色': 'Chart Theme Colors',
    'Theme配色{{ index + 1 }}：': 'Theme Color {{ index + 1 }}:',
    '堆叠Style': 'Stacked Style',
    '使用平滑曲线': 'Use Smooth Curves',
    '坐标与Text：': 'Axis & Text:',
    '网格Color：': 'Grid Color:',
    'Theme配色：': 'Theme Color:',
    '预置ChartTheme：': 'Preset Chart Themes:',
    'Custom配色': 'Custom Colors',
    '按Shape：': 'By Shape:',
    '按{{typeItem.label}}：': 'By {{typeItem.label}}:',
    'Corners半径：': 'Corner Radius:',
    '设为背景': 'Set as Background',
    '操作行：': 'Row Operations:',
    'Add行': 'Add Row',
    '上方Add': 'Add Above',
    '下方Add': 'Add Below',
    '操作列：': 'Column Operations:',
    'Add列': 'Add Column',
    '左侧Add': 'Add Left',
    '右侧Add': 'Add Right',
    'Title行': 'Header Row',
    '上Margin：': 'Top Margin:',
    '下Margin：': 'Bottom Margin:',
    '左Margin：': 'Left Margin:',
    '右Margin：': 'Right Margin:',
    'Dot击ReplaceShape': 'Click to Replace Shape',
    '当前色块：': 'Current Color Block:',
    '渐变角度：': 'Gradient Angle:',
    'ShapeFormat刷': 'Shape Format Painter',
    '背景Color：': 'Background Color:',
    'Apply Theme到All': 'Apply Theme to All',
    '全局统一Font': 'Unify Font Globally',
    '从Slide提取Theme': 'Extract Theme from Slides',
    '预置Theme': 'Preset Themes',
    'Settings并Apply': 'Set & Apply',
    'Apply到Theme': 'Apply to Theme',
    'Theme Color：': 'Theme Color:',
    '（Dot击色块排除不要的Color）': '(Click color blocks to exclude unwanted colors)',
    '将选Medium配置Save为Theme': 'Save Selected Config as Theme',
    'Horizontal均匀分布': 'Distribute Horizontally',
    'Vertical均匀分布': 'Distribute Vertically',
    '选Medium画布Medium的元素AddAnimation': 'Select an element on the canvas to add animation',
    '持续时长：': 'Duration:',
    '触发方式：': 'Trigger Method:',
    '竖向Text Box': 'Vertical Text Box',
    '预设Shape': 'Preset Shapes',
    '自由绘制': 'Free Draw',
    '上传Image': 'Upload Image',
    '在线图库': 'Online Image Library',
    '音Video': 'Audio/Video',
    '上传本地Video': 'Upload Local Video',
    '上传本地Audio': 'Upload Local Audio',
    '输入Find content': 'Enter search content',
    '输入ReplaceContent': 'Enter replacement content',
    '墨迹Thickness：': 'Ink Thickness:',
    '坐标': 'Point',

    # Remaining in hooks
    '每次Select非预设Color时': 'Each time a non-preset color is selected',
    '需要将该Color加入到最近使用ListMedium': 'need to add that color to the recently used list',
    '打On取色吸管': 'Open color picker',
    '检查环境是否支持原生取色吸管': 'Check if native color picker is supported',
    '支持则使用原生吸管': 'use native if supported',
    '否则使用Custom吸管': 'otherwise use custom picker',
    '原生取色吸管': 'Native color picker',
    '基于 Canvas 的Custom取色吸管': 'Canvas-based custom color picker',
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
