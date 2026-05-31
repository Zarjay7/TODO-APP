# Tasks

**A beautiful, tactile, installable task management PWA built with refined light skeuomorphism.**

Elegant task management with subtle shadows, embossed surfaces, delicate gradients, and Apple-inspired tactility — available in a soft light theme and an elegant dark grey mode.

> **Design goal**: Every surface should feel premium and touchable. No generic UI. Pure CSS craftsmanship for depth and micro-interactions.

---

## Features (Vision)

- **Skeuomorphic Design System** — Raised cards, embossed controls, recessed inputs, frosted sidebar, custom scale-pop checkboxes, floating FAB with realistic depth. Works beautifully in both light and dark grey themes.
- **Smart Organization** — Inbox, Today, Upcoming, Completed, All Tasks + fully editable color-coded categories.
- **Powerful Interaction** — Drag & drop reordering (touch + mouse), global search, rich filtering & sorting, due date badges with visual states (overdue pulse, today, future).
- **Delightful Details** — Smooth micro-interactions, undo toasts, progress overview, keyboard shortcuts (`N` new, `/` search, `Esc` close), charming empty states.
- **Full PWA** — Installable, works completely offline (view + edit tasks), standalone app experience, iOS Add-to-Home-Screen guidance.
- **Accessibility & Quality** — WCAG 2.2 AA target, full keyboard navigation, high Lighthouse scores.

**Tech stack**: React 19 + Vite + TypeScript + Tailwind + custom CSS (no heavy component libraries — the skeuomorphism is hand-crafted).

See the detailed [implementation plan and design vision](light-skeuomorphic-task-app-plan.md) that guided this project.

---

## Current Status

Early development — beautiful responsive visual shell with working theme toggle (light ↔ elegant dark grey), navigation, mock tasks, skeuomorphic primitives, and PWA scaffolding is in place.

Full CRUD, persistence, real drag-and-drop, modals, install flow, and polish are actively being built following the phased plan.

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server (with HMR)
npm run dev
```

Open http://localhost:5173

```bash
# Production build
npm run build

# Preview production build locally
npm run preview
```

---

## Project Structure (Key)

- `src/` — React app
  - `components/` — Skeuomorphic primitives (TaskCard, FAB, Modal, etc.)
  - `styles/` — Design tokens + custom skeuomorphic CSS layers
  - `lib/` — Types, persistence, utilities
- `public/` — PWA manifest & icons
- `light-skeuomorphic-task-app-plan.md` — The complete design + implementation roadmap

---

## Roadmap Highlights

Phased delivery with runnable milestones after every phase (see the plan file for full details):

1. Bootstrap + visual design system foundation (largely complete)
2. Real state management, CRUD, localStorage persistence, DnD, filters
3. Full PWA capabilities (install prompt, offline, iOS handling)
4. Polish, accessibility, performance, Lighthouse 95+ targets
5. Deploy + documentation

Future (v2 ideas): cloud sync, collaboration, AI assistance, voice input.

---

## Contributing

This project prioritizes craft and attention to the tactile aesthetic. Contributions that preserve or elevate the skeuomorphic feel are very welcome.

---

## License

MIT (to be added)

---

**Built with care for the 2026 light skeuomorphism trend.**

Repository: https://github.com/Zarjay7/TODO-APP
