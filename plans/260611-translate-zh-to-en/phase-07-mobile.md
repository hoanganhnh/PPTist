---
phase: 7
title: "Mobile Views"
status: pending
priority: P2
effort: "1.5h"
dependencies: [1]
---

# Phase 7: Mobile Views

## Overview
Translate all mobile-specific views: MobileEditor (Header, ElementToolbar, SlideToolbar), MobilePreview, MobileThumbnails, and MobilePlayer.

## Related Code Files
- Modify: `src/views/Mobile/MobileEditor/Header.vue` — Mobile editor header labels
- Modify: `src/views/Mobile/MobileEditor/ElementToolbar.vue` — Element editing toolbar labels (text formatting, shape, image, etc.)
- Modify: `src/views/Mobile/MobileEditor/SlideToolbar.vue` — Slide management toolbar labels
- Modify: `src/views/Mobile/MobilePreview.vue` — Preview mode labels
- Modify: `src/views/Mobile/MobileThumbnails.vue` — Thumbnail list labels
- Modify: `src/views/Mobile/MobilePlayer.vue` — Mobile presentation player labels

## Implementation Steps
1. Translate `Header.vue` — mobile editor header actions
2. Translate `ElementToolbar.vue` — element editing options
3. Translate `SlideToolbar.vue` — slide management buttons
4. Translate `MobilePreview.vue` — preview mode text
5. Translate `MobileThumbnails.vue` — thumbnail labels
6. Translate `MobilePlayer.vue` — player controls

## Success Criteria
- [ ] Mobile editor header shows English labels
- [ ] Mobile toolbar buttons display English text
- [ ] Mobile preview and player show English controls

## Risk Assessment
- Mobile views typically mirror desktop labels — ensure consistency with Phase 3-5 translations
