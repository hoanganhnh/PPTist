---
phase: 5
title: "Side Panels & Dialogs"
status: pending
priority: P2
effort: "2h"
dependencies: [1]
---

# Phase 5: Side Panels & Dialogs

## Overview
Translate all side panels (Search, Symbol, Remark, Markup), the Editor Header menu, AI PPT dialog, Export dialog, Thumbnails panel, and the CanvasTool toolbar.

## Related Code Files
- Modify: `src/views/Editor/SearchPanel.vue` — Find/Replace tab labels, placeholders, buttons
- Modify: `src/views/Editor/SymbolPanel.vue` — Emoji category labels (表情→Smileys, etc.)
- Modify: `src/views/Editor/MarkupPanel.vue` — 26 lines: slide type annotations, remark labels
- Modify: `src/views/Editor/Remark/Editor.vue` — Remark editor labels
- Modify: `src/views/Editor/EditorHeader/index.vue` — Main menu items (新建→New, 导入→Import, 导出→Export, etc.), toolbar buttons
- Modify: `src/views/Editor/AIPPTDialog.vue` — 44 lines: AI PPT generation dialog labels
- Modify: `src/views/Editor/ExportDialog/ExportSpecificFile.vue` — Export format options
- Modify: `src/views/Editor/Thumbnails/Templates.vue` — Template gallery labels
- Modify: `src/views/Editor/Thumbnails/index.vue` — 33 lines: thumbnail context menus, page labels
- Modify: `src/views/Editor/CanvasTool/index.vue` — 45 lines: canvas toolbar (文本框→Text Box, 形状→Shape, etc.)
- Modify: `src/views/Editor/CanvasTool/MediaInput.vue` — Media input labels
- Modify: `src/views/Editor/CanvasTool/TableGenerator.vue` — Table generator labels

## Implementation Steps
1. Translate `EditorHeader/index.vue` — main menu, file operations, toolbar buttons
2. Translate `CanvasTool/index.vue` — insert element toolbar buttons and tooltips
3. Translate `CanvasTool/MediaInput.vue` and `TableGenerator.vue`
4. Translate `SearchPanel.vue` — Find/Replace tabs, buttons
5. Translate `SymbolPanel.vue` — emoji categories
6. Translate `MarkupPanel.vue` — slide type options
7. Translate `Remark/Editor.vue` — remark editing labels
8. Translate `AIPPTDialog.vue` — AI generation labels
9. Translate `ExportDialog/ExportSpecificFile.vue` — export options
10. Translate `Thumbnails/index.vue` — context menus, page counter
11. Translate `Thumbnails/Templates.vue` — template labels

## Success Criteria
- [ ] Editor header menu shows English items (New, Import, Export, etc.)
- [ ] Canvas toolbar shows English element insertion labels
- [ ] Search panel shows English Find/Replace labels
- [ ] AI PPT dialog shows English labels
- [ ] Thumbnail context menus show English text

## Risk Assessment
- AIPPTDialog has 44 Chinese lines — verify AI-related prompts/labels translate correctly
- EditorHeader contains file operation labels that must match keyboard shortcut docs
