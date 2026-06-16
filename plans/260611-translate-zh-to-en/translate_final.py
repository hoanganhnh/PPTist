#!/usr/bin/env python3
"""Final comprehensive pass - fix all remaining Chinese text in Vue/TS files."""
import sys
import re

# Complete exact-match replacements for remaining text
TRANSLATIONS = {
    # EditorHeader/index.vue
    '输入一句话，智能GeneratePresentation': 'Enter a sentence to intelligently generate a presentation',
    '（仅供测试）': '(Test Only)',
    '（专属Format）': '(Exclusive Format)',
    '快捷操作': 'Shortcuts',
    '注：本站仅作测试/演示，不提供任何形式的服务': 'Note: This site is for testing/demo purposes only and does not provide any services',
    '从头Start': 'From Beginning',
    '从Current SlideStart': 'From Current Slide',
    '正在Import...': 'Importing...',
    
    # NotesPanel.vue
    '的批注': ' Annotations',
    '回复': 'Reply',
    '输入回复Content': 'Enter reply content',
    '本SlideNone批注': 'No annotations on this slide',
    '输入批注（为': 'Enter annotation (for ',
    'Current SlideSlide': 'Current Slide',
    'Add批注': 'Add Annotation',
    
    # MarkupPanel.vue
    'Current Slide面Type：': 'Current Slide Type:',
    '当前TextType：': 'Current Text Type:',
    '当前ImageType：': 'Current Image Type:',
    '选MediumImage、Text、带Text的Shape，MarkType': 'Select an image, text, or shape with text to mark type',
    
    # SelectPanel.vue
    'All显示': 'Show All',
    'All隐藏': 'Hide All',
    '本SlideNoneContent': 'No content on this slide',
    
    # ImageLibPanel.vue
    'Image库（来自 pexels.com）': 'Image Library (from pexels.com)',
    
    # RichTextBase.vue
    '着色（Mask）：': 'Colorize (Mask):',
    '美化': 'Beautify',
    '扩写': 'Expand',
    '精简': 'Simplify',
    '段落缩进': 'Paragraph Indent',
    'Font Size': 'Font Size',
    
    # ExportDialog
    'Export范围：': 'Export Range:',
    'Custom范围：': 'Custom Range:',
    'Export模式：': 'Export Mode:',
    'Standard版': 'Standard',
    '纯图版': 'Image Only',
    '忽略Audio/Video：': 'Ignore Audio/Video:',
    '覆盖默认母版：': 'Override Default Master:',
    'Image质量：': 'Image Quality:',
    '忽略在线Font：': 'Ignore Online Fonts:',
    'Tip：.pptist 是本Apply的特有File后缀，支持将该Type的FileImport回ApplyMedium。': 'Tip: .pptist is a unique file format for this app. Files of this type can be imported back into the application.',
    'Tip：1. 支持ExportFormat：avi、mp4、mov、wmv、mp3、wav；2. 跨域资源None法Export。': 'Tip: 1. Supported export formats: avi, mp4, mov, wmv, mp3, wav. 2. Cross-origin resources cannot be exported.',
    '正在Export...': 'Exporting...',
    '每Slide数量：': 'Slides per Page:',
    '边缘留白：': 'Edge Margin:',
    '建议：请在弹出的Print窗口Medium勾选「Background Image形」选项，MarginSelect「默认」。': 'Tip: In the print dialog, check the "Background Graphics" option and set margins to "Default".',
    
    # CanvasTool/index.vue
    '选择一张或多张Image文件': 'Select one or more image files',
    '选择一个SVG文件': 'Select an SVG file',
    '选择一个Audio/VideoFile': 'Select an audio or video file',
    '编辑器中没有可插入的元素': 'No insertable elements in the editor',
    '请先创建一个Shape，然后InsertMedia': 'Please create a shape first, then insert media',
    
    # WritingBoardTool.vue
    '其他Tools': 'Other Tools',
    '粗细': 'Thickness',
    
    # AIPPTDialog.vue
    '从下方挑选合适的TemplateGeneratePPT，或': 'Pick a template below to generate PPT, or',
    '使用本地TemplateGenerate': 'Use Local Template',
    'Confirm下方ContentOutline（Dot击EditContent，右键Add/DeleteOutline项），StartSelect Template': 'Confirm the content outline below (click to edit, right-click to add/delete items), then select a template',
    '在下方输入您的PPTTheme，并适当补充信息，如行业、岗位、学科、用途等': 'Enter your PPT topic below with optional details such as industry, position, subject, or purpose',
    '语言：': 'Language:',
    '风格：': 'Style:',
    '模型：': 'Model:',
    '配图：': 'Images:',
    '覆盖已有Slide': 'Overwrite Existing Slides',
    'Back重新Generate': 'Back to Regenerate',
    '请输入PPTTheme，如：College Student Career Planning': 'Enter PPT topic, e.g.: College Student Career Planning',
    'AIGenerateMedium，请耐心等待 ...': 'AI is generating, please wait ...',
    
    # Toolbar panels
    'Lock Aspect RatioLock': 'Aspect Ratio Lock',
    '预设Color': 'Preset Colors',
    '最近使用：': 'Recently Used:',
    
    # Canvas
    '元素Bubble Menu已': 'Element bubble menu ',
    '请输入Web Link地址': 'Please enter web link URL',
    '绘制Line专用': 'Line drawing only',
    
    # SearchPanel
    '忽略大小写': 'Ignore Case',
    
    # App.vue
    '数据初始化Medium，请稍等 ...': 'Initializing data, please wait ...',
    
    # Table-related
    'Dot击更换': 'Click to Change',
    'Clear数据': 'Clear Data',
    'Fill色：': 'Fill Color:',
    'None可用属性': 'No available properties',
    '置顶': 'To Front',
    '置底': 'To Back',
    '退出Edit': 'Exit Edit',
    '新Slide': 'New Slide',
    '退出Play': 'Exit Playback',
    '双击Edit': 'Double-click to Edit',
    '上方Insert Row': 'Insert Row Above',
    '下方Insert Row': 'Insert Row Below',
    '左侧Insert Column': 'Insert Column Left',
    '右侧Insert Column': 'Insert Column Right',
    'Edit数据': 'Edit Data',
    
    # TextElement
    '输入Section名称': 'Enter section name',
    
    # Remaining Chinese in templates
    '选择元素后可Edit': 'Select an element to edit',
    '当前None选Medium元素': 'No element currently selected',
    'Slide面': 'Slide',
    '在此处输入': 'Enter here',
    
    # Toolbar/SlideDesignPanel
    '从模板中应用': 'Apply from Template',
    '自定义主题色': 'Custom Theme Color',
    '应用到全部Slide': 'Apply to All Slides',
    '提取当前Slide': 'Extract Current Slide',
    
    # ElementAnimationPanel
    '入场动画': 'Entrance Animation',
    '退场动画': 'Exit Animation',
    '强调动画': 'Emphasis Animation',
    '触发条件': 'Trigger Condition',
    '延迟时间': 'Delay Time',
    '持续时间': 'Duration',
    '动画速度': 'Animation Speed',
    '毫秒': 'ms',
    '秒': 'sec',
    '添加动画': 'Add Animation',
    '删除动画': 'Delete Animation',
    
    # Shapes/Lines
    '线条起点': 'Line Start',
    '线条终点': 'Line End',
    '虚线间隔': 'Dash Gap',
    
    # Video/Audio
    '循环': 'Loop',
    
    # More remaining fragments  
    'Chart类型': 'Chart Type',
    'Image裁剪': 'Image Crop',
    'Image翻转': 'Image Flip',
    'Image蒙版': 'Image Mask',
    'Shape翻转': 'Shape Flip',
    'Shape填充': 'Shape Fill',
    'Table样式': 'Table Style',
    'Table头行': 'Header Row',
    '带状行列': 'Banded Rows/Columns',
    '第一列/最后一列': 'First/Last Column',
    
    # Misc
    '更换': 'Change',
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
