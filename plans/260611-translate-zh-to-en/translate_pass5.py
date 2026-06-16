#!/usr/bin/env python3
"""Final pass - fix remaining partial translations in Vue templates and TS code."""
import sys

TRANSLATIONS = {
    # Remaining partial translations and template text
    '数据初始化Medium，请稍等 ...': 'Initializing data, please wait ...',
    '输入Section名称': 'Enter section name',
    '元素Bubble Menu已': 'Element bubble menu has been ',
    '请输入Web Link地址': 'Please enter web link URL',
    'Tip：.pptist 是本Apply的特有File后缀，支持将该Type的FileImport回ApplyMedium。': 'Tip: .pptist is a unique file format for this app. You can import files of this type back into the application.',
    'Tip：1. 支持ExportFormat：avi、mp4、mov、wmv、mp3、wav；2. 跨域资源None法Export。': 'Tip: 1. Supported export formats: avi, mp4, mov, wmv, mp3, wav; 2. Cross-origin resources cannot be exported.',
    '正在Export...': 'Exporting...',
    '每Slide数量：': 'Slides per Page:',
    '边缘留白：': 'Edge Margin:',
    '建议：请在弹出的Print窗口Medium勾选「Background Image形」选项，MarginSelect「默认」。': 'Tip: In the print dialog, check the "Background Graphics" option and set margins to "Default".',
    '的批注': ' Annotations',
    '回复': 'Reply',
    '输入回复Content': 'Enter reply content',
    '本SlideNone批注': 'No annotations on this slide',
    '输入批注（为': 'Enter annotation (for ',
    'Add批注': 'Add Annotation',
    'Current Slide面Type：': 'Current Slide Type:',
    '当前TextType：': 'Current Text Type:',
    '当前ImageType：': 'Current Image Type:',
    '选MediumImage、Text、带Text的Shape，MarkType': 'Select an image, text, or shape with text to mark type',
    'All显示': 'Show All',
    'All隐藏': 'Hide All',
    '本SlideNoneContent': 'No content on this slide',
    'Image库（来自 pexels.com）': 'Image Library (from pexels.com)',
    '着色（Mask）：': 'Colorize (Mask):',
    '美化': 'Beautify',
    '扩写': 'Expand',
    '精简': 'Simplify',
    'Dot击更换Chart类型': 'Click to change chart type',
    '绘制Line专用': 'Line drawing',
    
    # Comments that appear on same lines as code
    '当Font Size过Large且行高较Small时，会出现TextHeight溢出的情况，导致拖拽区域None法被选Medium，因此Add了以下SectionDot避免该情况': 'When font size is too large and line height is too small, text height overflows causing drag area to be unselectable. Added this section to avoid that.',
    
    # Store inline comments (code lines with trailing comments)
    '被选Medium的元素ID集合': 'Selected element ID collection',
    '正在操作的元素ID': 'Element ID being operated on',
    'Group元素成员Medium，被选Medium可独立操作的元素ID': 'Group element member, selected element ID that can be operated independently',
    '被隐藏的元素ID集合': 'Hidden element ID collection',
    '画布可视区域百分比': 'Canvas visible area percentage',
    'Canvas Zoom比例': 'Canvas zoom ratio',
    '画布被拖拽移动': 'Canvas being dragged',
    '左侧导航Thumbnails区域聚焦': 'Left navigation thumbnails area focused',
    'Edit区域聚焦': 'Editor area focused',
    'Grid LinesSize': 'Grid line size',
    '不Show Grid Lines': 'do not show grid lines',
    '显示浮动菜单': 'Show floating menu',
    '正在Insert的元素信息': 'Element info being inserted',
    '需要通过绘制Insert的元素': 'Elements that need to be drawn to insert',
    '正在绘制任意多边形': 'Drawing custom polygon',
    '右侧Tools栏状态': 'Right toolbar state',
    '当前正在Crop的ImageID': 'Image ID currently being cropped',
    '富Text状态': 'Rich text state',
    '选Medium的Table单元格': 'Selected table cells',
    '正在进行元素Zoom': 'Element zoom in progress',
    '当前被选Medium的Slide面索引集合': 'Currently selected slide index collection',
    'Export面板': 'Export panel',
    
    # Apply/other partial translations
    'Apply注销时向': 'When app unloads,',
    '记录下本次': 'record this',
    '的数据库ID': 'database ID',
    '用于之后清除数据库': 'for clearing the database later',
    
    # Remaining misc
    '正在加载，请稍等': 'Loading, please wait',
    '类型': 'Type',
    'Dot击': 'Click',
    'Medium': '',  # Don't translate this as it's probably partial
}

def translate_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        return 0
    original = content
    count = 0
    # Sort by length descending
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
