# Bank Ledger — Frontend

React + Tailwind frontend for a double-entry ledger banking backend. Built to practice real-world frontend patterns: protected routing, global auth state, form validation, and API integration.

## Live Demo
- App: https://bank-frontend-peach.vercel.app
- Backend API: https://bank-ledger-backend-0bzh.onrender.com
- Backend repo: https://github.com/AADITYA-WORLD/bank-ledger-backend

## Features

- JWT cookie-based authentication (login, register, logout)
- Protected routes (redirect to login if not authenticated)
- Role-based route access (admin-only pages)
- Live balance dashboard with one-time bonus claim
- Send money flow — recipient lookup by email, confirmation step, idempotent transfers
- Paginated transaction history with credit/debit direction
- Admin panel — transfer from the system reserve account to any user
- Fully responsive — collapsible sidebar navigation on mobile

## Tech Stack

- React (Vite)
- Tailwind CSS
- React Router
- React Hook Form
- Axios
- react-hot-toast
- lucide-react

## Getting Started

1. Install dependencies:

npm install

2. Copy `.env.example` to `.env` and set `VITE_API_URL` to your backend URL.
3. Run the dev server:

npm run dev


## Folder Structure

src/
├── api/ # Axios instance + API call functions, grouped by resource
├── components/ # Reusable UI (Navbar, ProtectedRoute)
├── context/ # AuthContext - global auth state
├── pages/ # Route-level pages


## Notes

This is a companion frontend to a [double-entry ledger backend](https://github.com/AADITYA-WORLD/bank-ledger-backend) — see that repo for details on how balances are derived from ledger entries rather than stored directly.