# Scroll Animations & Micro-Interactions — Implementation Prompt

Use this prompt to reproduce or extend the animation system added to this project.

---

## Prompt

**Prompt for Implementing Scroll Animations:**

"Please add smooth scroll animations to our website to enhance user experience. Use the following techniques:

1. **Smooth Scrolling:** Implement a smooth scrolling effect using **Lenis** or **Locomotive Scroll**.

2. **Scroll-Triggered Animations:** Utilize **GSAP** and **ScrollTrigger** to animate elements when they come into view (e.g., fade-ins, slide-ins, and parallax effects).

3. **Micro-interactions:** Add subtle animations to buttons and links on hover to make the interface feel more responsive.

4. **3D Effects:** If applicable, integrate **Three.js** for any 3D interactions that enhance the visual experience.

Please ensure that the animations are performance-optimized and work well across all devices."








> Add a complete, performance-optimised scroll animation and micro-interaction system to this React + TypeScript + Vite + Tailwind CSS project using the following stack and techniques. Do **not** create placeholder or example pages — wire everything into the real app.

---

### 1. Install dependencies

```bash
npm install gsap lenis react-scroll-parallax
```

The project already has `framer-motion` installed; keep it for any existing motion work.

---

### 2. `useSmoothScroll` hook — `src/hooks/useSmoothScroll.ts`

Create a custom React hook that:

- Initialises a **Lenis** smooth-scroll instance with these settings:
  - `duration: 1.2`
  - Custom exponential easing: `(t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))`
  - `smoothWheel: true`, `wheelMultiplier: 1`, `touchMultiplier: 2`
- Registers **GSAP ScrollTrigger** (`gsap.registerPlugin(ScrollTrigger)`)
- Synchronises Lenis with GSAP's ticker so both run on the same `requestAnimationFrame`:
  - `lenis.on('scroll', ScrollTrigger.update)`
  - `gsap.ticker.add((time) => lenis.raf(time * 1000))`
  - `gsap.ticker.lagSmoothing(0)` to prevent stuttering
- Accepts an `enabled: boolean` parameter (default `true`) so it can be disabled on specific pages (e.g. the full-screen home HUD)
- Returns a `ref` to the Lenis instance for programmatic scroll control
- Cleans up everything in the `useEffect` return (removes ticker, destroys Lenis)

---

### 3. `useScrollReveal` hook — `src/hooks/useScrollReveal.ts`

Create a custom React hook that:

- Accepts an options object: `{ type, duration, delay, stagger, start, animateChildren }`
- Supports five `RevealType` variants:
  - `'fadeUp'` → `{ opacity: 0, y: 40 }`
  - `'fadeIn'` → `{ opacity: 0 }`
  - `'slideLeft'` → `{ opacity: 0, x: -60 }`
  - `'slideRight'` → `{ opacity: 0, x: 60 }`
  - `'scaleUp'` → `{ opacity: 0, scale: 0.88 }`
- Uses `gsap.from()` with a `ScrollTrigger` (`once: true`, `start: 'top 85%'` by default)
- When `animateChildren: true`, targets `Array.from(el.children)` with the `stagger` value (default `0.12`)
- Wraps the animation in `gsap.context()` and calls `ctx.revert()` on cleanup
- Returns a typed `ref` (`useRef<T>`) to attach to any HTML element
- Also exports a `useStaggerReveal` convenience wrapper that always sets `animateChildren: true`

Default option values:
- `type`: `'fadeUp'`
- `duration`: `0.8`
- `delay`: `0`
- `stagger`: `0.12`
- `start`: `'top 85%'`
- `ease`: `'power3.out'`

---

### 4. Wire `useSmoothScroll` into `MainLayout` — `src/components/layouts/MainLayout.tsx`

- Import `useSmoothScroll`
- Detect whether the current route is the home page (`location.pathname === '/'`)
- Call `useSmoothScroll(!isHomePage)` so Lenis is active on every page **except** the full-screen interactive home HUD (which manages its own scroll)

---

### 5. Apply scroll-reveal animations to the `About` page — `src/pages/About.tsx`

Wrap the entire page in `<ParallaxProvider>` from `react-scroll-parallax`. Then apply the following refs:

| Ref variable      | Hook               | Options                                      | Applied to                              |
|-------------------|--------------------|----------------------------------------------|-----------------------------------------|
| `heroTextRef`     | `useScrollReveal`  | `{ type: 'fadeUp', delay: 0.1 }`             | Hero overlay `<div>` (h1 + subtitle)    |
| `valueCardsRef`   | `useStaggerReveal` | `{ type: 'fadeUp', stagger: 0.14 }`          | Value-propositions `<section>` (3 cards)|
| `missionRef`      | `useScrollReveal`  | `{ type: 'fadeIn', duration: 1 }`            | Mission Statement `<section>`           |
| `stepsRef`        | `useStaggerReveal` | `{ type: 'scaleUp', stagger: 0.15 }`         | How-It-Works steps `<div>`              |
| `teamRef`         | `useStaggerReveal` | `{ type: 'fadeUp', stagger: 0.18 }`          | Team cards `<div>`                      |

Also add two `<Parallax>` wrappers from `react-scroll-parallax`:
- Around the value-propositions section: `<Parallax translateY={[-20, 20]}>`
- Around the mission statement section: `<Parallax scale={[0.9, 1]}>`

---

### 6. CSS micro-interactions — `src/index.css`

Add a clearly labelled section titled `MICRO-INTERACTIONS & SCROLL ANIMATIONS` with the following reusable utility classes:

#### `.hover-lift` — Card lift on hover
```css
.hover-lift {
  transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1),
              box-shadow 0.28s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform;
}
.hover-lift:hover {
  transform: translateY(-6px) scale(1.015);
  box-shadow: 0 16px 40px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.08);
}
.dark .hover-lift:hover {
  box-shadow: 0 16px 40px rgba(0,0,0,0.45), 0 4px 12px rgba(6,182,212,0.08);
}
```

#### `.hover-glow` — Indigo/cyan glow on hover
```css
.hover-glow {
  transition: box-shadow 0.3s ease, transform 0.3s ease;
  will-change: transform;
}
.hover-glow:hover {
  box-shadow: 0 0 0 2px rgba(99,102,241,0.4), 0 8px 30px rgba(99,102,241,0.2);
  transform: translateY(-3px);
}
.dark .hover-glow:hover {
  box-shadow: 0 0 0 2px rgba(6,182,212,0.35), 0 8px 30px rgba(6,182,212,0.15);
}
```

#### `.btn-animated` — Button scale + radial ripple on hover
```css
.btn-animated {
  position: relative;
  overflow: hidden;
  transition: transform 0.2s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.2s ease;
}
.btn-animated::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.2) 0%, transparent 60%);
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
  border-radius: inherit;
}
.btn-animated:hover  { transform: translateY(-2px) scale(1.03); box-shadow: 0 6px 20px rgba(0,0,0,0.15); }
.btn-animated:hover::after { opacity: 1; }
.btn-animated:active { transform: translateY(0) scale(0.97); }
```

#### `.link-reveal` — Animated underline for nav/text links
```css
.link-reveal {
  position: relative;
  display: inline-block;
}
.link-reveal::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1.5px;
  background: currentColor;
  border-radius: 1px;
  transition: width 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}
.link-reveal:hover::after { width: 100%; }
```

#### `.hover-shine` — Diagonal shine sweep on hover
```css
.hover-shine {
  position: relative;
  overflow: hidden;
}
.hover-shine::before {
  content: '';
  position: absolute;
  top: 0; left: -100%;
  width: 60%; height: 100%;
  background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%);
  transition: left 0.55s cubic-bezier(0.22, 1, 0.36, 1);
  pointer-events: none;
}
.hover-shine:hover::before { left: 160%; }
```

#### `.animate-section-enter` — CSS-only fallback fade-up (before GSAP loads)
```css
@keyframes section-fade-up {
  from { opacity: 0; transform: translateY(32px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-section-enter {
  animation: section-fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
}
```

#### `@media (prefers-reduced-motion: reduce)` — Accessibility
Disable all transitions and transforms for `.hover-lift`, `.hover-glow`, `.btn-animated`, `.hover-shine`, and `.link-reveal::after` when the user has requested reduced motion.

---

### 7. Apply utility classes throughout the app

- Add `hover-lift` to card components (e.g. value-proposition cards on the About page)
- Add `link-reveal` to footer navigation links in `MainLayout`
- Add `btn-animated` to primary CTA buttons
- Apply `hover-glow` to icon-heavy interactive elements

---

### 8. Performance requirements

- All GSAP animations must use `will-change: transform` (or the CSS utility sets it) and run on the compositor thread
- Lenis and GSAP share a single `requestAnimationFrame` loop — never run them independently
- Use `once: true` on all ScrollTrigger instances so entrance animations fire once and are garbage-collected
- Wrap GSAP tweens in `gsap.context()` and revert on unmount to prevent memory leaks in React
- All motion classes must be suppressed under `@media (prefers-reduced-motion: reduce)`
- Lenis is **disabled** on the home page (`/`) to avoid conflicting with its full-screen HUD scroll logic

---

### Summary of files created / modified

| File | Action |
|------|--------|
| `src/hooks/useSmoothScroll.ts` | **Created** — Lenis + GSAP ticker sync hook |
| `src/hooks/useScrollReveal.ts` | **Created** — GSAP ScrollTrigger reveal hook + `useStaggerReveal` helper |
| `src/components/layouts/MainLayout.tsx` | **Modified** — calls `useSmoothScroll(!isHomePage)` |
| `src/pages/About.tsx` | **Modified** — `ParallaxProvider`, scroll-reveal refs on all major sections |
| `src/index.css` | **Modified** — added micro-interaction utility classes section |
