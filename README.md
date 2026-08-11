# Helpdesk Ticketing System

Built with Express.js, React, TypeScript, and PostgreSQL, Docker.

## Stack

- Backend: Express.js, TypeScript, PostgreSQL, Zod
- Frontend: React, TypeScript, Vite, TanStack Query, Zod
- Infrastructure: Docker Compose for the backend and database

## Run the backend and database

```bash
docker compose up --build
```

For local backend development outside Docker, copy `backend/.env.example` to
`backend/.env` and update the values if needed. For frontend configuration,
copy `frontend/.env.example` to `frontend/.env.local`.

## Run the frontend

```bash
cd frontend
pnpm install
pnpm dev
```

Open <http://localhost:5173>. The page calls the backend API and displays its response.

## Run checks

```bash
cd backend && pnpm install && pnpm build
cd ../frontend && pnpm install && pnpm build
```

## API Routes

The backend runs on <http://localhost:3000>.

| Method | Route | Response |
| --- | --- | --- |
| `GET` | `/api/hello` | `{ "message": "Hello from the Helpdesk API!" }` |
| `GET` | `/api/health` | `{ "status": "ok" }` |

Example:

```bash
curl http://localhost:3000/api/hello
```
