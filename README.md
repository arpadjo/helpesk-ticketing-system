# Helpdesk Ticketing System

Built with Express.js, React, TypeScript, and PostgreSQL, Docker.

## Stack

- Backend: Express.js, TypeScript, PostgreSQL, Prisma, Zod
- Frontend: React, TypeScript, Vite, TanStack Query, Zod
- Infrastructure: Docker Compose for the backend and database

## Prerequisites

- Docker Desktop with Docker Compose
- Node.js 20 or newer
- pnpm 10 or newer

Check the installed tools:

```bash
docker --version
docker compose version
node --version
pnpm --version
```

## Recommended: run the application

Start PostgreSQL and the backend from the project root:

```bash
docker compose up --build
```

This command starts:

- PostgreSQL at `localhost:5432`
- The backend at `http://localhost:3000`
- Prisma migrations automatically before the backend starts

In a second terminal, start the frontend:

```bash
cd frontend
pnpm install
pnpm dev
```

Open <http://localhost:5173/tickets>.

Stop the application with `Ctrl+C`, or run:

```bash
docker compose down
```

To remove the PostgreSQL data volume as well, use the following destructive
command:

```bash
docker compose down -v
```

## Local backend development

Use this workflow when running the backend directly instead of in Docker. You
still need PostgreSQL running on `localhost:5432`.

```bash
cd backend
pnpm install
cp .env.example .env
pnpm prisma:migrate:deploy
pnpm dev
```

The frontend can run at the same time in a separate terminal:

```bash
cd frontend
pnpm install
cp .env.example .env.local
pnpm dev
```

When changing `backend/prisma/schema.prisma`, create a migration from the
`backend` directory:

```bash
pnpm prisma:migrate:dev --name describe-your-change
```

Prisma client generation runs automatically before `pnpm dev` and `pnpm build`.
To run it manually:

```bash
pnpm prisma:generate
```

Frontend routes:

- `/tickets` — ticket list with search, status filtering, sorting, and pagination
- `/tickets/new` — create a ticket
- `/tickets/:id` — view, edit, delete, and comment on a ticket

## Run checks

```bash
cd backend && pnpm install && pnpm build
cd ../frontend && pnpm install && pnpm build
```

## API Routes

The backend runs on <http://localhost:3000/api/v1>.

| Method | Route | Response |
| --- | --- | --- |
| `GET` | `/api/v1/health` | `{ "status": "ok" }` |

### Tickets

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/api/v1/tickets` | List tickets with filtering, sorting, and pagination |
| `GET` | `/api/v1/tickets/:id` | Get one ticket, including comments |
| `POST` | `/api/v1/tickets` | Create a ticket |
| `PATCH` | `/api/v1/tickets/:id` | Update one or more ticket fields |
| `DELETE` | `/api/v1/tickets/:id` | Delete a ticket |
| `POST` | `/api/v1/tickets/:id/comments` | Add a comment to a ticket |

Create a ticket with:

```json
{
  "title": "Laptop cannot connect to Wi-Fi",
  "description": "The connection drops every few minutes.",
  "user": "Alex Morgan"
}
```

Supported list query parameters:

- `page` — page number, default `1`
- `pageSize` — results per page, default `10`, maximum `100`
- `status` — `open`, `in_progress`, `resolved`, or `closed`
- `search` — searches title, description, and user
- `sortBy` — `ticketNumber`, `title`, `status`, `createdAt`, or `updatedAt`
- `sortOrder` — `asc` or `desc`, default `desc`

Example:

```text
GET /api/v1/tickets?status=open&search=wifi&page=1&pageSize=10&sortBy=createdAt&sortOrder=desc
```

The list response has this shape:

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "total": 0,
    "totalPages": 0
  }
}
```
