# People Ops Dashboard

The React + TypeScript dashboard for People Operations teams. It highlights key employee metrics, supports nuanced roster management (filters, drawers, inline edits), and now ships with a fully typed mock API, TanStack Query caching layer, and bundle-aware optimisations. Perfect for portfolio demos or as a foundation for real backend integration.

## ✨ Highlights

- **Typed domain models** (`src/types/employee.ts`) covering employees, filters, stats, and trend points.
- **Mock data layer** (`src/services/employee-service.ts`) with asynchronous CRUD, simulated latency, auto-generated seed data, pagination metadata, and built-in analytics helpers (`src/utils/employee-analytics.ts`).
- **TanStack Query hook** (`src/hooks/use-employees.ts`) orchestrates infinite queries, optimistic mutations (add/delete/toggle/update), and exposes `loadMore` / `refresh` for a real-data feel.
- **Modern UI**: KPI hero, facet filters, search, inline salary editing, archiving drawer, and a lazily loaded Recharts “Team momentum” panel.
- **Bundle-aware build**: manual chunk splitting (React, Query, Recharts) + `React.lazy`/`Suspense` for heavy panels, eliminating the previous Vite size warning.
- **TypeScript-first tooling** with Vitest + Testing Library + happy-dom, ready for CI integration.

## 🛠️ Tech Stack

- React 19 + Vite 7
- TypeScript
- SCSS/CSS modules
- TanStack Query (React Query v5)
- Recharts
- Vitest + @testing-library/react + happy-dom
- Node ≥ 20.19

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev

# 3. Type-check the project
npx tsc --noEmit

# 4. Run unit tests
npm run test

# 5. Build for production
npm run build
```

## 📂 Project Structure

```
src/
├── app/                      # Root App component, routing of composed features
├── components/               # Feature-level UI (filters, info cards, lists, drawers, analytics)
├── hooks/                    # Custom hooks (TanStack Query adapter)
├── services/                 # Mock API + async stateful helpers
├── types/                    # TypeScript domain models
├── utils/                    # Analytics/stat helpers reused by service/hook
├── main.tsx                  # Entry point + QueryClient provider
└── index.css                 # Global theming and layout primitives
```

## ⚙️ Available Scripts

| Command            | Description                                   |
| ------------------ | --------------------------------------------- |
| `npm run dev`      | Start Vite in development mode                |
| `npm run build`    | Production bundle (manual chunks enabled)     |
| `npm run preview`  | Preview the production build                  |
| `npm run test`     | Vitest test suite (Testing Library + happy-dom)|
| `npx tsc --noEmit` | Type-check the project without emitting files |

## 📈 Future Enhancements

- Swap the mock service for a real REST/GraphQL backend (or MSW/json-server).
- Expand test coverage (more component cases, Playwright/Cypress for e2e).
- Introduce Storybook + design tokens to document the UI system.
- Set up CI (lint + type-check + test + build) via GitHub Actions.
- Add richer error handling and toast notifications for mutations.

## 📄 License

MIT — feel free to use and adapt for your own projects. A shout-out is always appreciated if you showcase it in a portfolio! 😊
