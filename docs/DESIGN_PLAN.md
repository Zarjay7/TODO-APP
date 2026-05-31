# Light Skeuomorphic Task Management Web App
## Complete Development Plan with PWA Installer

**Project Name:** None — this app has no name and no branding  
**Tagline:** Elegant task management with tactile, light skeuomorphic design  
**Target:** Modern web app (2026) — fully installable PWA, offline-first, beautiful light skeuomorphism  
**Design Philosophy:** Light Skeuomorphism — subtle shadows, delicate gradients, soft surfaces, lightly embossed effects, refined Apple-inspired tactility with brighter 3D realism. Clean whites, gentle bluish-grays, soft grays, large rounded corners (16–24px), micro-depth without heavy textures. Full support for switching to elegant dark grey mode with matching tactile depth.

---

## Stage 1: Requirements & Feature Definition (Week 1)

### Core Features (MVP)
1. **Task CRUD**
   - Create task (title required, optional description, due date, priority, category)
   - Edit inline or via modal
   - Delete with undo toast
   - Toggle complete (strikethrough + check animation)

2. **Smart Organization**
   - Sidebar navigation: Inbox, Today, Upcoming, Completed, All Tasks
   - Custom categories (color-coded tags, editable)
   - Priority levels: High (red accent), Medium (orange), Low (green) — with left border or dot

3. **Filtering & Search**
   - Global search (title + description)
   - Filter by: Status, Priority, Category, Due date range
   - Sort options: Due date, Priority, Created, Alphabetical

4. **Visual & Interactive Polish**
   - Drag & drop reordering within lists
   - Due date badges (overdue = red pulse, today = bluish-gray, future = gray)
   - Progress overview dashboard (top bar or dedicated view): % complete, tasks today, streak counter

5. **Micro-interactions**
   - Subtle lift on hover (translateY + stronger shadow)
   - Checkbox with embossed press effect
   - Add task floating action button (FAB) with ripple + scale
   - Confetti burst on completing last task of the day (optional fun)

6. **Dark Grey Mode**
   - Elegant toggle switch (subtle skeuomorphic slider with soft emboss)
   - Full dark grey theme with refined, muted bluish-gray accents
   - Automatic system preference detection + manual switch
   - Consistent tactile shadows and depth in both modes (no harsh contrasts)

### PWA Requirements
- Installable via browser prompt + custom "Install App" button
- Offline support (view + edit tasks)
- Push notifications for due reminders (optional advanced)
- App-like experience (standalone display, no browser UI)

### Non-Functional
- Fully responsive (mobile-first, tablet, desktop)
- Accessibility: WCAG 2.2 AA, keyboard navigation, ARIA labels
- Performance: Lighthouse PWA score ≥ 95
- Data persistence: localStorage (MVP) → optional Firebase sync later
- Theme: Strictly light mode with skeuomorphic depth (no dark mode in v1 to preserve the "light" aesthetic)

---

## Stage 2: Technology Stack & Architecture (Week 1)

**Recommended Stack (Balanced for beauty + speed):**
- **HTML5 + CSS3 + Vanilla JavaScript (ES2024)** — single-page app, no framework bloat for pure control over skeuomorphism
- **Tailwind CSS 4** (via CDN for prototype, or PostCSS build for production) — rapid layout, then override with custom skeuomorphic utilities
- **Vite** (for production build) or plain static files
- **No backend for MVP** — everything client-side + localStorage
- **Icons:** Inline SVG (Heroicons style, custom embossed) or Lucide
- **Date handling:** Day.js (lightweight)
- **Drag & drop:** Native HTML5 Drag API + visual feedback
- **PWA:** Web App Manifest + Service Worker (Workbox optional for simplicity)

**Alternative (if scaling fast):** React 19 + Vite + Tailwind + shadcn/ui (but heavily customize for skeuomorphism) — only if you want component reusability later.

**Folder Structure:** A clean, logical organization with a main HTML file, dedicated CSS and JS folders for separation of concerns, an assets directory for icons and images, and a standard README.

---

## Stage 3: Design System — Light Skeuomorphism Implementation (Week 1–2)

### Color Palette (Soft & Tactile)
A carefully chosen soft off-white background, pure white surfaces, gentle gray tones, a refined bluish-gray accent (muted and sophisticated, never bright or harsh), and supporting colors for success, warning, and danger. Shadows are kept subtle and layered to create gentle depth without overwhelming the light aesthetic. The same palette is adapted elegantly for dark grey mode.

### Key Skeuomorphic Components

**1. Raised Cards / Task Items**
- Background: white
- Border-radius: 20px
- Box-shadow: `var(--shadow-medium)`
- Subtle top highlight: `inset 0 1px 0 rgba(255,255,255,0.9)`
- Hover: `translateY(-3px)` + stronger shadow

**2. Buttons**
- Primary (Add Task): Subtle bluish-gray gradient with soft shadow, active state pushes down with inset shadow
- Secondary: White with subtle border + light shadow
- Icon buttons: 44×44px, circular, embossed

**3. Inputs & Form Fields**
- Background: `var(--surface-alt)`
- Inset shadow for "recessed" paper feel
- Focus: Soft bluish-gray ring + lift

**4. Sidebar Navigation**
- Frosted effect (backdrop-filter: blur(20px)) + subtle border
- Active item: Filled with very light accent + left accent bar

**5. Modals**
- Large radius (24px)
- Backdrop: `rgba(15,23,42,0.4)` with blur
- Header bar with subtle gradient + close button (embossed X)

**6. Checkboxes**
- Custom: 28×28px square with rounded corners, light gray border, inner shadow when unchecked, refined bluish-gray fill + white check when checked (with scale pop animation)

**7. FAB (Floating Action Button)**
- 64×64px, circular, strong gradient + multi-layer shadow for "floating above surface" realism

---

## Stage 4: Core UI Layout & Components (Week 2)

### Layout Breakdown
- **Top Header**: Clean logo area + search bar (expands on focus) + user avatar (initials) + Install button
- **Left Sidebar** (fixed 280px on desktop, collapsible on mobile): Navigation list with icons + "New Category" button
- **Main Content Area**:
  - Dynamic title (e.g., "Today • 12 tasks")
  - Filter chips (All / High / Medium / Low)
  - Task list (virtualized if >50 tasks)
- **Right Panel** (optional desktop): Mini calendar + "Today's Progress" ring chart (SVG)

### Responsive Breakpoints
- Mobile (< 768px): Bottom navigation bar instead of sidebar
- Tablet: Sidebar as overlay
- Desktop: Full three-column

---

## Stage 5: JavaScript Logic & State Management (Week 2–3)

### Data Model & State Management
A simple task object containing id, title, optional description, due date, priority level, category, completion status, creation timestamp, and order for drag-and-drop support. State is managed in-memory with automatic persistence to browser local storage on every change, with easy loading on app start.

---

## Stage 6: PWA Implementation (Week 3)

### PWA Technical Implementation
Standard web app manifest for installability and branding, a service worker for reliable offline caching of the app shell, a custom install prompt triggered by the browser's beforeinstallprompt event, and platform-specific handling for iOS and Android to guide users to "Add to Home Screen".

### 4. iOS / Android Specific
- Apple touch icon + meta tags
- "Add to Home Screen" instructions for iOS (modal)

---

## Stage 7: Polish, Testing & Micro-Interactions (Week 3–4)

### Polish Items
- Smooth page transitions (view change with fade + slide)
- Loading skeleton for tasks (shimmer with soft gradient)
- Empty states with charming illustrations (SVG line art, skeuomorphic style)
- Toast notifications with embossed look
- Keyboard shortcuts (N = new task, / = focus search, Esc = close modal)

### Testing Checklist
- [ ] Lighthouse: Performance 95+, Accessibility 100, Best Practices 100, PWA 100
- [ ] Manual: iOS Safari, Chrome Android, Desktop Chrome/Firefox/Edge
- [ ] Accessibility: Screen reader (VoiceOver/NVDA), keyboard only, color contrast
- [ ] Edge cases: 100+ tasks, very long titles, no due date, offline editing

---

## Stage 8: Deployment & Post-Launch (Week 4)

### Hosting (Free & Fast)
- **Vercel** or **Netlify** — drag & drop or Git integration, automatic HTTPS, PWA headers
- Custom domain optional

### Post-Launch
- Add analytics (Plausible or simple count)
- User feedback form (modal)
- Roadmap modal for v2 (cloud sync, collaboration, themes)

### Future Roadmap (v2)
- Real-time sync (Supabase / Firebase)
- Shared projects
- Dark mode variant (with adjusted skeuomorphism)
- AI task suggestions
- Voice input

---

## Stage 9: Timeline & Milestones

| Stage | Focus                          | Duration | Deliverable                     |
|-------|--------------------------------|----------|---------------------------------|
| 1     | Requirements & Features        | 3 days   | Feature spec + wireframes       |
| 2     | Stack & Architecture           | 2 days   | Repo initialized + folder setup |
| 3     | Design System (CSS)            | 5 days   | Full component library in Storybook or plain HTML |
| 4     | Core UI Layout                 | 4 days   | Responsive shell + navigation   |
| 5     | JavaScript Logic               | 6 days   | Fully functional task CRUD      |
| 6     | PWA + Install Flow             | 4 days   | Installable + offline working   |
| 7     | Polish & Testing               | 5 days   | Production-ready, 100 Lighthouse|
| 8     | Deploy & Documentation         | 2 days   | Live URL + README               |

**Total MVP:** ~4–5 weeks (solo developer, part-time)

---

## How to Use This Plan

1. Download the full Markdown file using the button below.
2. Follow the stages sequentially.
3. Begin with Stage 3 (Design System) — the descriptions there give you everything needed to implement the refined light skeuomorphic aesthetic.

**Ready to build?** This plan is production-grade, extremely detailed, and designed specifically around the 2026 Light Skeuomorphism trend while delivering a delightful, installable task management experience.

---

*Document generated for ennead • February 2026*

**End of Plan**
