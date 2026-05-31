# TaskFlow Full-Stack Task Management Dashboard

A Kanban task management app built with React, Vite, Tailwind CSS, Node.js, Express, and Supabase PostgreSQL.

## Features

- Create, read, update, and delete tasks
- Drag cards between Todo, In Progress, and Completed columns
- Search tasks and filter by priority
- Due date and overdue indicators
- Animated dashboard stats
- REST API backed by Supabase PostgreSQL

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 18, Vite, Tailwind CSS |
| State/Data | TanStack React Query, Axios |
| UI | Framer Motion, Lucide React, @hello-pangea/dnd |
| Backend | Node.js, Express |
| Database | Supabase PostgreSQL |
| Validation | express-validator |

## Project Structure

```text
.
├── backend/
│   ├── config/
│   │   ├── schema.sql
│   │   └── supabase.js
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── package.json
│   └── server.js
├── src/
│   ├── api/tasksApi.js
│   ├── components/
│   └── pages/Dashboard.jsx
├── .env
└── package.json
```

## Local Setup

1. Run `backend/config/schema.sql` in the Supabase SQL Editor.
2. Create `backend/.env` from `backend/.env.example` and fill in `SUPABASE_URL` and `SUPABASE_SERVICE_KEY`.
3. Install and start the backend:

```bash
cd backend
npm install
npm run dev
```

4. Install and start the frontend from the repo root:

```bash
npm install
npm run dev
```

The frontend uses `VITE_API_URL=http://localhost:5000` from `.env`.

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/tasks` | Get all tasks |
| GET | `/tasks/:id` | Get one task |
| POST | `/tasks` | Create a task |
| PUT | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |
