---
phase: 2
title: "Core Components & Layout"
status: pending
priority: P1
effort: "2h"
dependencies: []
---

# Phase 2: Core Components & Layout

## Overview
Translate root application layout, reusable UI components (ColorPicker, Select, Slider, WritingBoard, LaTeXEditor, OutlineEditor, ChartDataEditor), and the main App.vue entry point.

## Requirements
- Functional: All component labels, tooltips, placeholders, error messages, and button text display in English
- Non-functional: Component API and prop interfaces remain unchanged

## Related Code Files
- Modify: `index.html` — `lang="zh-CN"` → `lang="en"`, title, meta description, loading text
- Modify: `src/App.vue` — Loading state text, any Chinese labels
- Modify: `src/components/ColorPicker/index.vue` — Color picker labels
- Modify: `src/components/Select.vue` — Placeholder/empty state text
- Modify: `src/components/Slider.vue` — Any tooltip text
- Modify: `src/components/WritingBoard.vue` — Tool labels
- Modify: `src/components/LaTeXEditor/index.vue` — Tab labels (常用符号→Symbols, 预置公式→Formulas), error messages, buttons
- Modify: `src/components/OutlineEditor.vue` — Context menu items (添加章→Add Chapter, etc.)
- Modify: `src/components/ChartDataEditor.vue` — Category/series default labels, chart type display, buttons (确定→Confirm, 关闭→Close)

## Implementation Steps
1. Update `index.html`: `lang`, `<title>`, `<meta>` description/keywords, loading text
2. Translate `src/App.vue` loading state
3. Translate `src/components/LaTeXEditor/index.vue` tabs, buttons, messages
4. Translate `src/components/OutlineEditor.vue` context menus, default values
5. Translate `src/components/ChartDataEditor.vue` labels, buttons
6. Check remaining components for any Chinese text
7. Translate `src/components/WritingBoard.vue` if it has UI text

## Success Criteria
- [ ] `index.html` fully in English
- [ ] App loading screen shows English text
- [ ] LaTeX editor dialog shows English tabs, buttons, and error messages
- [ ] Chart data editor shows English category names and buttons
- [ ] Outline editor context menu shows English actions

## Risk Assessment
- Changing `index.html` `lang` attribute affects browser locale detection — verify no code reads `document.documentElement.lang`
