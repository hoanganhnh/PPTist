---
phase: 8
title: "Hooks & Utilities"
status: pending
priority: P1
effort: "3h"
dependencies: [1]
---

# Phase 8: Hooks & Utilities

## Overview
Translate all composable hooks (25 files) and utility modules (12 files) that contain Chinese error messages, validation warnings, notification text, clipboard messages, and code comments.

## Related Code Files

### Hooks (25 files)
- Modify: `src/hooks/useExport.ts` — 21 lines: export error messages, default font face (微软雅黑→Microsoft YaHei), chart series labels
- Modify: `src/hooks/useImport.ts` — 21 lines: file parsing errors, chart coordinate labels
- Modify: `src/hooks/useSearch.ts` — Search validation warnings (请先输入查找内容→Please enter a search term, 未查找到匹配项→No matches found)
- Modify: `src/hooks/useLink.ts` — Link validation messages (不是正确的网页链接地址→Invalid web link address)
- Modify: `src/hooks/useCreateElement.ts` — 23 lines: element creation labels/messages
- Modify: `src/hooks/useSlideHandler.ts` — Slide operation messages
- Modify: `src/hooks/useCopyAndPasteElement.ts` — Copy/paste messages
- Modify: `src/hooks/usePasteEvent.ts` — Paste event messages
- Modify: `src/hooks/usePasteTextClipboardData.ts` — Clipboard parsing messages
- Modify: `src/hooks/usePasteDataTransfer.ts` — Data transfer messages
- Modify: `src/hooks/useSelectElement.ts` — Selection messages
- Modify: `src/hooks/useDeleteElement.ts` — Delete confirmation messages
- Modify: `src/hooks/useLockElement.ts` — Lock/unlock messages
- Modify: `src/hooks/useOrderElement.ts` — 39 lines: layer ordering labels (置于顶层→Bring to Front, etc.)
- Modify: `src/hooks/useAlignElementToCanvas.ts` — Alignment operation labels
- Modify: `src/hooks/useAlignActiveElement.ts` — Active element alignment labels
- Modify: `src/hooks/useUniformDisplayElement.ts` — Uniform distribution labels
- Modify: `src/hooks/useCombineElement.ts` — Group/ungroup messages
- Modify: `src/hooks/useHistorySnapshot.ts` — History operation labels
- Modify: `src/hooks/useSlideTheme.ts` — Theme application messages
- Modify: `src/hooks/useSlideBackgroundStyle.ts` — Background style labels
- Modify: `src/hooks/useAddSlidesOrElements.ts` — Add slide/element messages
- Modify: `src/hooks/useMoveElement.ts` — Move operation labels
- Modify: `src/hooks/useScreening.ts` — Screen mode messages
- Modify: `src/hooks/useScaleCanvas.ts` — Canvas zoom labels

### Utilities (12 files)
- Modify: `src/utils/clipboard.ts` — Clipboard error messages (剪贴板为空→Clipboard is empty)
- Modify: `src/utils/element.ts` — 76 lines: element manipulation labels/comments
- Modify: `src/utils/fullscreen.ts` — Fullscreen error messages
- Modify: `src/utils/common.ts` — Common utility messages
- Modify: `src/utils/database.ts` — Database operation messages
- Modify: `src/utils/selection.ts` — Selection utility labels
- Modify: `src/utils/image.ts` — Image processing messages
- Modify: `src/utils/crypto.ts` — Crypto utility messages
- Modify: `src/utils/textParser.ts` — Text parsing labels
- Modify: `src/utils/htmlParser/index.ts` — HTML parsing labels
- Modify: `src/utils/svgPathParser.ts` — SVG path labels
- Modify: `src/utils/svg2Base64.ts` — SVG conversion messages

### Services (2 files)
- Modify: `src/services/axios.ts` — API error messages (未知的请求错误→Unknown request error, 网络异常→Network error)
- Modify: `src/services/fetch.ts` — Fetch error messages

### Directive (1 file)
- Modify: `src/directive/contextmenu.ts` — Context menu labels

## Implementation Steps
1. Translate all hooks with user-facing messages (useExport, useImport, useSearch, useLink)
2. Translate element operation hooks (useCreateElement, useOrderElement, useCopyAndPaste, etc.)
3. Translate slide management hooks (useSlideHandler, useSlideTheme, etc.)
4. Translate utility modules (clipboard, element, fullscreen, common)
5. Translate service layer error messages (axios, fetch)
6. Translate contextmenu directive
7. Review all remaining hooks for Chinese comments that should be translated

## Success Criteria
- [ ] All user-facing error messages in hooks display in English
- [ ] Clipboard error messages are in English
- [ ] API error notifications are in English
- [ ] No Chinese strings in utility files (excluding font-family values)
- [ ] `useExport.ts` uses 'Microsoft YaHei' instead of '微软雅黑'

## Risk Assessment
- `useExport.ts` and `useImport.ts` are the most complex — contain deeply embedded Chinese in template literals
- `src/utils/element.ts` has 76 Chinese lines — many may be comments vs. actual error messages
- Font face name change ('微软雅黑' → 'Microsoft YaHei') must use the exact Windows font name
