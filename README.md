## College Event Management (MERN + AI Recommendations)

This is a **complete MERN stack College Event Management web application** with:

- **Student role**: browse, register, track events, get recommendations
- **Society/Club admin role**: create/manage events, view registrations
- **AI-powered recommendations**: simple scoring-based recommendations using interests and history

### Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Context API, React Router
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT Authentication

### Monorepo Structure

- `backend/` – Express API, MongoDB models, auth, events, registrations, recommendations
- `frontend/` – React SPA with Tailwind, pages, components, and contexts

### Getting Started (High Level)

1. Install dependencies:
   - `cd backend && npm install`
   - `cd ../frontend && npm install`
2. Configure environment:
   - Copy `backend/.env.example` to `.env` and fill in values.
3. Run:
   - Backend: `cd backend && npm run dev`
   - Frontend: `cd frontend && npm run dev`

Detailed configuration is in each subfolder.

