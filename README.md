# Product Admin Dashboard

## Overview
This dashboard is a lightweight admin interface for managing DummyJSON products. It includes authentication, product listing, search, category filters, sorting, pagination, product details, and basic create/edit/delete flows.

## Tech Stack
- Next.js
- React
- Tailwind CSS
- Axios
- DummyJSON

## Features
- Login flow with token storage
- Protected routes for product pages
- Responsive table/card layout
- Search with debounce
- Category filter and sort controls
- Manual pagination with URL-backed state
- Product details page and CRUD actions
- Local persistence for client-side mock mutations
- Loading, empty, and error states

## Setup
```bash
npm install
npm run dev
```
Open http://localhost:3000

## Login Credentials
- Username: emilys
- Password: emilyspass

## API
This app uses the DummyJSON API at https://dummyjson.com. All requests are routed through a single Axios instance in the lib folder so the logic stays centralized and easy to explain.

## Architecture
- components: UI elements such as forms, cards, navbars, tables, and dialogs
- services: API logic for auth and product operations
- context: auth and local product state providers
- lib: shared Axios instance and request configuration
- utils: validation and pagination helpers

## Important Design Decisions
1. Search + category limitation
   DummyJSON does not support combining search and category in a single request. The app uses the search endpoint when a search is active and the category endpoint when a category is selected. When both are active together, it filters the result set on the client after fetching the relevant data.

2. Debounced search
   Search input is delayed by about 400ms so the user is not spammed with API calls while typing.

3. Request cancellation/race condition
   Older search requests are cancelled before triggering a new one. This prevents stale results from replacing newer results.

4. URL state
   Important state like page, limit, category, search, and sort is kept in the URL so the app can reload or a URL can be shared to reproduce the same view.

5. Local CRUD persistence
   DummyJSON is read-only for permanent storage, so created, updated, and deleted product changes are reflected in lightweight client-side storage during the browser session.

6. Invalid URL handling
   The app normalizes malformed page and limit values so invalid query parameters do not crash the dashboard.

## DummyJSON CRUD Limitation
DummyJSON simulates mutation endpoints but does not permanently persist create, update, or delete results. To keep the UI consistent during the current session, the app stores local product changes and merges them with fresh API data. This keeps created products visible, updated values accurate, and deleted items hidden until the browser session ends.

## Challenges and Solutions
One realistic challenge was the search race condition: if request A was slower than request B, the older response could overwrite the newer one. The solution was to cancel prior Axios searches when a new query began and to ignore canceled requests before updating the UI.

## AI Usage
AI assistance was used to accelerate scaffolding, component generation, and issue debugging while keeping the implementation understandable and aligned to the assignment requirements.
