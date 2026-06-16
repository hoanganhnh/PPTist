---
title: "Translate PPTist from Chinese to English"
status: in-progress
created: 2026-06-11
scope: project
phases: 10
blockedBy: []
blocks: []
---

# Translate PPTist from Chinese to English

## Overview

Translate all user-facing Chinese (`zh-CN`) text in the PPTist Vue.js presentation editor to English (`en-US`). The project has **no i18n framework** — all text is hardcoded directly in Vue SFC templates, TypeScript configs, hooks, utilities, and JSON mock data.

## Scope Summary

| Area | Files | Chinese Lines (approx.) |
|------|-------|------------------------|
| `src/configs/` | 11 | ~480 |
| `src/views/` | 105 | ~750 |
| `src/hooks/` | 25 | ~200 |
| `src/utils/` | 12 | ~120 |
| `src/components/` | 7 | ~100 |
| `src/store/` | 5 | ~50 |
| `src/services/` | 2 | ~20 |
| `src/types/` | 1 | ~197 (comments only) |
| `src/directive/` | 1 | ~10 |
| `src/App.vue` | 1 | ~5 |
| `index.html` | 1 | ~5 |
| `public/mocks/` | 11 | ~500+ |
| **Total** | **~182** | **~2,119+ code lines** |

## Approach

- **Direct replacement** — no i18n framework. Replace hardcoded Chinese strings with English equivalents inline.
- **Comments** — Translate or keep as-is based on context. Type definition comments in `slides.ts` will be translated for developer clarity.
- **Mock data** — Template JSON files and AI PPT mock data contain Chinese content in slide text elements; translate for English demo experience.
- **Font names** — Chinese font display labels (e.g. `思源黑体`) will be transliterated to their English/romanized equivalents (e.g. `Source Han Sans`).

## Phases

| # | Phase | Priority | Effort | Status |
|---|-------|----------|--------|--------|
| 1 | [Config Files & Types](phase-01-configs.md) | P1 | 2h | pending |
| 2 | [Core Components & Layout](phase-02-components.md) | P1 | 2h | pending |
| 3 | [Editor Toolbar Panels](phase-03-toolbar.md) | P1 | 4h | pending |
| 4 | [Canvas & Element Layers](phase-04-canvas.md) | P1 | 3h | pending |
| 5 | [Side Panels & Dialogs](phase-05-panels.md) | P2 | 2h | pending |
| 6 | [Screen & Presentation Views](phase-06-screen.md) | P2 | 2h | pending |
| 7 | [Mobile Views](phase-07-mobile.md) | P2 | 1.5h | pending |
| 8 | [Hooks & Utilities](phase-08-hooks-utils.md) | P1 | 3h | pending |
| 9 | [Mock Data & Static Assets](phase-09-mocks.md) | P3 | 2h | pending |
| 10 | [Verification & Cleanup](phase-10-verification.md) | P1 | 1h | pending |

## Success Criteria

- [ ] `grep -rlP '[\x{4e00}-\x{9fa5}]' src/` returns 0 non-comment matches in `.ts`, `.tsx`, `.vue` files
- [ ] `index.html` contains no Chinese text
- [ ] Application builds successfully (`npm run build`)
- [ ] All existing tests pass
- [ ] UI renders correctly in browser with English labels
- [ ] Mock presentation data renders English content

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Missed strings in deeply nested templates | Medium | Low | Automated grep verification in Phase 10 |
| Translation breaks layout (text overflow) | Low | Medium | Visual QA pass; CSS `text-overflow` already handles most |
| Font name changes break rendering | Low | High | Only change `label` display name, not `value` font-family |
| Mock JSON has nested Chinese in rich text | Medium | Medium | Parse slide element `content` fields carefully |
