---
phase: 3
title: "Editor Toolbar Panels"
status: pending
priority: P1
effort: "4h"
dependencies: [1]
---

# Phase 3: Editor Toolbar Panels

## Overview
Translate all toolbar panels in the Editor view: style panels for each element type, position panel, animation panel, slide design panel, multi-select panels, and shared toolbar components (RichTextBase, ElementShadow, ElementFilter, ElementOutline, ElementFlip, ElementOpacity).

## Requirements
- Functional: All toolbar panel labels, section titles, dropdown options, slider labels, and toggle buttons display in English
- Non-functional: Panel layout and functionality unchanged

## Related Code Files
- Modify: `src/views/Editor/Toolbar/index.vue` — Tab labels (样式→Style, 位置→Position, 动画→Animation, 设计→Design, 切换→Transitions)
- Modify: `src/views/Editor/Toolbar/ElementStylePanel/TextStylePanel.vue` — Preset styles (大标题→Heading 1), line height, spacing, padding labels
- Modify: `src/views/Editor/Toolbar/ElementStylePanel/ShapeStylePanel.vue` — Fill, border, flip labels (26 lines)
- Modify: `src/views/Editor/Toolbar/ElementStylePanel/ImageStylePanel.vue` — Border, radius, mask labels
- Modify: `src/views/Editor/Toolbar/ElementStylePanel/LineStylePanel.vue` — Line color, style, endpoints
- Modify: `src/views/Editor/Toolbar/ElementStylePanel/TableStylePanel.vue` — 35 lines: table cell, border, merge labels
- Modify: `src/views/Editor/Toolbar/ElementStylePanel/ChartStylePanel/index.vue` — Chart style labels
- Modify: `src/views/Editor/Toolbar/ElementStylePanel/ChartStylePanel/ThemeColorsSetting.vue` — Theme color labels
- Modify: `src/views/Editor/Toolbar/ElementStylePanel/VideoStylePanel.vue` — Video controls
- Modify: `src/views/Editor/Toolbar/ElementStylePanel/AudioStylePanel.vue` — Audio controls
- Modify: `src/views/Editor/Toolbar/ElementStylePanel/LatexStylePanel.vue` — LaTeX panel labels
- Modify: `src/views/Editor/Toolbar/ElementPositionPanel.vue` — 23 lines: position, size, rotation, alignment labels
- Modify: `src/views/Editor/Toolbar/ElementAnimationPanel.vue` — 25 lines: animation type/trigger/duration labels
- Modify: `src/views/Editor/Toolbar/SlideDesignPanel/index.vue` — 48 lines: background fill, canvas size, preset themes
- Modify: `src/views/Editor/Toolbar/SlideDesignPanel/ThemeColorsSetting.vue` — Color setting labels
- Modify: `src/views/Editor/Toolbar/SlideDesignPanel/ThemeStylesExtract.vue` — Style extraction labels
- Modify: `src/views/Editor/Toolbar/SlideAnimationPanel.vue` — Slide transition labels
- Modify: `src/views/Editor/Toolbar/MultiStylePanel.vue` — Multi-select fill/outline labels
- Modify: `src/views/Editor/Toolbar/MultiPositionPanel.vue` — Multi-select position labels
- Modify: `src/views/Editor/Toolbar/common/RichTextBase.vue` — 37 lines: text formatting toolbar labels
- Modify: `src/views/Editor/Toolbar/common/ElementShadow.vue` — Shadow settings labels
- Modify: `src/views/Editor/Toolbar/common/ElementFilter.vue` — 21 lines: filter/effect labels
- Modify: `src/views/Editor/Toolbar/common/ElementOutline.vue` — Outline settings labels
- Modify: `src/views/Editor/Toolbar/common/ElementFlip.vue` — Flip direction labels
- Modify: `src/views/Editor/Toolbar/common/ElementOpacity.vue` — Opacity label

## Implementation Steps
1. Translate `index.vue` tab labels
2. Translate all ElementStylePanel sub-panels (Text, Shape, Image, Line, Table, Chart, Video, Audio, LaTeX)
3. Translate ElementPositionPanel alignment and size labels
4. Translate ElementAnimationPanel trigger/duration/type labels
5. Translate SlideDesignPanel background, canvas size, and theme labels
6. Translate SlideAnimationPanel transition labels
7. Translate Multi-select panels (Style + Position)
8. Translate all `common/` toolbar component labels (RichTextBase, Shadow, Filter, Outline, Flip, Opacity)

## Success Criteria
- [ ] All toolbar tabs show English labels
- [ ] Text formatting toolbar shows English tooltips (Bold, Italic, etc.)
- [ ] Position panel shows English labels (X, Y, Width, Height, Rotation)
- [ ] Animation panel shows English effect names and controls
- [ ] Slide design panel shows English theme names and background options
- [ ] All dropdowns in style panels show English options

## Risk Assessment
- RichTextBase has 37 Chinese lines — largest single toolbar component; careful line-by-line translation needed
- Table style panel has complex merge/split labels — verify they match UI layout
