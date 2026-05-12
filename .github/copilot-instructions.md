# Split It Right — AI Coding Instructions

> **This file is the single source of truth for any AI coding assistant working on this project.**
> All AI agents (Cursor, GitHub Copilot, Cline, Windsurf, Claude Code, OpenAI Codex, Gemini Code Assist, etc.) MUST follow these rules.

---

## 1. Project Overview

**Split It Right** is a shared expense-tracking web application.

| Layer      | Tech                   | Location       | Port  |
|------------|------------------------|----------------|-------|
| Frontend   | React 19 + Vite 8      | `client/`      | 3000  |
| Backend    | Express.js 4           | `server/`      | 4000  |
| Database   | PostgreSQL 15 + Prisma | `db/`          | 5432  |
| Dev Env    | Docker Compose 3.9     | root           | —     |

---

## 2. Architecture & Directory Structure

```
cpit405project/
├── client/                     # React frontend (Vite)
│   ├── src/
│   │   ├── api/                # HTTP client modules (one file per resource)
│   │   │   ├── axios.js        # Shared Axios instance — ALL requests go through this
│   │   │   ├── auth.js         # /auth/* endpoints
│   │   │   └── profile.js      # /profile endpoint
│   │   ├── assets/             # Static assets (images, icons, fonts)
│   │   ├── components/         # Reusable UI components
│   │   │   └── Layout.jsx      # App shell (header, nav, footer, <Outlet/>)
│   │   ├── pages/              # Route-level page components
│   │   ├── routes/             # React Router configuration
│   │   ├── store/              # Redux Toolkit state
│   │   ├── App.jsx             # Root component
│   │   ├── main.jsx            # Entry point
│   │   └── index.css           # Tailwind v4 + design tokens
│
├── server/                     # Express.js backend
│   ├── prisma/
│   │   └── schema.prisma       # Prisma Schema (Single Source of Truth)
│   └── src/
│       ├── app.js              # Entry — middleware, routes, error handlers
│       ├── configs/
│       │   ├── prisma.js       # Prisma Client instance — USE THIS FOR DB
│       │   └── swagger.js      # Swagger/OpenAPI config
│       ├── controllers/        # Route handler functions (using Prisma)
│       ├── middlewares/
│       │   └── authMiddleware.js  # JWT verifyToken
│       └── routes/
│           ├── index.js        # Central router (/v1/api/*)
│           └── ...             # Resource routes
│
├── db/
│   └── init.sql                # Initial DDL (for Docker initialization)
│
├── .env                        # Environment variables (inc. DATABASE_URL)
└── docker-compose.yml
```

---

## 3. Tech Stack & Versions

### Frontend
- **React** 19, **Vite** 8, **Tailwind CSS v4**
- **Redux Toolkit**, **React Router DOM** v7, **Axios**
- **Lucide React**, **Radix UI** primitives

### Backend
- **Express.js** 4 (CommonJS)
- **Prisma ORM** — **MANDATORY** for all database operations
- **PostgreSQL** 15
- **bcryptjs**, **jsonwebtoken**, **morgan**, **swagger-jsdoc**

---

## 4. Coding Conventions

### 4.1 General
- Use **English** for all code, comments, and commit messages.
- Prefer **functional programming** patterns; avoid classes.
- Keep files **focused** — one component/controller per file.

### 4.2 Backend (Express.js + Prisma)

| Rule | Convention |
|------|-----------|
| Database Access | **Always use Prisma.** Import `prisma` from `src/configs/prisma.js`. |
| Raw SQL | **Forbidden.** Only use `prisma.$queryRaw` if a query is impossible with the fluent API. |
| Models | No separate Model files needed. Prisma provides the API directly based on `schema.prisma`. |
| Schema Changes | Modify `server/prisma/schema.prisma` then run `npx prisma generate`. |
| Error Handling | Catch Prisma errors and return appropriate status codes (e.g., 404 for missing records). |
| Auth | JWT Bearer tokens. Middleware `verifyToken` sets `req.user = { id, email }`. |

---

## 5. API Contract

**Base URL**: `http://localhost:4000/v1/api`

| Method | Endpoint           | Auth   | Description              |
|--------|--------------------|--------|--------------------------|
| GET    | `/health`          | No     | Health check             |
| POST   | `/auth/register`   | No     | Register new user        |
| POST   | `/auth/login`      | No     | Login, returns JWT       |
| GET    | `/profile`         | JWT    | Get current user profile |

---

## 6. Adding New Features — Step by Step

### Adding a new Database Entity
1. **Schema** — Add the model to `server/prisma/schema.prisma`.
2. **Generate** — Run `npx prisma generate` to update the client.
3. **Controller** — Create `server/src/controllers/<resource>Controller.js` using `prisma.<model>`.
4. **Route** — Create `server/src/routes/<resource>Routes.js`.
5. **Register** — Mount in `server/src/routes/index.js`.
6. **Client API** — Create `client/src/api/<resource>.js`.

---

## 7. Environment Variables

| Variable              | Description                                      |
|-----------------------|--------------------------------------------------|
| `DATABASE_URL`        | **REQUIRED** for Prisma. Use localhost for dev. |
| `JWT_SECRET`          | Secret for signing JWTs                          |
| `VITE_API_URL`        | Backend API base URL                             |

---

## 8. Critical Rules — DO NOT VIOLATE

1. **NEVER use raw SQL strings.** Always use Prisma ORM.
2. **NEVER import `axios` directly** in React components. Use `apiClient`.
3. **NEVER store passwords in plaintext.** Always use `bcryptjs`.
4. **NEVER commit `.env`** to git.
5. **ALWAYS run `npx prisma generate`** after any schema changes.
6. **ALWAYS use the shared Prisma instance** from `src/configs/prisma.js`.

---

## 9. Code Style Quick Reference

```javascript
// ✅ Correct Backend Controller using Prisma
const prisma = require('../configs/prisma');

/**
 * @desc   Get all expenses for a user
 * @route  GET /v1/api/expenses
 */
const getExpenses = async (req, res) => {
  try {
    const expenses = await prisma.expense.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json({ data: expenses });
  } catch (error) {
    console.error('[Expense] Fetch error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
```

```prisma
// ✅ Correct Prisma Model Example
model Expense {
  id        Int      @id @default(autoincrement())
  amount    Decimal  @db.Decimal(10, 2)
  note      String?
  userId    Int
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
}
```
