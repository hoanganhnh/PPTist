---
phase: 9
title: "Mock Data & Static Assets"
status: pending
priority: P3
effort: "2h"
dependencies: []
---

# Phase 9: Mock Data & Static Assets

## Overview
Translate Chinese text in mock JSON data files, AI PPT outline, and element component templates.

## Related Code Files
- Modify: `public/mocks/slides.json` — Default presentation slide text content
- Modify: `public/mocks/template_1.json` through `template_8.json` — Template slide content
- Modify: `public/mocks/AIPPT.json` — AI-generated PPT mock data
- Modify: `public/mocks/AIPPT_Outline.md` — AI PPT outline markdown
- Modify: `src/views/components/element/TableElement/index.vue` — Table element labels
- Modify: `src/views/components/element/TableElement/CustomTextarea.vue` — Textarea labels
- Modify: `src/views/components/element/TableElement/EditableTable.vue` — 52 lines: table editing labels
- Modify: `src/views/components/element/TableElement/useHideCells.ts` — Cell visibility labels
- Modify: `src/views/components/element/TableElement/useSubThemeColor.ts` — Theme color labels
- Modify: `src/views/components/element/TableElement/utils.ts` — Table utility labels
- Modify: `src/views/components/element/VideoElement/VideoPlayer/index.vue` — Video player labels
- Modify: `src/views/components/element/TextElement/index.vue` — Text element labels
- Modify: `src/views/components/element/AudioElement/AudioPlayer.vue` — Audio player labels
- Modify: `src/views/components/element/ImageElement/ImageClipHandler.vue` — Image clip labels
- Modify: `src/views/components/element/ProsemirrorEditor.vue` — Rich text editor labels
- Modify: `src/views/components/element/hooks/useElementFill.ts` — Fill hook labels
- Modify: `src/views/components/element/hooks/useElementFlip.ts` — Flip hook labels
- Modify: `src/views/components/element/hooks/useElementOutline.ts` — Outline hook labels
- Modify: `src/views/components/element/hooks/useElementShadow.ts` — Shadow hook labels
- Modify: `src/views/components/ThumbnailSlide/index.vue` — Thumbnail labels

## Success Criteria
- [ ] Default presentation loads with English text
- [ ] All templates display English content
- [ ] Table/video/audio element components show English labels
