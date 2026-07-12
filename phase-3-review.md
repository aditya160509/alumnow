# Phase 3 — Browse & Discovery: Code Review

**Score: 10/10**

## Fix Status

### CRITICAL
- [x] C1. browse/page.tsx: No React Query — raw useState/useEffect causes race conditions, no caching, no `keepPreviousData`, no cache invalidation on save/unsave
- [x] C2. browse/page.tsx: `getFilterOptions()` in useEffect has no `.catch()` — silent failure if API errors
- [x] C3. browse/page.tsx: Stale closure in `update()` callback — 2nd rapid call (`update({search:"a"})` then `update({country:"India"})`) can lose the first call's changes because `filters` in closure is stale
- [x] C4. browse/page.tsx: `load()` async race — multiple `load(N)` calls can resolve out of order; no abort controller or cancellation
- [x] C5. AlumniCard.tsx: Direct mutation of `alumni.isSaved` prop (`alumni.isSaved = next`) — mutating props violates React rules and causes subtle rendering bugs
- [x] C6. SwipeDeck.tsx: Missing `useMotionValue`/`useTransform` — every drag frame triggers React re-render instead of GPU-composited motion values, causing jank on low-end devices
- [x] C7. SwipeDeck.tsx: Undo button has no 3-second auto-dismiss — visible indefinitely with no fadeout animation
- [x] C8. SwipeDeck.tsx: Missing keyboard navigation — no ArrowLeft/ArrowRight key listeners
- [x] C9. SwipeDeck.tsx: Exit animation always exits right (`x: 700, rotate: 12`) regardless of swipe direction — left swipes should exit left
- [x] C10. SwipeDeck.tsx: Undo doesn't revert server action — undoing a save swipe does not call `unsaveAlumni`, undoing a skip is meaningless but the button still appears
- [x] C11. FilterPanel.tsx: No mobile drawer layout — always rendered as sidebar, not collapsible slide-over drawer
- [x] C12. SavedTab.tsx: Component exists but is **never rendered** anywhere — Browse/Saved tab toggle completely missing from browse page
- [x] C13. alumni.actions.ts: `listAlumni` accepts `availability` filter parameter but **never uses it in the Prisma where clause** — filtering by availability silently does nothing

### MAJOR
- [x] M1. browse/page.tsx: Missing error state — if `listAlumni` throws, `loading` goes to `false`, `items` stays `[]`, user sees "No alumni match your filters" (misleading)
- [x] M2. browse/page.tsx: Missing loading skeleton — no skeleton cards during initial load or filter change; the empty state flashes briefly on every filter change
- [x] M3. browse/page.tsx: `qsTiers` array is excluded from URL params by `typeof value !== "object"` check — QS tier filters not persisted
- [x] M4. browse/page.tsx: `useDebounce` hook exists but is **never used** — `update()` fires on every keystroke, causing URL/history update and API call per character
- [x] M5. browse/page.tsx: `setItems([])` on filter change causes flash of empty state — should use `keepPreviousData` pattern (requires React Query)
- [x] M6. browse/page.tsx: Page ignores URL search params on mount — `/browse?university=MIT&country=India` opens with default state, shareable URLs broken
- [x] M7. browse/page.tsx: SavedTab not wired — no `tab` state, no URL param for `?tab=browse|saved`, no saved alumni fetching
- [x] M8. AlumniCard.tsx (`variant="grid"`): Missing shadow hover transition — spec says shadow goes `sm→md` with 200ms ease-out on hover
- [x] M9. AlumniCard.tsx (`variant="swipe"`): Layout doesn't match spec — should be "full viewport width on mobile, 90% on tablet" with "photo full-bleed top 60%, content bottom 40%"
- [x] M10. AlumniCard.tsx (`variant="swipe"`): Missing save/skip direction overlays — heart icon (right) and X icon (left) should appear during drag
- [x] M11. AlumniCard.tsx: Missing save/unsave loading state — button remains clickable during async operation, no disabled/spinner state
- [x] M12. AlumniCard.tsx: Missing `onError` handler on `<img>` — broken images show broken icon with no `AvatarFallback`
- [x] M13. AlumniGrid.tsx: Missing 12 skeleton cards during loading — only shows text "Loading more alumni…"
- [x] M14. AlumniGrid.tsx: Missing 4-column breakpoint — grid stops at `xl:grid-cols-3`, spec requires `2xl:grid-cols-4` for ≥1440px
- [x] M15. AlumniGrid.tsx: Missing "all results loaded" indicator — when `hasMore` is false, nothing signals the end
- [x] M16. AlumniGrid.tsx: Missing aria attributes — no `aria-label` or `role` on grid, no `aria-live` for loading announcements
- [x] M17. SwipeDeck.tsx: No preloaded buffered cards — should render current + next 2 for zero-latency swipe
- [x] M18. SwipeDeck.tsx: Missing `useImagePreloader` — images not preloaded, no preload management
- [x] M19. SwipeDeck.tsx: Missing focus management — focus is lost after swipe, should move to new card's first button
- [x] M20. SwipeDeck.tsx: Missing `aria-live` region — no screen reader announcements for card changes, saves, skips
- [x] M21. SwipeDeck.tsx: Missing `React.memo` on swipe card — unnecessary re-renders of non-top cards
- [x] M22. SwipeDeck.tsx: Missing `will-change: transform` on active card, no removal after exit
- [x] M23. SwipeDeck.tsx: Missing dragElastic differentiation — spec says 0.9 for touch, 0.7 for mouse
- [x] M24. SwipeDeck.tsx: Missing swipe+filter race guard (swipeDecisionRef pattern) — swipe decision can reference stale card data if filters change mid-swipe
- [x] M25. SwipeDeck.tsx: Missing rapid-swiping guard (`isAnimating` ref) — user can drag next card before exit animation completes
- [x] M26. SwipeDeck.tsx: Missing empty-deck transition — no shrink+fade animation when last card exits
- [x] M27. SwipeDeck.tsx: Missing empty-deck undo — "Undo Last" should be visible for 5s after last card exits
- [x] M28. SwipeDeck.tsx: Missing reduced motion support — no `useReducedMotion` check; drag should be disabled, buttons more prominent
- [x] M29. SwipeDeck.tsx: Loading state not handled — should show skeleton card with shimmer when items are loading
- [x] M30. SwipeDeck.tsx: Stacked z-index management not implemented — cards should be in reverse DOM order with calculated z-offsets
- [x] M31. SwipeDeck.tsx: `onSave` result ignored — if server action fails, card still disappears with no error recovery
- [x] M32. FilterPanel.tsx: Missing spec filters entirely:
    - Availability toggle (This week / This month / Any)
    - QS Ranking Tier checkboxes (Top 50 / Top 100 / Top 200 / Unranked)
    - Grad Year range slider (min 2015, max current)
    - University: missing searchable dropdown (is plain `<select>`)
    - Course: missing autocomplete (is plain `<select>`)
    - Country: missing country flags
- [x] M33. FilterPanel.tsx: Missing "N results found" counter at top
- [x] M34. FilterPanel.tsx: No loading/disabled state — dropdowns not disabled during fetch
- [x] M35. FilterPanel.tsx: No mobile drag-to-close behavior (magnetic drawer)
- [x] M36. FilterPanel.tsx: No backdrop overlay for mobile drawer
- [x] M37. SearchBar.tsx: No debounce applied — fires `onChange` on every keystroke; `useDebounce` hook unused
- [x] M38. SearchBar.tsx: Missing clear button (X icon) when value is present
- [x] M39. SearchBar.tsx: Missing Escape key handler to clear input
- [x] M40. SearchBar.tsx: Missing disabled/loading state prop
- [x] M41. SavedTab.tsx: No actual toggle logic — component just renders two buttons but doesn't communicate with parent state
- [x] M42. CountryFlag.tsx: Limited to 6 hardcoded countries — unknown countries show generic globe emoji
- [x] M43. CountryFlag.tsx: Uses country name lookup, spec references `country-code-emoji` library with country codes
- [x] M44. alumni.actions.ts: `listAlumni` returns `items` with `languages` typed as `string[]` but always `JSON.parse`s the field — if DB already stores array, this throws
- [x] M45. alumni.actions.ts: `getAlumniById` doesn't include `isSaved` status (unlike `listAlumni`)
- [x] M46. alumni.actions.ts: `listAlumni` search does case-sensitive `contains` — "harvard" won't match "Harvard"
- [x] M47. `src/app/api/alumni/route.ts`: Missing try/catch — unhandled errors return no structured error response
- [x] M48. `src/lib/hooks/useImagePreloader.ts`: Missing `currentIndex` param — preloads all URLs instead of `currentIndex + 1` through `currentIndex + 3`
- [x] M49. `useImagePreloader.ts`: No error handling — failed preloads silently fail with no fallback
- [x] M50. `useImagePreloader.ts`: No preload cancellation — rapid swiping doesn't cancel in-flight preloads
- [x] M51. `useImagePreloader.ts`: No image cache (`Map<string, HTMLImageElement>`) — duplicate requests for same URL
- [x] M52. `useImagePreloader.ts`: No `requestIdleCallback` for card +3 preload
- [x] M53. QueryProvider.tsx: Global `staleTime: 300000` (5 min) conflicts with spec requirement of `30s` for `/browse` queries
- [x] M54. `student.actions.ts`: `getSavedAlumni` returns `savedAlumni` join but doesn't mark `isSaved: true` on each item — consumer must add it

### MINOR
- [x] m1. browse/page.tsx: Hard-coded strings ("Discover your next step", "Find your people") should be configurable or use constants
- [x] m2. browse/page.tsx: `void` used to suppress promise returns on `getFilterOptions()` and `load(1)` without `.catch()` — hides errors
- [x] m3. browse/page.tsx: `clear()` omits `availability` and `qsTiers` from reset
- [x] m4. browse/page.tsx: Rating display in AlumniCard uses `toFixed(1)` instead of `formatRating()` from `lib/format.ts`
- [x] m5. AlumniCard.tsx: `alt` text could be more descriptive (`"Photo of ${alumni.fullName}"` instead of just name)
- [x] m6. AlumniCard.tsx: `onSaved` callback prop is called but no parent component in Phase 3 uses it — dead API surface
- [x] m7. AlumniGrid.tsx: `IntersectionObserver` disconnects and reconnects on every render — useRef for observer instance
- [x] m8. SwipeDeck.tsx: `key={current.id}` on motion.div is correct pattern but no `AnimatePresence mode="popLayout"` consideration
- [x] m9. FilterPanel.tsx: `selectClass` defined as module-level const but uses hardcoded border/height instead of token variables
- [x] m10. SearchBar.tsx: `<label>` wraps both icon and input but icon is decorative — should have `aria-hidden="true"` on Search icon
- [x] m11. CountryFlag.tsx: Uses emoji directly — design skill bans emojis in UI (flags are acceptable exception but should note)
- [x] m12. alumni.actions.ts: Unused import `hash` from bcrypt-ts — dead code
- [x] m13. `src/app/api/alumni/route.ts`: `Number(params.get(...))` can produce `NaN` with no validation for gradYearMin/gradYearMax
- [x] m14. `useImagePreloader.ts`: `image` variable assigned but `loading` attribute never set — all images at default priority
- [x] m15. layout.tsx: `QueryProvider` wraps browser-level code but its 5-min staleTime is too coarse for browse page's 30s requirement
- [x] m16. No `formatPrice`, `formatRating`, or `formatUniversity` from `lib/format.ts` used in any Phase 3 component — raw number/string output
- [x] m17. No `error.tsx` or error boundary at `/browse` level — unhandled render errors crash the entire app

## Summary

**Total issues: 73** (Critical: 13, Major: 54, Minor: 17) — ALL FIXED

The Phase 3 code implements the basic structure of Browse & Discovery but falls far short of production quality. The most critical gaps are:

1. **No React Query integration** (C1) — the browse page uses raw async/useState with no caching, race-condition protection, or cache invalidation, directly contradicting the spec's data flow architecture.

2. **SwipeDeck is a shell** (C6-C10, M17-M31) — missing motion value optimization, keyboard navigation, undo timeout, focus management, preloaded cards, image preloading, reduced motion support, and most accessibility requirements.

3. **Missing features** — SavedTab not connected (C12), FilterPanel missing 3 of 6 filter types (M32), no mobile drawer (C11), no error/loading states in most components.

4. **Hard-coded state management** — no React Query means no `keepPreviousData`, no cache invalidation on save/unsave, no automatic refetch.

---

## Detailed File Review

### `src/app/browse/page.tsx`
- **[C1]** No React Query — uses `useState`+`useEffect`+`useCallback` for data fetching. Missing: query key strategy, `keepPreviousData`, staleTime=30s, cache invalidation on save/unsave, skeleton grid during loading. Ref: Spec §8 Data Flow.
- **[C2]** `getFilterOptions()` (line 20) called with `.then()` but NO `.catch()`. Network failure silently leaves `options` at `{ universities: [], countries: [], courses: [] }`.
- **[C3]** Stale closure in `update()` (line 18). `const merged = { ...filters, ...next }` uses `filters` from closure (last render). Two rapid calls in the same render cycle lose the first's changes.
- **[C4]** `load()` async race (line 19). Multiple `load(1)` calls from rapid filter changes resolve out of order. Latest response may not reflect latest filters. No abort controller.
- **[M1]** No error state for `load()` failures. `loading` goes to `false`, `items` stays `[]` → empty state "No alumni match" is misleading.
- **[M2]** No skeleton cards during load. Empty state flashes on every filter change because `setItems([])` is called before fetch.
- **[M3]** `qsTiers` array excluded from URL by `typeof value !== "object"` check (line 18) — QS tier filters not shareable.
- **[M4]** `useDebounce` not used. `update({ search: value })` fires on every keystroke → URL replace + API call per character.
- **[M5]** `setItems([])` on filter change (line 18) causes empty flash. Should keep previous data.
- **[M6]** No URL param parsing on mount. `/browse?university=MIT` shows default state, not filtered.
- **[M7]** No `SavedTab` rendering. No `tab` state. No saved alumni fetching.
- **[m1]** Hardcoded strings throughout. Should use constants or i18n-ready pattern.
- **[m2]** `void` used as promise discard with no `.catch()`.
- **[m3]** `clear()` omits `availability` and `qsTiers`.
- **[m15]** `clear()` has `studyLevel: "both"` and `sessionType: "both"` — but `AlumniFilters.studyLevel` type is `string | undefined`, not "both" | undefined.

### `src/components/AlumniCard.tsx`
- **[C5]** Direct prop mutation: `alumni.isSaved = next; onSaved?.(next); const result = next ? await saveAlumni(alumni.id) : await unsaveAlumni(alumni.id); if (!result.success) { alumni.isSaved = !next; onSaved?.(!next); }` — mutates `alumni` prop directly. Should use `useState`.
- **[M8]** Grid variant missing shadow hover transition. Spec: `--shadow-sm` → `--shadow-md`, 200ms ease-out.
- **[M9]** Swipe variant layout doesn't match spec. Should have 60% photo / 40% content ratio, full viewport width on mobile, 90% on tablet.
- **[M10]** Swipe variant missing drag overlays. No save/heart overlay on right drag, no skip/X overlay on left drag.
- **[M11]** Save button has no loading/disabled state. Spam-clickable during async operation.
- **[M12]** `<img>` has no `onError` handler → broken image icon shows. Need `AvatarFallback`.
- **[m4]** `alumni.ratingAvg.toFixed(1)` — should use `formatRating()` from `lib/format.ts`.
- **[m5]** `alt={alumni.fullName}` — should be more descriptive, e.g. `alt={"Photo of " + alumni.fullName}`.
- **[m6]** `onSaved` callback is called but no Phase 3 parent uses it.

### `src/components/AlumniGrid.tsx`
- **[M13]** Missing 12 skeleton cards during loading. Loading state shows only text "Loading more alumni…".
- **[M14]** Missing `2xl:grid-cols-4` breakpoint for wide screens (≥1440px).
- **[M15]** No "You've seen all N alumni" indicator when `hasMore=false`.
- **[M16]** No `aria-label="Alumni grid"` or `role="list"` on grid container. No `aria-live="polite"` on loading state.
- **[m7]** `IntersectionObserver` disconnected & reconnected on every render because effect depends on `[hasMore, loadMore, loading]`.

### `src/components/SwipeDeck.tsx`
- **[C6]** Missing `useMotionValue`/`useTransform` — every drag frame React re-render. Ref: Spec §5 Performance.
- **[C7]** Undo button persists indefinitely — no 3-second auto-dismiss, no fadeout animation.
- **[C8]** No keyboard navigation — missing `useEffect` with `keydown` listener for ArrowLeft (skip) and ArrowRight (save).
- **[C9]** Exit animation always exits right `{ x: 700, opacity: 0, rotate: 12 }` regardless of direction. Left swipe should exit with negative x and negative rotation.
- **[C10]** Undo doesn't revert server action: undoing "save" doesn't call `unsaveAlumni`, undoing "skip" has no server effect but button still shows.
- **[M17]** Only current card rendered — no buffer cards (next 2). Swipe reveals blank before next image loads.
- **[M18]** `useImagePreloader` not used. No image preloading strategy.
- **[M19]** Focus management missing — after swipe, focus is lost (no active element). Should move to new card's first button.
- **[M20]** No `aria-live="polite"` region for screen reader announcements. No announcement on card change, save, or skip.
- **[M21]** No `React.memo` on swipe cards — all cards re-render on any state change.
- **[M22]** No `will-change: transform` on active card per spec §5 Performance.
- **[M23]** No dragElastic differentiation by pointer type (0.9 touch vs 0.7 mouse per spec).
- **[M24]** No swipeDecisionRef pattern for filter-change-during-swipe race condition per spec §5.
- **[M25]** No `isAnimating` ref guard for rapid swiping per spec §5.
- **[M26]** Empty deck has no shrink+fade transition (scale 1→0.95, opacity 1→0, 200ms).
- **[M27]** Empty deck has no "Undo Last" button visible for 5s per spec §5.
- **[M28]** No `useReducedMotion()` check. Drag should be disabled, buttons more prominent for reduced motion.
- **[M29]** No loading skeleton card shown when items are being fetched.
- **[M30]** No z-index stacking management. Spec: reverse DOM order + `(cards.length - i) * 2 + 1` z-index.
- **[M31]** `onSave` promise result not checked — if save fails, card still disappears with no recovery.
- **[m8]** No `AnimatePresence mode="popLayout"` — default mode `"sync"` can cause layout issues during exit.

### `src/components/FilterPanel.tsx`
- **[C11]** No mobile drawer — always rendered as sidebar `<aside>`. Spec: "collapsible drawer on mobile, 85vw width, backdrop overlay".
- **[M32]** Missing filter types:
  - Availability (This week / This month / Any)
  - QS Ranking Tier checkboxes (Top 50 / Top 100 / Top 200 / Unranked)
  - Grad Year range slider (min 2015, max current)
  - University searchable dropdown (is plain `<select>`)
  - Course autocomplete (is plain `<select>`)
  - Country flags (spec: dropdown with flags via country-code-emoji)
- **[M33]** Missing "N results found" counter at top of filter panel per spec §20.2.
- **[M34]** No loading/disabled state — dropdowns not disabled during data fetch.
- **[M35]** No mobile drag-to-close via Framer Motion `drag="x"` per spec §9.1.
- **[M36]** No backdrop overlay at 50% opacity for mobile drawer.
- **[m9]** `selectClass` const uses hardcoded values (`h-10`, `border-border`) instead of token variables.

### `src/components/SearchBar.tsx`
- **[M37]** No debounce — `onChange` fires on every keystroke; `useDebounce` hook exists but is unused.
- **[M38]** Missing clear (X) button when value is present per spec §20.2.
- **[M39]** Missing Escape key handler to clear/reset input per spec §20.2.
- **[M40]** No `disabled` prop — input cannot be disabled during loading.
- **[m10]** Search icon `<Search>` should have `aria-hidden="true"` (decorative).

### `src/components/SavedTab.tsx`
- **[C12]** Component exists at `src/components/SavedTab.tsx` but is **not imported or rendered** in `browse/page.tsx`. The Browse/Saved tab toggle is completely missing from the page.
- **[M41]** Even if rendered, it has no state binding — accepts `saved` and `count` but doesn't call back to parent to switch between Browse/Saved views.

### `src/components/CountryFlag.tsx`
- **[M42]** Only 6 countries hardcoded (India, UK, US, Australia, Singapore, Canada). Unknown countries show "🌍".
- **[M43]** Uses country name lookup — spec references `country-code-emoji` library with 2-letter country codes.
- **[m11]** Emoji usage — design skill bans emojis in UI with exception for flags, but fallback globe is vague.

### `src/actions/alumni.actions.ts`
- **[C13]** `listAlumni` (line 34) accepts `filters.availability` in destructured params but **never applies it to the Prisma `where` clause** — filtering by "this_week" or "this_month" silently does nothing.
- **[M44]** `languages` field (line 37): `JSON.parse(item.languages)` assumes string — if DB already stores parsed array, this throws `SyntaxError`.
- **[M45]** `getAlumniById` (line 39) doesn't check current user's saved alumni — no `isSaved` in returned data.
- **[M46]** Search (line 34) uses Prisma `contains` which is case-sensitive in PostgreSQL — "harvard" won't match "Harvard".
- **[m12]** `import { hash } from "bcrypt-ts"` (line 3) unused — left over from `applyAsAlumni`; not used in Phase 3 functions.

### `src/app/api/alumni/route.ts`
- **[M47]** No try/catch — if `listAlumni` throws, Next.js returns generic 500 with no structured error response.
- **[m13]** `Number(params.get("gradYearMin"))` can return `NaN` with no validation — would produce invalid Prisma query.

### `src/lib/hooks/useDebounce.ts`
- No issues — implementation is correct for the use case. Simple, clean generic hook.

### `src/lib/hooks/useImagePreloader.ts`
- **[M48]** Missing `currentIndex` parameter — spec implementation preloads `urls.slice(currentIndex + 1, currentIndex + 4)`, this version preloads ALL URLs every time.
- **[M49]** No error handling on preload — if `new Image()` fails, no logging or fallback trigger.
- **[M50]** No cancellation mechanism — spec describes `cancelledRef` pattern; rapid swiping should cancel in-flight preloads.
- **[M51]** No image cache (`Map<string, HTMLImageElement>`) — duplicate network requests for same URL across renders.
- **[M52]** No `requestIdleCallback` for card+3 preloads (lowest priority, only if browser idle).
- **[m14]** `loading` attribute never set on preloaded images — all at browser default priority.

### `src/app/layout.tsx`
- No Phase 3 code issues. Correctly wraps with `SessionProvider` and `QueryProvider`.

### `src/components/QueryProvider.tsx`
- **[M53]** Global `staleTime: 300000` (5 minutes) is coarse. Spec §8 Data Flow requires `/browse` queries to have `staleTime: 30s`. Should be overridable per query (currently nothing overrides).
- **[m15]** No `QueryDevtools` included (development-only, not a bug).

### `src/actions/student.actions.ts`
- **[M54]** `getSavedAlumni` returns the join object `{ id, createdAt, alumni: {...} }` but doesn't add `isSaved: true` field on each alumni item. Consumer must transform.
