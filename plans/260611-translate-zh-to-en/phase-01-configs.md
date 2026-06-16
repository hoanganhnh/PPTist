---
phase: 1
title: "Config Files & Types"
status: pending
priority: P1
effort: "2h"
dependencies: []
---

# Phase 1: Config Files & Types

## Overview
Translate all configuration files that define dropdown options, preset names, animation labels, shape categories, chart types, hotkey documentation, font names, symbol categories, and LaTeX formula labels. Also translate type definition comments in `slides.ts`.

## Requirements
- Functional: All config-driven dropdown menus, tooltips, and labels display English text
- Non-functional: No changes to config keys/values that affect logic — only user-facing `label`/`name`/`type` display strings

## Related Code Files
- Modify: `src/configs/element.ts` — Element type display names (文本→Text, 图片→Image, etc.)
- Modify: `src/configs/font.ts` — Font display labels (思源黑体→Source Han Sans, etc.)
- Modify: `src/configs/lines.ts` — Line category names (直线→Straight Line, 折线→Polyline, 曲线→Curve)
- Modify: `src/configs/shapes.ts` — Shape group types (矩形→Rectangle, 常用形状→Common Shapes, etc.)
- Modify: `src/configs/chart.ts` — Chart type map (柱状图→Column Chart, etc.) + default series/category labels
- Modify: `src/configs/animation.ts` — 122 lines: entry/exit/emphasis animation names and categories
- Modify: `src/configs/hotkey.ts` — 75 lines: keyboard shortcut documentation labels
- Modify: `src/configs/latex.ts` — Formula names (高斯公式→Gauss Formula) + symbol category labels
- Modify: `src/configs/symbol.ts` — Symbol category labels (字母→Letters, etc.)
- Modify: `src/configs/imageClip.ts` — Clip-path shape names (矩形→Rectangle, etc.)
- Modify: `src/configs/mime.ts` — Check for any Chinese labels
- Modify: `src/types/slides.ts` — 197 lines of Chinese comments → translate to English
- Modify: `src/store/slides.ts` — Default presentation title (未命名演示文稿→Untitled Presentation)
- Modify: `src/store/main.ts` — 32 lines with Chinese (context menu labels, tooltips)
- Modify: `src/store/screen.ts` — Any Chinese labels
- Modify: `src/store/keyboard.ts` — Any Chinese labels
- Modify: `src/store/snapshot.ts` — Any Chinese labels

## Implementation Steps
1. Translate `src/configs/element.ts` ELEMENT_TYPE_ZH values
2. Translate `src/configs/font.ts` FONTS labels (keep `value` unchanged)
3. Translate `src/configs/lines.ts` LINE_LIST type names
4. Translate `src/configs/shapes.ts` SHAPE_LIST type categories
5. Translate `src/configs/chart.ts` CHART_TYPE_MAP + default data labels
6. Translate `src/configs/animation.ts` all animation category and effect names
7. Translate `src/configs/hotkey.ts` HOTKEY_DOC entries
8. Translate `src/configs/latex.ts` formula names + symbol category labels
9. Translate `src/configs/symbol.ts` category labels
10. Translate `src/configs/imageClip.ts` CLIPPATHS name properties
11. Check `src/configs/mime.ts` for any Chinese
12. Translate `src/types/slides.ts` comments
13. Translate `src/store/slides.ts` default title + template info
14. Translate `src/store/main.ts` Chinese strings
15. Check remaining store files

## Success Criteria
- [ ] All config dropdown labels render in English
- [ ] Font selector shows English font names
- [ ] Shape/line/animation panels show English category names
- [ ] Hotkey documentation renders in English
- [ ] No Chinese in config/store TS files (excluding `value` font-family strings)

## Risk Assessment
- Font label changes are display-only; `value` stays the same so rendering is unaffected
- Animation CSS class names are separate from display labels — safe to translate
