# People Ops Dashboard

The React dashboard for People Operations teams. It surfaces core employee metrics, highlights top performers, and lets you triage your roster with modern UX patterns (filters, drawers, analytics). The current build ships with a fully typed mock API, lazy-loaded pagination, and a consistent visual system ready for portfolio demos or future backend integration.

## ✨ Highlights

- **Typed domain models** (`src/types/employee.ts`) for employees, stats, filters, and trends.
- **Mock data service** (`src/services/employee-service.ts`) with async CRUD, simulated latency, auto-generated seed data, and analytics out of the box.
- **Reusable data hook** (`src/hooks/use-employees.ts`) that centralises fetching, optimistic updates, pagination (`loadMore`), and error/loading states.
- **Modern UI**: hero metrics, facet filters, search, inline editing, detail drawer with archiving, and a Recharts-powered “Team momentum” insight.
- **Light/Dark themes** shared across the component library with smooth transitions.
- **TypeScript-first tooling** (tsconfig, Vitest + Testing Library + happy-dom) for a professional developer experience.

## 🛠️ Tech Stack

- React 19 + Vite
- TypeScript
- SCSS/CSS modules
- Recharts (analytics)
- Vitest + Testing Library + happy-dom
- npm (Node ≥20.19 recommended)

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev

# 3. Run the type checker
npx tsc --noEmit

# 4. Execute unit tests
npm run test

# 5. Production build
npm run build
```

> **Note:** Vite warns when running on Node 20.18.x. Upgrade to Node ≥20.19 (or 22.12+) for full compatibility.

## 📂 Project Structure

```
src/
├── app/                      # Root app shell (dashboard layout + wiring)
├── components/               # Feature components (filters, info cards, list, modals, forms)
├── hooks/                    # Custom hooks (useEmployees)
├── services/                 # Mock API + stateful payload logic
├── types/                    # TypeScript domain models
├── utils/                    # Analytics helpers (stats/trend builders)
├── main.tsx                  # Entry point
└── index.css                 # Theming, layout primitives
```

## ⚙️ Available Scripts

| Command            | Description                              |
| ------------------ | ---------------------------------------- |
| `npm run dev`      | Start Vite in development mode           |
| `npm run build`    | Production bundle with Vite              |
| `npm run preview`  | Preview the production build             |
| `npm run test`     | Vitest (+ Testing Library) test runner   |
| `npx tsc --noEmit` | Check TypeScript types without emitting  |

## 📈 Future Enhancements

- Swap the mock service for a real REST/GraphQL backend (or mock with MSW/json-server).
- Layer in TanStack Query for smarter caching + background refetches.
- Expand test coverage (more component cases, Playwright/Cypress for e2e).
- Introduce Storybook + design tokens to document the component system.
- Address bundle warnings via code-splitting or dynamic imports.
- Wire a CI pipeline (lint + typecheck + test + build) on GitHub Actions.

## 📄 License

MIT — feel free to use and adapt for your own projects. If you showcase it in a portfolio, a shout-out is always appreciated!
