# Tasks

> **A refined, tactile task management PWA built with light skeuomorphism.**

Beautiful, installable, and fully offline-capable. Designed with obsessive attention to material feel — subtle shadows, embossed surfaces, and micro-interactions that make every tap and click feel premium.

![Tasks Preview](https://via.placeholder.com/1200x630/f8f7f4/3f3a35?text=Tasks+-+Light+Skeuomorphic+PWA)

---

## Design Philosophy

This project is an exploration of **light skeuomorphism** in 2026:

- Soft off-white and pure surfaces
- Layered, delicate shadows instead of flat design
- Embossed controls and recessed inputs
- Large rounded corners with physical weight
- Refined bluish-gray accents (never harsh)
- Consistent tactile depth in both light and elegant dark grey modes

The goal is simple: every UI element should feel like it has mass and responds to touch.

Detailed vision and implementation plan: [docs/DESIGN_PLAN.md](docs/DESIGN_PLAN.md)

---

## Features

| Category              | Highlights |
|-----------------------|----------|
| **Skeuomorphic UI**   | Raised cards with inset highlights, custom embossed checkboxes with scale-pop animation, floating FAB, frosted sidebar, recessed form fields |
| **Organization**      | Smart views (Inbox, Today, Upcoming, Completed, All), fully editable color-coded categories |
| **Interaction**       | Drag & drop reordering (mouse + touch), powerful search + filtering + sorting, rich due date badges (with overdue pulse) |
| **Polish**            | Keyboard shortcuts, undo toasts, progress indicators, smooth micro-interactions, charming empty states |
| **PWA**               | One-click install, works completely offline, standalone mode, iOS Add to Home Screen support |
| **Quality**           | WCAG 2.2 AA target, high Lighthouse scores, React 19 + TypeScript |

**Current Status**: Early development. The visual design system and responsive shell are in place with working theme switching. Full task management, persistence, and PWA install flow are actively in progress.

---

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** (blazing fast HMR and builds)
- **Tailwind CSS 4** + heavy custom CSS for skeuomorphic effects
- **@dnd-kit** for accessible, touch-friendly drag and drop
- **Vite PWA Plugin** for installable + offline experience
- Zero heavy UI component libraries — all tactile effects are hand-crafted in CSS

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/Zarjay7/TODO-APP.git
cd TODO-APP

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Production Build

```bash
npm run build
npm run preview
```

---

## Project Structure

```
TODO-APP/
├── src/
│   ├── components/     # Reusable skeuomorphic UI primitives
│   ├── styles/         # Design tokens + custom CSS (the heart of the aesthetic)
│   ├── lib/            # Types, utilities, persistence layer
│   └── hooks/          # Custom React hooks
├── public/             # PWA manifest, icons, static assets
├── docs/
│   └── DESIGN_PLAN.md  # Complete design vision + phased implementation roadmap
└── README.md
```

---

## Roadmap

See [docs/DESIGN_PLAN.md](docs/DESIGN_PLAN.md) for the full detailed plan.

**Current Focus (Phase 1 → Phase 2)**
- [x] Professional light + dark skeuomorphic design system
- [x] Responsive shell + theme switching
- [ ] Real task state + localStorage persistence
- [ ] Full CRUD + drag & drop
- [ ] Production-ready PWA (install prompt, offline editing, iOS guidance)

**Later**
- Lighthouse 95+ across all categories
- Refined empty states, loading skeletons, and micro-interactions
- Deployment + documentation

---

## Contributing

This project values **craft** above speed.

When contributing:
- Preserve or improve the tactile, skeuomorphic aesthetic
- Keep custom CSS as the source of truth for visual depth (avoid generic component libraries)
- Test both light and dark themes
- Consider touch + keyboard interactions

Pull requests that elevate the material feel are especially welcome.

---

## License

MIT © Zarjay7

---

**Built with care for the 2026 light skeuomorphism movement.**

[GitHub](https://github.com/Zarjay7/TODO-APP) • [Design Plan](docs/DESIGN_PLAN.md)
