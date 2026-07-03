---
name: rpam-frontend
description: "Use this skill whenever writing, editing, or reviewing frontend code for the RPAM (Rencana Pengamanan Air Minum) application — a React + Vite + Redux Toolkit + Tailwind app consuming the RPAM Express backend. Trigger this for ANY task touching the fe/ folder — creating or editing React components, pages, Redux slices/thunks, routes, Axios API calls; applying colors/theme/styling; writing Vitest unit or Redux tests; writing Cypress e2e tests; or creating a new git branch for this project. Do not skip this skill even for small UI tweaks — it encodes the design system, component reusability rules, Redux conventions, and mandatory testing rules that must not be violated. Pairs with the rpam-backend skill; use both together when a task spans full-stack."
---

# RPAM Frontend Skill

Reference for all frontend work on the RPAM app. Read this before writing any component, slice, route, or style in this project.

## 1. Project Summary

RPAM frontend is the client for a drinking-water safety-plan management system: hazard identification → risk assessment → risk review → improvement plans → operational monitoring. Two roles: Admin and User (see rpam-backend §3 for RBAC matrix). ~20 active users max — keep it simple, no over-engineering.

**Stack:** React + Vite, Redux Toolkit, Axios, React Router, Tailwind CSS. Testing: Vitest + React Testing Library (unit/component/Redux), Cypress (integration/e2e).

## 2. Folder Structure (do not change without instruction)

Feature-based, mirrors the backend module split:

```
fe/
 ┣ src/
 ┃ ┣ api/
 ┃ ┃ ┣ axiosClient.js        (Axios instance + JWT interceptor)
 ┃ ┃ ┗ endpoints.js          (base URL path constants)
 ┃ ┣ app/
 ┃ ┃ ┣ store.js              (Redux store config)
 ┃ ┃ ┗ rootReducer.js
 ┃ ┣ components/
 ┃ ┃ ┣ common/               (reusable primitives: Button, Input, Select, Modal, Table, Badge, Pagination, Toast, RiskLevelBadge, ConfirmDialog, EmptyState, Spinner)
 ┃ ┃ ┗ layout/               (Sidebar, Navbar, ProtectedRoute, GuestRoute, DashboardLayout)
 ┃ ┣ features/
 ┃ ┃ ┣ auth/
 ┃ ┃ ┣ users/
 ┃ ┃ ┣ audit-log/
 ┃ ┃ ┣ identifikasi-bahaya/
 ┃ ┃ ┣ penilaian-risiko/
 ┃ ┃ ┣ kaji-ulang/
 ┃ ┃ ┣ rencana-perbaikan/
 ┃ ┃ ┣ pemantauan/
 ┃ ┃ ┗ dashboard/
 ┃ ┣ hooks/                  (useAuth, usePagination, useDebounce, etc.)
 ┃ ┣ pages/                  (route-level composition, thin — delegate to features/components)
 ┃ ┣ router/
 ┃ ┃ ┗ routes.jsx
 ┃ ┣ styles/
 ┃ ┃ ┗ theme.css              (Tailwind theme tokens, see §4)
 ┃ ┣ utils/
 ┃ ┣ App.jsx
 ┃ ┗ main.jsx
 ┣ cypress/
 ┃ ┣ e2e/                    (one spec file per Test Scenario, see §8)
 ┃ ┣ fixtures/
 ┃ ┗ support/
 ┣ vite.config.js
 ┣ tailwind.config.js
 ┣ .env
 ┣ .env.example
 ┗ package.json
```

Each `features/<module>/` folder follows:
```
<module>/
 ┣ <module>Slice.js      (Redux Toolkit slice + createAsyncThunk calls)
 ┣ <module>Api.js        (Axios calls for this module only)
 ┣ components/           (module-specific components, e.g. IdentifikasiBahayaForm, IdentifikasiBahayaTable)
 ┗ <module>Slice.test.js (Vitest — see §8)
```
Before creating a new component or slice, check `components/common/` and existing `features/` first — reuse instead of duplicating.

## 3. Component Reusability Rules (hard rule)

- Every component in `components/common/` must be **prop-driven and business-logic-free** — no direct API calls, no `useSelector`/`useDispatch` tied to a specific feature, no hardcoded module-specific text.
- Prefer composition (`children`) over configuration flags when a component's shape varies a lot.
- If two features need visually-identical UI (e.g. a data table with search/filter/sort/pagination — required on every module per backend NFR-31), build **one** shared component (`components/common/DataTable.jsx`) and pass columns/data/handlers as props. Do not copy-paste table markup per module.
- Module-specific components (forms, module-only widgets) live in `features/<module>/components/`, not in `components/common/`.
- Every reusable component should work with just its required props and sane defaults — no required context/provider beyond Redux and Router.

## 4. Design System / Theme

Keep it **simple and clean** — light background, generous whitespace, rounded corners, minimal shadows. One brand color (water/trust) + a fixed semantic palette for risk levels that must **exactly match the backend risk levels** (rpam-backend §5, M2).
dan untuk pagination buat jadi infinite scroll.
**Tailwind theme tokens** (put in `tailwind.config.js` under `theme.extend.colors`):

```js
colors: {
  brand: {
    50:  '#f0fdfa',
    100: '#ccfbf1',
    500: '#14b8a6',   // teal — primary brand color (water)
    600: '#0d9488',
    700: '#0f766e',   // primary buttons, active nav, links
    900: '#134e4a',
  },
  neutral: {
    50:  '#f8fafc',   // page background
    100: '#f1f5f9',   // card/section background
    200: '#e2e8f0',   // borders
    500: '#64748b',   // secondary text
    700: '#334155',   // body text
    900: '#0f172a',   // headings
  },
  risk: {
    rendah:       '#22c55e', // green-500
    medium:       '#3b82f6', // blue-500
    tinggi:       '#f97316', // orange-500
    sangatTinggi: '#eab308', // yellow-500
    ekstrem:      '#ef4444', // red-500
  },
  status: {
    success: '#16a34a',
    error:   '#dc2626',
    warning: '#d97706',
    info:    '#2563eb',
  },
}
```

> **Kenapa teal, bukan biru, untuk brand color:** biru sudah dipakai sebagai warna semantic untuk risk level "Medium". Kalau brand color juga biru, badge risiko dan tombol/nav utama jadi susah dibedakan sekilas. Teal dipilih karena masih terasa "air/trust" tapi visually distinct dari palet risiko. **Ini keputusan desain, bukan dari requirement — sah untuk diganti kalau user/product owner punya preferensi warna lain.**

**Rules:**
- `risk.*` colors **wajib** dipakai lewat satu komponen `<RiskLevelBadge level="Tinggi" />` di `components/common/` — jangan hardcode warna risiko di tempat lain. Mapping level→warna di komponen ini harus identik dengan helper `getRiskLevel()` di backend (rpam-backend §5).
- Typography: system sans-serif via Tailwind default (`font-sans`). Headings `font-semibold`, body `font-normal`. Base size `text-sm`/`text-base`, avoid more than 3 heading sizes (`text-lg`, `text-xl`, `text-2xl`).
- Buttons: solid `brand-700` for primary actions, outline/neutral for secondary, `status.error` for destructive (delete) actions — always paired with a confirm dialog (see `ConfirmDialog` in common components).
- Cards/tables: `neutral-100` background, `neutral-200` border, `rounded-lg`, `shadow-sm` (avoid heavy shadows — keep it flat/minimal).
- Dark mode: **not required** unless the user asks — don't build it speculatively.

## 5. Redux Conventions

- One slice per feature module (`features/<module>/<module>Slice.js`) using **Redux Toolkit** `createSlice` + `createAsyncThunk`. No plain `redux` boilerplate (no manual action types/reducers switch).
- Async calls go through `<module>Api.js` (thin Axios wrapper) — thunks call the API module, never call Axios directly inline in the slice.
- Slice state shape convention: `{ items: [], selected: null, status: 'idle' | 'loading' | 'succeeded' | 'failed', error: null, pagination: { page, pageSize, total } }`. Keep this shape consistent across modules so `DataTable`/`Pagination` common components can consume any slice the same way and make infinite scroll.
- Auth state (`features/auth/authSlice.js`) holds `{ user, token, isAuthenticated, status, error }`. Token also persisted for axios interceptor use (in-memory + rehydrate from storage at app boot — never put secrets in Redux devtools-exposed logs in production).
- Selectors: export named selectors from each slice file (`selectUsers`, `selectUsersStatus`) instead of inlining `state.users.items` across components.
- Do not put derived/computed values (e.g. formatted dates, risk level strings) in Redux state — compute them in selectors or components. Redux stores raw API data only.

## 6. API Layer

- Single Axios instance (`api/axiosClient.js`) with base URL from `.env` (`VITE_API_BASE_URL`).
- Request interceptor attaches `Authorization: Bearer <token>` from Redux/auth state.
- Response interceptor: on `401`, dispatch logout and redirect to `/login` — **no refresh-token queue logic**, because the backend issues a single 24h JWT with no refresh flow (rpam-backend §4). Don't build refresh-queue interceptor patterns from other projects here — they don't apply.
- Every API response follows the backend shape `{ success, message, data }` (rpam-backend §8) — always unwrap `data` in the thunk, never leak the raw response shape into slice state.

## 7. Routing & RBAC

- `router/routes.jsx` defines routes; wrap protected routes in `<ProtectedRoute>` (redirects to `/login` if not authenticated) and role-gated routes additionally check `user.role` (e.g. `/users`, `/audit-log` are Admin-only — see rpam-backend §3 RBAC table).
- Guest-only routes (`/login`) wrapped in `<GuestRoute>` (redirects authenticated users to dashboard).
- Sidebar/nav items are filtered by role — don't just hide via CSS, don't render Admin-only links for a `User` role at all.

## 8. Testing (wajib per fitur)

Two layers, both required — mirrors rpam-backend §11's mapping to the same Test Plan (TS-01–TS-15):

### 8a. Vitest — unit & Redux tests
- Every slice (`<module>Slice.test.js`) must test: initial state, each reducer/extraReducer transition (pending/fulfilled/rejected), and selectors.
- Every `components/common/` component gets a render test (React Testing Library) covering its main prop variations (e.g. `RiskLevelBadge` renders correct color/label for all 5 levels — mirrors rpam-backend §5's `getRiskLevel` cases).
- Mock Axios (e.g. `vi.mock`) — Vitest tests never hit a real backend.
- Run via `npm run test` (Vitest), config in `vite.config.js` (`test` block) or a separate `vitest.config.js`.

### 8b. Cypress — integration/e2e tests
- Located in `cypress/e2e/`, **one spec file per Test Scenario** from the Test Plan, named to match: `TS-01-login.cy.js`, `TS-04-identifikasi-bahaya.cy.js`, etc.
- Each spec covers its Test Cases (TC-xx) end-to-end against a running app (real or test backend) — e.g. `TS-01-login.cy.js` must include TC-01 (login sukses), TC-02 (password salah), TC-03 (username tidak ditemukan), TC-04 (field kosong), TC-05 (logout).
- Name individual `it()` blocks with the TC id, e.g. `it('TC-24: Peluang=3 Dampak=4 → Skor=12', () => {...})`.
- Cover RBAC scenarios (TS-15) with two logged-in states (Admin session, User session) — use `cy.session()` or a custom login command per role, don't re-type login steps in every spec.
- Full mapping table (module → TS-xx → cases) is identical to rpam-backend §11 — reuse it, don't re-derive it.

**Definition of done for any FE feature:** component/slice built following §3–§7 **and** has both a Vitest test (§8a) and a Cypress spec covering its Test Scenario (§8b). Don't mark a feature complete without both.

## 9. Git Branch Naming Convention

Same convention as rpam-backend: `{github-username}-{action}` (e.g. `nofa-feat`, `nofa-fix`), optionally extended with `-{deskripsi-singkat-kebab-case}` for clarity (e.g. `nofa-feat-risk-badge-component`).

## 10. Hard AI Rules (jangan dilanggar)

- Jangan ubah struktur folder tanpa instruksi eksplisit.
- Jangan hapus kode yang sudah ada.
- Jangan tambah library baru kalau fungsi bisa diselesaikan dengan library yang sudah dipilih (§1 stack) — khususnya jangan tambah RTK Query, styled-components, atau UI kit lain tanpa diminta.
- Komponen di `components/common/` wajib reusable & bebas business logic (§3) — kalau ada logic spesifik modul, taruh di `features/<module>/components/`.
- Warna risk level wajib lewat `RiskLevelBadge` dan wajib sinkron dengan backend `getRiskLevel()` (§4, §5) — jangan hardcode hex/nama warna risiko di komponen lain.
- Redux state per modul wajib ikut shape konsisten di §5 supaya `DataTable`/`Pagination` bisa dipakai lintas modul.
- Jangan bikin refresh-token interceptor — backend cuma pakai token tunggal 24 jam (§6).
- Setiap fitur baru wajib punya Vitest test (unit/slice/component) **dan** Cypress spec yang mapping ke Test Scenario (§8) — tidak dianggap selesai tanpa keduanya.
- Kalau requirement/desain tidak jelas: tulis asumsi di komentar/dokumentasi (contoh: §4 soal brand color), jangan mengarang perilaku sistem sendiri.
- Sebelum bikin file/komponen baru, cek dulu apakah sudah ada yang serupa di `components/common/` atau modul lain, reuse polanya.
- Kode harus lolos ESLint tanpa warning baru, dan tidak ada console error.
- Gunakan tailwind css.