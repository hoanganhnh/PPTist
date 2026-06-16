---
title: "Thumbnail Sidebar UI/UX Polish"
description: "Improve left sidebar thumbnail-container with incremental hover interactions, refined active/selected states, smooth transitions, and overall visual feel."
status: complete
priority: P2
effort: 0.5d
branch: "feature/thumbnail-sidebar-ux"
tags: [ui, ux, css, polish]
created: "2026-06-16T09:08:00.000Z"
createdBy: "ck:cook"
source: skill
---

# Thumbnail Sidebar UI/UX Polish

## Overview

Improve the left sidebar `.thumbnail-container` in the slides editor with progressive hover interactions, smoother transitions, refined active/selected visual states, and overall sidebar visual quality. Pure CSS/SCSS changes — no logic or template changes required.

## Requirements

1. **Progressive hover on thumbnail items**: Container bg highlight → thumbnail outline glow → subtle lift/shadow
2. **Refined active/selected states**: Stronger visual distinction with left accent bar, smoother outline, background tint
3. **Smooth transitions**: All interactive state changes animated with existing `$transitionDelay` vars
4. **Slide number label polish**: Improved hover/active color transitions
5. **Add Slide button polish**: Better hover feedback with transition
6. **Page number footer**: Subtle visual refinement
7. **Overall spacing/padding consistency**

## Current State Analysis

| Element | Current | Problem |
|---------|---------|---------|
| `.thumbnail-item` hover | None | No visual feedback on mouseover |
| `.thumbnail-item.active` | Outline color + label color | Flat, no depth distinction |
| `.thumbnail-item.selected` | Same outline as active | Hard to distinguish from active |
| `.label` | Static color, cursor grab | No hover color transition |
| `.add-slide .btn` hover | Background only | No transition animation |
| Transitions | None on most elements | Abrupt state changes |

## Design Decisions

1. **Follow existing convention**: Templates.vue already uses `outline-color`, `opacity`, `$transitionDelay` pattern — mirror it.
2. **No template changes**: Pure `<style>` edits to avoid regression risk.
3. **No new SCSS variables**: Use existing `$themeColor`, `$borderColor`, `$lightGray`, `$transitionDelay`, `$boxShadow`.
4. **Progressive feedback model**: Hover bg → hover outline → active accent — incremental visual escalation.

## Acceptance Criteria

- [ ] Hovering `.thumbnail-item` shows subtle background tint + thumbnail outline color shift
- [ ] Active thumbnail has left accent indicator + stronger outline + slight bg tint
- [ ] Selected thumbnails visually distinct from active (different bg tint)
- [ ] All state transitions use `$transitionDelay` (0.2s) for smoothness
- [ ] Label number transitions color on hover/active states
- [ ] Add Slide button has smooth hover transition
- [ ] Note flag has hover scale effect
- [ ] No template/script changes — pure SCSS
- [ ] No regressions: drag-and-drop, context menus, section editing all still work

## Scope Boundary

**OUT of scope:**
- Template/script changes
- New components or HTML structure
- Adding action overlay buttons (duplicate/delete) — separate task
- Dark mode
- Sidebar resize handle
- Thumbnail size changes

## Touchpoints

| File | Change Type |
|------|-------------|
| `src/views/Editor/Thumbnails/index.vue` `<style>` block | Primary — all SCSS changes |
| `src/assets/styles/variable.scss` | Read-only reference for existing vars |

## Implementation

### Single Phase — SCSS Polish

**File**: `src/views/Editor/Thumbnails/index.vue` lines 366-541 (`<style>` block)

Changes:

1. **`.thumbnail-item`** — Add hover state:
   ```scss
   &:hover {
     background-color: rgba($color: $themeColor, $alpha: .04);

     .thumbnail {
       outline-color: rgba($color: $themeColor, $alpha: .45);
     }

     .label {
       color: #666;
     }
   }
   ```

2. **`.thumbnail-item`** — Add transitions to base state:
   ```scss
   transition: background-color $transitionDelay;

   .thumbnail {
     transition: outline-color $transitionDelay, box-shadow $transitionDelay;
   }
   ```

3. **`.thumbnail-item.active`** — Enhanced with left accent + bg tint:
   ```scss
   &.active {
     background-color: rgba($color: $themeColor, $alpha: .06);

     &::before {
       content: '';
       position: absolute;
       left: 0;
       top: 8px;
       bottom: 8px;
       width: 3px;
       border-radius: 0 2px 2px 0;
       background-color: $themeColor;
     }

     .thumbnail {
       box-shadow: 0 1px 4px rgba($color: $themeColor, $alpha: .18);
     }
   }
   ```

4. **`.thumbnail-item.selected`** — Distinct from active:
   ```scss
   &.selected {
     background-color: rgba($color: $themeColor, $alpha: .04);
   }
   ```

5. **`.label`** — Add transition:
   ```scss
   transition: color $transitionDelay;
   ```

6. **`.add-slide .btn` and `.select-btn`** — Add transition:
   ```scss
   transition: background-color $transitionDelay;
   ```

7. **`.note-flag`** — Add hover scale:
   ```scss
   transition: transform $transitionDelayFast;

   &:hover {
     transform: scale(1.15);
   }
   ```

8. **`.section-title`** — Subtle hover:
   ```scss
   transition: color $transitionDelay;

   &:hover {
     color: #333;
   }
   ```

## Validation Commands

- `npm run type-check` — no type regressions
- `npm run build-only` — successful build
- Manual: hover thumbnails, verify smooth transitions and progressive feedback
- Manual: verify drag-and-drop still works
- Manual: verify context menus still appear
- Manual: verify section editing still works

## Success Criteria

- Sidebar feels alive and responsive on hover
- Clear visual hierarchy: default → hover → selected → active
- Smooth transitions on all state changes
- Zero logic/behavior regressions
