# Frontend Routes and Components

## Routes
- **/login**
  - Component: `src/pages/Auth/Login.jsx`
  - Public route. Redirects to `/dashboard` if already authenticated via `AuthContext`.
  - Button redirects to backend Google OAuth: `${VITE_API_URL || 'http://localhost:3001'}/api/auth/google`.

- **/dashboard**
  - Component: `src/pages/Dashboard/Dashboard.jsx`
  - Protected route.
  - Fetches metrics from `GET /api/analytics/dashboard` using `AnalyticsService`.
  - Renders `MetricsCard`, `ProgressChart` (Chart.js), and `RecentActivity`.

- **/students**
  - Component: `src/pages/Students/Students.jsx`
  - Protected route.
  - Placeholder to list students via components in `src/components/students/*`.

- **/courses**
  - Component: `src/pages/Courses/Courses.jsx`
  - Protected route.

- **/assignments**
  - Component: `src/pages/Assignments/Assignments.jsx`
  - Protected route.

## Routing Structure
- `src/App.jsx`
  - Wraps protected sections in `ProtectedRoute` which checks `AuthContext`.
  - Layout: `Header` + `Sidebar` + `Outlet` for page content.
  - Redirects unknown paths to `/dashboard`.

## Authentication
- `src/context/AuthContext.jsx`
  - Provides `{ user, loading, refresh, logout }` from `useAuth` hook.

- `src/hooks/useAuth.js`
  - Loads current user from `GET /api/auth/me` on mount (with credentials).
  - Exposes `refresh()` and `logout()` which POSTs to `/api/auth/logout`, clears user.

- `src/components/common/Header.jsx`
  - Shows app title linking to `/dashboard`.
  - If authenticated, shows "Cerrar sesión" which calls `logout()` and navigates to `/login`.

- `src/components/common/Sidebar.jsx`
  - Uses `NavLink` for `/dashboard`, `/students`, `/courses`, `/assignments`.

## Dashboard Components
- `src/components/dashboard/MetricsCard.jsx`
  - Displays a title, value and optional subtitle.

- `src/components/dashboard/ProgressChart.jsx`
  - Integrates Chart.js via `react-chartjs-2`.
  - Props: `title`, `labels`, `data`.
  - Renders a Line chart or an empty state when there is no data.

- `src/components/dashboard/RecentActivity.jsx`
  - Placeholder for a recent activity list.

## Services
- `src/services/api.js`
  - `apiFetch(path, options)`: Prefixes with `VITE_API_URL` or `http://localhost:3001`, sends credentials, throws on non-OK.

- `src/services/auth.service.js`
  - `me()`: `GET /api/auth/me`
  - `logout()`: `POST /api/auth/logout`

- `src/services/analytics.service.js`
  - `dashboard()`: `GET /api/analytics/dashboard`

## Notes
- Ensure env var `VITE_API_URL` points to the backend origin to allow cookie-based auth (httpOnly) with `credentials: 'include'`.
- All protected pages rely on `ProtectedRoute` which will redirect to `/login` if there is no active session.
