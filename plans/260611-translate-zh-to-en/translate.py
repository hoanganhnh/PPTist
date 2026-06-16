#!/usr/bin/env python3
"""Batch translate Chinese strings to English in PPTist source files."""
import re
import sys

# Translation dictionary mapping Chinese strings to English
TRANSLATIONS = {
    # imageClip.ts shape names
    '矩形2': 'Rectangle 2',
    '矩形3': 'Rectangle 3',
    '圆角矩形': 'Rounded Rectangle',
    '圆形': 'Circle',
    '三角形': 'Triangle',
    '直角三角形': 'Right Triangle',
    '倒三角形': 'Inverted Triangle',
    '菱形': 'Diamond',
    '五边形': 'Pentagon',
    '六边形': 'Hexagon',
    '七边形': 'Heptagon',
    '八边形': 'Octagon',
    '人字形': 'Chevron',
    '点': 'Dot',
    '箭头': 'Arrow',
    '平行四边形': 'Parallelogram',
    '反平行四边形': 'Reverse Parallelogram',
    '梯形': 'Trapezoid',
    '倒梯形': 'Inverted Trapezoid',
    '十字形': 'Cross',
    '减号': 'Minus',
    '加号': 'Plus',
    '星形': 'Star',
    '右箭头': 'Right Arrow',
    '左箭头': 'Left Arrow',
    '上箭头': 'Up Arrow',
    '下箭头': 'Down Arrow',
    '矩形': 'Rectangle',

    # shapes.ts shape group types
    '常用形状': 'Common Shapes',
    '其他形状': 'Other Shapes',
    '线性': 'Linear',

    # index.html
    '正在加载中，请稍等 ...': 'Loading, please wait ...',
    '在线演示文稿（幻灯片）应用，还原了大部分 Office PowerPoint 常用功能，实现在线PPT的编辑、演示，支持导出PPT文件，支持AI生成PPT。': 'Online presentation (slideshow) app. Implements most common Office PowerPoint features for online PPT editing, presenting, export, and AI generation.',
    'pptist,ppt,powerpoint,office powerpoint,在线ppt,幻灯片,演示文稿,ppt在线制作,aippt': 'pptist,ppt,powerpoint,office powerpoint,online ppt,slideshow,presentation,ppt maker,aippt',
    'PPTist - 在线演示文稿': 'PPTist - Online Presentations',

    # App.vue
    '正在加载资源，请稍候 ...': 'Loading resources, please wait ...',
    '加载中 ...': 'Loading ...',

    # store
    '未命名演示文稿': 'Untitled Presentation',
    '幻灯片': 'Slide',
    '演示文稿': 'Presentation',

    # EditorHeader menu items
    '新建': 'New',
    '导入': 'Import',
    '导出': 'Export',
    '打印': 'Print',
    '另存为图片': 'Save as Image',
    '预览': 'Preview',
    '编辑': 'Edit',
    '撤销': 'Undo',
    '重做': 'Redo',
    '恢复': 'Redo',
    '复制': 'Copy',
    '粘贴': 'Paste',
    '粘贴为纯文本': 'Paste as Plain Text',
    '剪切': 'Cut',
    '删除': 'Delete',
    '全选': 'Select All',
    '查找': 'Find',
    '替换': 'Replace',
    '查找替换': 'Find & Replace',
    '搜索替换': 'Find & Replace',
    '幻灯片放映': 'Slideshow',
    '从头放映': 'From Beginning',
    '从当前页放映': 'From Current Slide',
    '帮助': 'Help',
    '快捷键': 'Keyboard Shortcuts',
    '关于': 'About',
    '文件': 'File',
    '视图': 'View',
    '格式': 'Format',
    '工具': 'Tools',
    '插入': 'Insert',
    '放映': 'Present',
    '开始': 'Start',
    '设计': 'Design',
    '切换': 'Transitions',
    '动画': 'Animation',
    '幻灯片母版': 'Slide Master',
    '保存': 'Save',
    '标记笔': 'Markup Pen',
    '标注': 'Annotation',

    # Canvas context menus
    '锁定': 'Lock',
    '解锁': 'Unlock',
    '组合': 'Group',
    '取消组合': 'Ungroup',
    '置顶层': 'Bring to Front',
    '置底层': 'Send to Back',
    '上移一层': 'Bring Forward',
    '下移一层': 'Send Backward',
    '设置链接': 'Set Link',
    '取消链接': 'Remove Link',
    '排列': 'Arrange',
    '对齐': 'Align',
    '水平等间距': 'Distribute Horizontally',
    '垂直等间距': 'Distribute Vertically',
    '左对齐': 'Align Left',
    '右对齐': 'Align Right',
    '上对齐': 'Align Top',
    '下对齐': 'Align Bottom',
    '水平居中': 'Center Horizontally',
    '垂直居中': 'Center Vertically',
    '中心对齐': 'Center Align',
    '快速复制粘贴': 'Quick Duplicate',

    # Toolbar tabs and labels
    '样式': 'Style',
    '位置': 'Position',
    '宽度': 'Width',
    '高度': 'Height',
    '旋转': 'Rotation',
    '颜色': 'Color',
    '透明度': 'Opacity',
    '边框': 'Border',
    '圆角': 'Corners',
    '阴影': 'Shadow',
    '滤镜': 'Filter',
    '翻转': 'Flip',
    '水平翻转': 'Flip Horizontal',
    '垂直翻转': 'Flip Vertical',
    '填充': 'Fill',
    '无填充': 'No Fill',
    '纯色填充': 'Solid Fill',
    '渐变填充': 'Gradient Fill',
    '图片填充': 'Image Fill',
    '文字': 'Text',
    '字号': 'Font Size',
    '字间距': 'Letter Spacing',
    '行间距': 'Line Height',
    '段间距': 'Paragraph Spacing',
    '内边距': 'Padding',
    '加粗': 'Bold',
    '斜体': 'Italic',
    '下划线': 'Underline',
    '删除线': 'Strikethrough',
    '上标': 'Superscript',
    '下标': 'Subscript',
    '对齐方式': 'Alignment',
    '左对齐': 'Left',
    '居中': 'Center',
    '右对齐': 'Right',
    '两端对齐': 'Justify',
    '列表': 'List',
    '有序列表': 'Ordered List',
    '无序列表': 'Unordered List',
    '项目符号': 'Bullet List',
    '编号列表': 'Numbered List',
    '引用': 'Quote',
    '行内代码': 'Inline Code',
    '代码块': 'Code Block',
    '链接': 'Link',
    '上角标': 'Superscript',
    '下角标': 'Subscript',
    '字体': 'Font',
    '字体颜色': 'Font Color',
    '高亮颜色': 'Highlight Color',
    '文字颜色': 'Text Color',
    '无': 'None',
    '确定': 'Confirm',
    '取消': 'Cancel',
    '关闭': 'Close',
    '应用': 'Apply',
    '应用到全部': 'Apply to All',
    '重置': 'Reset',
    '选择': 'Select',
    '提示': 'Tip',
    '警告': 'Warning',
    '确认': 'Confirm',

    # SlideDesignPanel
    '背景填充': 'Background Fill',
    '画布尺寸': 'Canvas Size',
    '宽高比': 'Aspect Ratio',
    '宽屏': 'Widescreen',
    '标准': 'Standard',
    '自定义': 'Custom',
    '应用背景到全部': 'Apply Background to All',
    '预设主题': 'Preset Themes',
    '全局主题': 'Global Theme',
    '主题色': 'Theme Color',
    '背景色': 'Background Color',
    '字体色': 'Font Color',
    '设置全局主题': 'Set Global Theme',
    '提取主题风格': 'Extract Theme Style',

    # ElementPositionPanel
    '水平位置': 'X Position',
    '垂直位置': 'Y Position',
    '旋转角度': 'Rotation Angle',
    '层级': 'Layer',

    # Search panel
    '查找内容': 'Find content',
    '替换为': 'Replace with',
    '全部替换': 'Replace All',
    '上一个': 'Previous',
    '下一个': 'Next',
    '替换当前': 'Replace Current',
    '未查找到匹配项': 'No matches found',
    '请先输入查找内容': 'Please enter a search term',
    '全部替换完成': 'All replacements completed',
    '已到达最后一个匹配项，将从头开始': 'Reached the last match, restarting from the beginning',
    '已到达第一个匹配项': 'Reached the first match',
    '大小写匹配': 'Match Case',

    # CanvasTool
    '文本框': 'Text Box',
    '形状': 'Shape',
    '图片': 'Image',
    '图表': 'Chart',
    '表格': 'Table',
    '视频': 'Video',
    '音频': 'Audio',
    '公式': 'LaTeX',
    '线条': 'Line',
    '文本': 'Text',

    # Screen/Presentation
    '画笔': 'Pen',
    '荧光笔': 'Highlighter',
    '橡皮擦': 'Eraser',
    '清除墨迹': 'Clear Ink',
    '批注工具': 'Annotation Tools',
    '结束放映': 'End Show',
    '已经是第一页了': 'Already the first slide',
    '已经是最后一页了': 'Already the last slide',
    '已到达第一页': 'Reached the first slide',
    '已到达最后一页': 'Reached the last slide',
    '演讲者备注': 'Presenter Notes',
    '演讲者视图': 'Presenter View',
    '观众视图': 'Audience View',
    '倒计时': 'Countdown',
    '当前页': 'Current Slide',
    '总页数': 'Total Slides',
    '页': 'Slide',
    '分钟': 'min',
    '秒': 'sec',
    '全屏': 'Fullscreen',
    '退出全屏': 'Exit Fullscreen',
    '画板': 'Drawing Board',
    '缩略图': 'Thumbnails',
    '上一页': 'Previous',
    '下一页': 'Next',

    # Notes panel
    '备注': 'Notes',
    '演讲者备注': 'Presenter Notes',
    '更多': 'More',

    # Markup panel
    '笔': 'Pen',
    '标记': 'Mark',
    '标注类型': 'Annotation Type',
    '鼠标': 'Cursor',
    '橡皮': 'Eraser',
    '画笔工具': 'Brush Tool',
    '荧光笔工具': 'Highlighter Tool',
    '橡皮工具': 'Eraser Tool',

    # Link dialog
    '网页链接': 'Web Link',
    '幻灯片页面': 'Slide Page',
    '链接地址': 'Link URL',
    '打开链接': 'Open Link',
    '编辑链接': 'Edit Link',
    '删除链接': 'Remove Link',
    '链接到幻灯片': 'Link to Slide',
    '第': 'Slide',
    '张幻灯片': '',
    '不是正确的网页链接地址': 'Invalid web link address',
    '请输入正确的网页链接': 'Please enter a valid web link',

    # Clipboard
    '剪贴板为空或不包含可读取的内容': 'Clipboard is empty or does not contain readable content',
    '读取剪贴板内容失败': 'Failed to read clipboard content',
    '当前浏览器不支持读取剪贴板内容': 'Current browser does not support reading clipboard content',

    # Export
    '导出中...': 'Exporting...',
    '导出失败': 'Export failed',
    '导出成功': 'Export successful',
    '导出图片': 'Export Image',
    '导出PDF': 'Export PDF',
    '导出PPTX': 'Export PPTX',
    '导出JSON': 'Export JSON',

    # Import
    '导入中...': 'Importing...',
    '导入失败': 'Import failed',
    '导入成功': 'Import successful',
    '无法解析该文件': 'Unable to parse this file',
    '文件解析失败': 'File parsing failed',
    '不支持的文件格式': 'Unsupported file format',

    # Network
    '未知的请求错误': 'Unknown request error',
    '网络异常': 'Network error',
    '请求超时': 'Request timeout',
    '网络连接失败': 'Network connection failed',
    '服务器错误': 'Server error',

    # Element operations
    '新建文本': 'New Text',
    '输入文本': 'Enter text',
    '双击输入内容': 'Double-click to enter content',
    '在此输入内容': 'Enter content here',
    '请输入内容': 'Please enter content',
    '默认文本': 'Default Text',
    '点击输入标题': 'Click to add title',
    '点击输入副标题': 'Click to add subtitle',
    '点击输入正文': 'Click to add body text',
    '点击此处添加标题': 'Click here to add title',
    '点击此处添加内容': 'Click here to add content',

    # Thumbnails context menu
    '新建幻灯片': 'New Slide',
    '复制幻灯片': 'Copy Slide',
    '粘贴幻灯片': 'Paste Slide',
    '删除幻灯片': 'Delete Slide',
    '复制页面': 'Copy Page',
    '粘贴页面': 'Paste Page',
    '删除页面': 'Delete Page',
    '上移': 'Move Up',
    '下移': 'Move Down',
    '移动到最前': 'Move to First',
    '移动到最后': 'Move to Last',
    '选中全部': 'Select All',
    '撤销全部选择': 'Deselect All',

    # ChartDataEditor
    '系列': 'Series',
    '类别': 'Category',
    '类型': 'Type',
    '添加系列': 'Add Series',
    '添加类别': 'Add Category',
    '删除系列': 'Delete Series',
    '删除类别': 'Delete Category',

    # LaTeX editor
    '常用符号': 'Common Symbols',
    '预置公式': 'Preset Formulas',
    '预览': 'Preview',
    '输入 LaTeX 公式': 'Enter LaTeX formula',
    '公式预览': 'Formula Preview',
    '请输入正确的 LaTeX 代码': 'Please enter valid LaTeX code',
    '无法识别当前公式': 'Unable to recognize the current formula',

    # OutlineEditor
    '添加章': 'Add Chapter',
    '添加节': 'Add Section',
    '删除当前项': 'Delete Current Item',
    '向上移动': 'Move Up',
    '向下移动': 'Move Down',
    '降级': 'Demote',
    '升级': 'Promote',

    # SymbolPanel
    '特殊符号': 'Special Symbols',
    '表情': 'Smileys',
    '符号': 'Symbols',

    # Select panel
    '选择面板': 'Selection Panel',
    '全选元素': 'Select All Elements',
    '取消全选': 'Deselect All',
    '元素列表': 'Element List',
    '当前页面没有元素': 'No elements on the current page',

    # WritingBoard
    '画笔颜色': 'Pen Color',
    '画笔粗细': 'Pen Thickness',
    '保存墨迹': 'Save Ink',

    # Fullscreen messages
    '您的浏览器不支持全屏': 'Your browser does not support fullscreen',
    '进入全屏失败': 'Failed to enter fullscreen',

    # Countdown
    '开始计时': 'Start Timer',
    '暂停': 'Pause',
    '继续': 'Continue',
    '重置计时': 'Reset Timer',

    # AI PPT Dialog
    '自动生成': 'Auto Generate',
    '正在生成...': 'Generating...',
    '请输入主题': 'Enter topic',
    '生成失败': 'Generation failed',
    '生成成功': 'Generation successful',
    'AI生成PPT': 'AI Generate PPT',
    '输入PPT主题或简介': 'Enter PPT topic or brief',
    '模板': 'Template',
    '选择模板': 'Select Template',
    '大纲': 'Outline',
    '编辑大纲': 'Edit Outline',
    '生成': 'Generate',
    '取消生成': 'Cancel Generation',

    # Table operations
    '合并单元格': 'Merge Cells',
    '拆分单元格': 'Split Cells',
    '插入行': 'Insert Row',
    '插入列': 'Insert Column',
    '删除行': 'Delete Row',
    '删除列': 'Delete Column',
    '在上方插入一行': 'Insert Row Above',
    '在下方插入一行': 'Insert Row Below',
    '在左侧插入一列': 'Insert Column Left',
    '在右侧插入一列': 'Insert Column Right',
    '删除选中行': 'Delete Selected Row',
    '删除选中列': 'Delete Selected Column',
    '主题色': 'Theme Color',
    '表格样式': 'Table Style',
    '行数': 'Rows',
    '列数': 'Columns',
    '表头行': 'Header Row',
    '汇总行': 'Summary Row',
    '带状行': 'Banded Rows',
    '带状列': 'Banded Columns',
    '第一列': 'First Column',
    '最后一列': 'Last Column',

    # Shape style
    '形状填充': 'Shape Fill',
    '形状边框': 'Shape Border',
    '形状阴影': 'Shape Shadow',
    '形状透明度': 'Shape Opacity',
    '形状翻转': 'Shape Flip',

    # Image style
    '图片裁剪': 'Image Crop',
    '图片边框': 'Image Border',
    '图片阴影': 'Image Shadow',
    '图片透明度': 'Image Opacity',
    '图片翻转': 'Image Flip',
    '蒙版': 'Mask',

    # Line style
    '线条颜色': 'Line Color',
    '线条样式': 'Line Style',
    '线条粗细': 'Line Width',
    '线条端点': 'Line Endpoints',
    '实线': 'Solid',
    '虚线': 'Dashed',
    '点线': 'Dotted',

    # Video/Audio
    '视频封面': 'Video Cover',
    '自动播放': 'Auto Play',
    '循环播放': 'Loop',
    '显示控制器': 'Show Controls',
    '音频图标': 'Audio Icon',
    '播放': 'Play',
    '暂停播放': 'Pause',

    # Filter labels
    '模糊': 'Blur',
    '亮度': 'Brightness',
    '对比度': 'Contrast',
    '灰度': 'Grayscale',
    '饱和度': 'Saturation',
    '色相旋转': 'Hue Rotate',
    '反色': 'Invert',
    '透明度': 'Opacity',
    '褐色': 'Sepia',

    # Shadow labels
    '阴影颜色': 'Shadow Color',
    '模糊程度': 'Blur Amount',
    '水平偏移': 'Horizontal Offset',
    '垂直偏移': 'Vertical Offset',

    # Outline labels
    '边框样式': 'Border Style',
    '边框颜色': 'Border Color',
    '边框粗细': 'Border Width',

    # Text style presets
    '大标题': 'Heading 1',
    '副标题': 'Subtitle',
    '正文': 'Body',
    '标题': 'Title',
    '小标题': 'Heading 2',
    '正文（小）': 'Body (Small)',
    '引用文字': 'Quote Text',
    '注释': 'Annotation',
    '注释文字': 'Annotation Text',

    # Multi-style panel
    '统一样式': 'Unified Style',

    # Slide operations
    '选中元素': 'Selected Elements',
    '当前未选中元素': 'No element selected',

    # Screen mode
    '放映设置': 'Slideshow Settings',
    '进入放映': 'Start Slideshow',
    '画笔模式': 'Drawing Mode',
    '指针模式': 'Pointer Mode',

    # Common comments (keeping key technical ones)
    '非专业设计人士可以用该应用绘制基本形状': 'Non-professional designers can use this app to draw basic shapes',

    # useOrderElement
    '上移一层': 'Bring Forward',
    '下移一层': 'Send Backward',
    '已经在最顶层': 'Already at the top',
    '已经在最底层': 'Already at the bottom',

    # useCreateElement
    '请输入链接地址': 'Please enter a link URL',
    '默认文本框': 'Default Text Box',

    # useCopyAndPasteElement
    '已粘贴': 'Pasted',
    '已复制': 'Copied',

    # useDeleteElement
    '确认删除': 'Confirm Delete',

    # useLockElement
    '已锁定': 'Locked',
    '已解锁': 'Unlocked',

    # Export dialog
    '导出为图片': 'Export as Image',
    '导出为PDF文件': 'Export as PDF',
    '导出为PPTX文件': 'Export as PPTX',
    '导出为JSON文件': 'Export as JSON',
    '导出当前页': 'Export Current Page',
    '导出全部': 'Export All',

    # Misc
    '更多选项': 'More Options',
    '设置': 'Settings',
    '清空': 'Clear',
    '模板应用': 'Apply Template',
    '显示网格线': 'Show Grid Lines',
    '显示标尺': 'Show Ruler',
    '调整到合适大小': 'Fit to Screen',
    '缩小': 'Zoom Out',
    '放大': 'Zoom In',
    '适应屏幕': 'Fit to Screen',
    '网格线': 'Grid Lines',
    '标尺': 'Ruler',
    '吸附对齐': 'Snap to Align',

    # Database
    '数据库错误': 'Database error',
    '索引数据库不可用': 'IndexedDB is not available',

    # Contextmenu
    '选择元素': 'Select Element',

    # useSearch
    '没有更多了': 'No more results',

    # usePasteEvent / clipboard
    '粘贴失败': 'Paste failed',

    # useSlideHandler
    '是否确认删除当前页面？': 'Are you sure you want to delete the current page?',
    '此操作不可恢复': 'This action cannot be undone',

    # useCombineElement
    '已组合': 'Grouped',
    '已取消组合': 'Ungrouped',

    # useHistorySnapshot
    '无法撤销': 'Cannot undo',
    '无法重做': 'Cannot redo',

    # useSlideTheme
    '应用主题': 'Apply Theme',
    '已应用': 'Applied',

    # useScreening
    '开始放映': 'Start Slideshow',

    # useScaleCanvas
    '画布缩放': 'Canvas Zoom',

    # Fullscreen
    '该浏览器不支持全屏操作': 'This browser does not support fullscreen',

    # Misc hooks
    '请选择要操作的元素': 'Please select an element to operate on',
    '元素已被锁定': 'Element is locked',
    '当前元素不支持此操作': 'This element does not support this operation',
    '操作成功': 'Operation successful',
    '操作失败': 'Operation failed',

    # Additional miscellaneous
    '暂无': 'None',
    '确认删除?': 'Confirm delete?',
    '取消选择': 'Deselect',
    '添加': 'Add',
    '移除': 'Remove',
    '裁剪': 'Crop',
    '旋转角度': 'Rotation Angle',
    '锁定比例': 'Lock Ratio',
    '解锁比例': 'Unlock Ratio',
    '不透明度': 'Opacity',
    '更改颜色': 'Change Color',
    '边距': 'Margin',
    '间距': 'Spacing',
    '尺寸': 'Size',
}

def translate_file(filepath):
    """Read file, replace Chinese strings, write back."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"  SKIP (read error): {filepath}: {e}")
        return 0

    original = content
    count = 0

    # Sort by length descending to avoid partial replacements
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
        else:
            print(f"  · {f} (no changes)")
    print(f"\nTotal: {total} translation keys applied across {len(files)} files")

if __name__ == '__main__':
    main()
