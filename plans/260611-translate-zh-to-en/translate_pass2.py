#!/usr/bin/env python3
"""Second pass - fix partial translations and translate remaining strings."""
import re
import sys

# These are exact string replacements for the remaining Chinese text
# Sorted by length descending to avoid partial matches
TRANSLATIONS = {
    # Fix partial translations from pass 1
    'None法正确读取 / 解析该File': 'Unable to correctly read / parse this file',
    'NewSlide面': 'New Slide',
    'NoneTitle节': 'Untitled Section',
    'Text高亮': 'Text Highlight',
    'Slide一Slide': 'Previous Slide',
    'Slide眉': 'Header',
    'Slide脚': 'Footer',
    'Slide面插图': 'Slide Illustration',
    'Select All单元格': 'Select All Cells',
    'Select窗格': 'Selection Pane',
    'Style（多选）': 'Style (Multi-select)',
    'Position（多选）': 'Position (Multi-select)',
    'Table至少保留一列': 'Table must have at least one column',
    'Table至少保留一行': 'Table must have at least one row',
    'Theme Color超出数量限制，已自动选取前6个': 'Theme colors exceeded the limit, the first 6 have been automatically selected',
    'Video加载失败': 'Video failed to load',
    'Export Image失败': 'Failed to export image',
    'Body[小]': 'Body [Small]',
    'Clear本Slide批注': 'Clear Annotations on This Slide',
    'Delete所有节': 'Delete All Sections',
    'Delete此章': 'Delete This Chapter',
    'Delete此节': 'Delete This Section',
    'Delete此项': 'Delete This Item',
    'Delete节': 'Delete Section',
    'Delete节和Slide': 'Delete Section and Slides',
    'Dot击绘制任意Shape，首尾闭合完成绘制，按 ESC 键或Cursor右键Cancel，按 ENTER 键提前完成': 'Click to draw a custom shape. Close the path to finish. Press ESC or right-click to cancel. Press ENTER to complete early.',
    'Dot击输入Presenter Notes': 'Click to enter presenter notes',
    'Export时默认忽略在线Font，若您在Slide中使用了在线Font，且希望Export后保留相关Style，可SelectClose「忽略在线Font」选项，但要注意这将会增加Export用时。': 'Online fonts are ignored by default during export. If you use online fonts in your slides and want to preserve the style after export, uncheck the "Ignore Online Fonts" option. Note that this will increase export time.',
    'Export时默认忽略音Video，若您的Slide中存在音Video元素，且希望将其Export到PPTXFile中，可SelectClose「忽略音Video」选项，但要注意这将会大幅增加Export用时。': 'Audio and video are ignored by default during export. If your slides contain audio/video elements and you want to include them in the PPTX file, uncheck the "Ignore Audio/Video" option. Note that this will significantly increase export time.',
    'Font需要等待加载下载后生效，请稍等': 'Font needs to be downloaded before it takes effect, please wait',
    'Format刷（双击连续使用）': 'Format Painter (double-click for continuous use)',
    'Insert音Video': 'Insert Audio/Video',
    'LaTeX不能为空': 'LaTeX cannot be empty',
    'Linear渐变': 'Linear Gradient',
    'List项Title': 'List Item Title',
    'List项目': 'List Items',
    'PresentationGenerate中，请稍等 ...': 'Generating presentation, please wait ...',
    'Preview全部': 'Preview All',
    'Rows/Columns必须在0~20之间！': 'Rows/Columns must be between 0 and 20!',
    'Start自动Present': 'Start Auto Slideshow',
    'Cancel自动Present': 'Stop Auto Slideshow',
    'Add子级Outline（章）': 'Add Sub-outline (Chapter)',
    'Add子级Outline（节）': 'Add Sub-outline (Section)',
    'Add子级Outline（项）': 'Add Sub-outline (Item)',
    '上方Add同级Outline（章）': 'Add Chapter Above',
    '上方Add同级Outline（节）': 'Add Section Above',
    '上方Add同级Outline（项）': 'Add Item Above',
    '下方Add同级Outline（项）': 'Add Item Below',
    '上一Animation之后': 'After Previous Animation',
    '与上一Animation同时': 'With Previous Animation',
    '从Current Slide中提取': 'Extract from Current Slide',
    '从全部Slide提取': 'Extract from All Slides',
    '从当前Present': 'Present from Current',
    '剪贴板为空或者不包含Text': 'Clipboard is empty or does not contain text',
    '单元格Fill': 'Cell Fill',
    '增大Font Size': 'Increase Font Size',
    '减小Font Size': 'Decrease Font Size',
    '增大段落缩进': 'Increase Paragraph Indent',
    '减小段落缩进': 'Decrease Paragraph Indent',
    '清除Format': 'Clear Formatting',
    '画布Zoom In（Ctrl + =）': 'Zoom In Canvas (Ctrl + =)',
    '画布Zoom Out（Ctrl + -）': 'Zoom Out Canvas (Ctrl + -)',
    '解除Aspect RatioLock': 'Unlock Aspect Ratio',
    '触底显示Thumbnails': 'Show Thumbnails at Bottom',
    '循环Present': 'Loop Slideshow',
    '自动Present': 'Auto Slideshow',
    '显示Tools栏': 'Show Toolbar',
    '普通View': 'Normal View',
    '激光Pen': 'Laser Pointer',
    '进入Fullscreen': 'Enter Fullscreen',
    '最后一Slide': 'Last Slide',
    '查看所有Slide': 'View All Slides',
    '已Apply to All': 'Applied to All',
    '底Align': 'Bottom Align',
    '顶Align': 'Top Align',
    '底部Align': 'Bottom Align',
    '顶部Align': 'Top Align',
    '水平Center Vertically': 'Center Horizontally',
    '忽略大小写': 'Ignore Case',
    '批注面板': 'Annotation Panel',
    '按 ESC 键Close取色吸管': 'Press ESC to close the color picker',
    '浏览器不支持或禁止访问剪贴板，请使用Keyboard Shortcuts Ctrl + V': 'Browser does not support or blocks clipboard access, please use keyboard shortcut Ctrl + V',
    '连接到服务器失败 或 服务器响应超时！': 'Failed to connect to server or server response timed out!',
    '该模型API的并发数过高，请更换其他模型重试': 'The API concurrency for this model is too high, please try a different model',
    '上传的TemplateFile数据异常，请重新上传或使用预置Template': 'The uploaded template file data is abnormal, please re-upload or use a preset template',
    '请先SelectLink目标': 'Please select a link target first',
    '请先输入PPT主题': 'Please enter a PPT topic first',
    '请先输入正确的Audio地址': 'Please enter a valid audio URL',
    '请先输入正确的Video地址': 'Please enter a valid video URL',
    '请输入搜索关键词': 'Enter search keyword',
    '没有可以执行的Text内容': 'No text content to execute',
    '服务器返回了非流响应': 'Server returned a non-streaming response',
    '服务器遇到未知错误！': 'Server encountered an unknown error!',
    '取色吸管初始化失败': 'Color picker initialization failed',
    '选中当前行': 'Select Current Row',
    '选中当前列': 'Select Current Column',
    '封面Slide': 'Cover Slide',
    '内容Slide': 'Content Slide',
    '目录Slide': 'Table of Contents Slide',
    '结束Slide': 'Ending Slide',
    '过渡Slide': 'Transition Slide',
    '气泡菜单': 'Bubble Menu',
    '超Link': 'Hyperlink',
    
    # Pure Chinese strings that weren't caught
    '入场': 'Entrance',
    '退场': 'Exit',
    '强调': 'Emphasis',
    '过渡': 'Transition',
    '主动触发': 'On Click',
    '主题': 'Theme',
    '倍': 'x',
    '倍速': 'Speed',
    '内容': 'Content',
    '停止Preview': 'Stop Preview',
    '全部': 'All',
    '加载中...': 'Loading...',
    '动作': 'Actions',
    '反转': 'Invert',
    '双击连续使用': 'Double-click for continuous use',
    '启用': 'Enable',
    '禁用': 'Disable',
    '垂直': 'Vertical',
    '水平': 'Horizontal',
    '纵向': 'Portrait',
    '横向': 'Landscape',
    '编号': 'Numbering',
    '章': 'Chapter',
    '节': 'Section',
    '大': 'Large',
    '小': 'Small',
    '中': 'Medium',
    '新的一章': 'New Chapter',
    '新的一节': 'New Section',
    '新的一项': 'New Item',
    '默认节': 'Default Section',
    '节编号': 'Section Number',
    '增加节': 'Add Section',
    '重命名节': 'Rename Section',
    '方形': 'Square',
    '径向渐变': 'Radial Gradient',
    '缩放': 'Zoom',
    '缩放铺满': 'Zoom to Fill',
    '布局': 'Layout',
    '封面': 'Cover',
    '目录': 'Table of Contents',
    '结束': 'Ending',
    '返回': 'Back',
    '搜索': 'Search',
    '色相': 'Hue',
    '锐化': 'Sharpen',
    '开': 'On',
    '关': 'Off',
    '自动': 'Auto',
    '通用': 'General',
    '背景图': 'Background Image',
    '计时器': 'Timer',
    '测试用户': 'Test User',
    '拼贴': 'Collage',
    
    # Aspect ratios
    '纵横比（横向）': 'Aspect Ratio (Landscape)',
    '纵横比（纵向）': 'Aspect Ratio (Portrait)',
    '纵横比（正方形）': 'Aspect Ratio (Square)',
    '竖向 A3 / A4': 'Portrait A3 / A4',
    '纸张 A3 / A4': 'Paper A3 / A4',

    # AI PPT
    'AI搜图': 'AI Image Search',
    'AI生图': 'AI Image Generation',
    'AI辅助': 'AI Assistant',
    'AIGC在教育领域的Apply': 'AIGC in Education',
    '扩写丰富': 'Expand & Enrich',
    '精简提炼': 'Simplify & Refine',
    '美化改写': 'Beautify & Rewrite',
    '未MarkType': 'Unknown Type',
    '模拟测试': 'Mock Test',

    # Template/slide content (mock data strings found in code)
    '项目编号': 'Project Number',
    '项目插图': 'Project Illustration',
    '社区贡献+官方深度完善优化': 'Community contributed + officially refined and optimized',
    '官方制作': 'Officially made',

    # Template theme names
    '都市蓝调': 'Urban Blues',
    '浅蓝小清新': 'Light Blue Fresh',
    '山河映红': 'Mountain Glow',
    '暖色复古': 'Warm Vintage',
    '柔光莫兰迪': 'Soft Morandi',
    '智感几何': 'Smart Geometry',
    '深邃沉稳': 'Deep Calm',
    '简约绿意': 'Simple Green',
    '复古': 'Vintage',
    '明亮': 'Bright',
    '柔和': 'Soft',
    '暖色': 'Warm',
    '鲜艳': 'Vivid',
    '黑白': 'Black & White',
    '黑板': 'Blackboard',

    # PPT template topic labels
    '职场风': 'Business Style',
    '学术风': 'Academic Style',
    '教育风': 'Education Style',
    '营销风': 'Marketing Style',
    
    # Template slide topics
    '5G技术如何改变我们的生活': 'How 5G Technology Changes Our Lives',
    '公司年会策划方案': 'Company Annual Party Planning',
    '年度工作总结与展望': 'Annual Work Summary & Outlook',
    '大学生职业生涯规划': 'College Student Career Planning',
    '大数据如何改变世界': 'How Big Data Changes the World',
    '区块链技术及其Apply': 'Blockchain Technology and Applications',
    '社交媒体与品牌营销': 'Social Media & Brand Marketing',
    '餐饮市场调查与研究': 'Food Service Market Research',
    '2025科技前沿动态': '2025 Technology Trends',

    # Image library categories
    '风景': 'Landscape',
    '食物': 'Food',
    '动植物': 'Flora & Fauna',
    '旅行': 'Travel',
    '物品': 'Objects',
    '活动': 'Events',

    # Language labels
    '中文': 'Chinese',
    '日文': 'Japanese',
    '日本語': 'Japanese',
    '英文': 'English',

    # Font name
    '微软雅黑': 'Microsoft YaHei',

    # Inline HTML content
    '<p>新AddText</p>': '<p>New Text</p>',
}

def translate_file(filepath):
    """Read file, replace strings, write back."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"  SKIP: {filepath}: {e}")
        return 0

    original = content
    count = 0
    
    # Sort by length descending to avoid partial matches
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
            print(f"  ✓ {f} ({n} translations)")
            total += n
    print(f"\nTotal: {total} translation keys applied across {len(files)} files")

if __name__ == '__main__':
    main()
