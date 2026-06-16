---
phase: 4
title: "Canvas & Element Layers"
status: pending
priority: P1
effort: "3h"
dependencies: [1]
---

# Phase 4: Canvas & Element Layers

## Overview
Translate the main editor canvas, element floating layers (toolbar, link handler), editable element components, canvas operation hooks, and the link dialog.

## Related Code Files
- Modify: `src/views/Editor/Canvas/index.vue` — 26 lines: context menus (粘贴→Paste, 全选→Select All, etc.)
- Modify: `src/views/Editor/Canvas/EditableElement.vue` — 25 lines: element context menus (复制→Copy, 锁定→Lock, etc.)
- Modify: `src/views/Editor/Canvas/LinkDialog.vue` — Link dialog labels (网页链接→Web Link, 幻灯片→Slide)
- Modify: `src/views/Editor/Canvas/AlignmentLine.vue` — Any tooltip text
- Modify: `src/views/Editor/Canvas/GridLines.vue` — Any label text
- Modify: `src/views/Editor/Canvas/ElementCreateSelection.vue` — Creation feedback text
- Modify: `src/views/Editor/Canvas/ShapeCreateCanvas.vue` — Shape creation labels
- Modify: `src/views/Editor/Canvas/Operate/MultiSelectOperate.vue` — Multi-select operation labels
- Modify: `src/views/Editor/Canvas/ElementFloatLayer/FloatingToolbar/TextStyleControls.vue` — Bold/Italic/Underline tooltips
- Modify: `src/views/Editor/Canvas/ElementFloatLayer/FloatingToolbar/TableToolbar.vue` — Table operation labels
- Modify: `src/views/Editor/Canvas/ElementFloatLayer/FloatingToolbar/ChartToolbar.vue` — Chart editing labels
- Modify: `src/views/Editor/Canvas/ElementFloatLayer/FloatingToolbar/ShapeToolbar.vue` — Shape editing labels
- Modify: `src/views/Editor/Canvas/ElementFloatLayer/FloatingToolbar/LineToolbar.vue` — Line editing labels
- Modify: `src/views/Editor/Canvas/ElementFloatLayer/FloatingToolbar/ImageToolbar.vue` — Image editing labels
- Modify: `src/views/Editor/Canvas/ElementFloatLayer/FloatingToolbar/LatexToolbar.vue` — LaTeX editing labels
- Modify: `src/views/Editor/Canvas/ElementFloatLayer/FloatingToolbar/BorderPanel.vue` — Border settings labels
- Modify: `src/views/Editor/Canvas/ElementFloatLayer/LinkHandler.vue` — Link display labels (幻灯片页面→Slide Page)
- Modify: `src/views/Editor/Canvas/hooks/useScaleElement.ts` — 39 lines: scale operation feedback
- Modify: `src/views/Editor/Canvas/hooks/useCommonOperate.ts` — Common operation labels
- Modify: `src/views/Editor/Canvas/hooks/useSelectElement.ts` — Selection messages
- Modify: `src/views/Editor/Canvas/hooks/useDragElement.ts` — 26 lines: drag operation messages
- Modify: `src/views/Editor/Canvas/hooks/useDragLineElement.ts` — Line drag labels
- Modify: `src/views/Editor/Canvas/hooks/useRotateElement.ts` — Rotation labels
- Modify: `src/views/Editor/Canvas/hooks/useInsertFromCreateSelection.ts` — Insert feedback
- Modify: `src/views/Editor/Canvas/hooks/useDrop.ts` — Drop operation messages
- Modify: `src/views/Editor/Canvas/hooks/useViewportSize.ts` — Viewport labels
- Modify: `src/views/Editor/Canvas/hooks/useMouseSelection.ts` — Selection labels

## Implementation Steps
1. Translate `Canvas/index.vue` right-click context menus
2. Translate `EditableElement.vue` element context menus
3. Translate `LinkDialog.vue` dialog labels, selects, buttons
4. Translate all FloatingToolbar sub-components (8 files)
5. Translate `LinkHandler.vue` link display labels
6. Translate all Canvas hooks (10 files) — comments and error messages
7. Check remaining canvas components (AlignmentLine, GridLines, etc.)

## Success Criteria
- [ ] Right-click context menus on canvas show English text
- [ ] Element right-click menus show English text
- [ ] Floating toolbar tooltips are in English
- [ ] Link dialog shows English labels and validation messages
- [ ] No Chinese in canvas hook files

## Risk Assessment
- Context menu items must match hotkey documentation translations from Phase 1
- Canvas hooks contain both comments and error messages — distinguish carefully
