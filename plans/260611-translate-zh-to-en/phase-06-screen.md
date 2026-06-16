---
phase: 6
title: "Screen & Presentation Views"
status: pending
priority: P2
effort: "2h"
dependencies: [1]
---

# Phase 6: Screen & Presentation Views

## Overview
Translate all slideshow/presentation views: BaseView (main player toolbar), PresenterView (speaker notes), AudienceView, CountdownTimer, WritingBoardTool, ScreenElement, and playback hooks.

## Related Code Files
- Modify: `src/views/Screen/index.vue` — Screen mode entry labels
- Modify: `src/views/Screen/BaseView.vue` — 25 lines: player toolbar (幻灯片→Slide, 画笔→Pen, 结束放映→End Show, etc.)
- Modify: `src/views/Screen/PresenterView.vue` — Presenter notes header (演讲者备注→Presenter Notes)
- Modify: `src/views/Screen/AudienceView.vue` — Audience view labels
- Modify: `src/views/Screen/CountdownTimer.vue` — Timer labels
- Modify: `src/views/Screen/WritingBoardTool.vue` — Writing tool tooltips (画笔→Pen, 荧光笔→Highlighter, 橡皮擦→Eraser, etc.)
- Modify: `src/views/Screen/ScreenElement.vue` — Screen element labels
- Modify: `src/views/Screen/hooks/useExecPlay.ts` — 34 lines: first/last slide messages (已经是第一页了→Already the first slide, etc.)
- Modify: `src/views/Screen/hooks/useFullscreen.ts` — Fullscreen error/status messages
- Modify: `src/views/Screen/hooks/useSlideSize.ts` — Size calculation labels

## Implementation Steps
1. Translate `BaseView.vue` — slide navigation toolbar, page counter
2. Translate `PresenterView.vue` — speaker notes header/labels
3. Translate `WritingBoardTool.vue` — drawing tool tooltips
4. Translate `CountdownTimer.vue` — timer display text
5. Translate `AudienceView.vue` — audience mode labels
6. Translate `ScreenElement.vue` — element rendering labels
7. Translate `Screen/index.vue` — mode selection labels
8. Translate `hooks/useExecPlay.ts` — playback boundary messages
9. Translate `hooks/useFullscreen.ts` — fullscreen notifications
10. Check `hooks/useSlideSize.ts` for any Chinese

## Success Criteria
- [ ] Presentation mode toolbar shows English labels
- [ ] "Already the first/last slide" messages display in English
- [ ] Presenter notes panel header shows "Presenter Notes"
- [ ] Writing board tool tooltips are in English
- [ ] Countdown timer text is in English

## Risk Assessment
- Screen mode is a separate view with its own state — ensure translations don't affect BroadcastChannel message types
