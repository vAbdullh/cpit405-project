# React + Express + Docker Template

A simple full-stack starter project using:
- React (frontend)
- Expressjs (backend API)
- Docker Compose (full environment)
- SQL init script for database setup

---
## Project Structure

- client/ → React app
- server/ → Expressjs API
- db/ → Database initialization script
- docker-compose.yml → Docker Compose file

---

## Getting Started (Local Development)

### 1. Environment Variables

- Copy .env.example to .env for both client and server
- Fill in the required values
For docker it is enough to copy .env.example to .env
```bash
cp .env.example .env
```
For run it manually:
Copy the each part - identify by commnets # client part, # server part:
- Client part: /client/.env
- Server part: /server/.env


### 2. Frontend (React)

Dependancies :
- [Nodejs 20 or higher](https://nodejs.org/en/download/)
- [Npm](https://docs.npmjs.com/getting-started)
> [!TIP]
> If you don't have npm installed, yout node installation is broken or npm is not in your PATH

```bash
cd client
npm install
npm run dev
```
Runs on: http://localhost:3000

---

### 3. Backend (Expressjs)
Dependancies :
- [Nodejs 22 or higher](https://nodejs.org/en/download/)
- [Npm](https://docs.npmjs.com/getting-started)

```bash
cd server
npm install
npm run dev
```

Runs on: http://localhost:4000


## Alternative: Run with Docker
```bash
docker compose up --build

# Stop
docker compose down
```

### pgAdmin (Database Management)
When running with Docker, you can access the database management panel:
- **URL**: [http://localhost:5050](http://localhost:5050)
- **Auto-login**: Enabled (takes you directly to the dashboard)
- **Configuration**: Pre-connected to the `db` service.

---

## Database

Automatically initialized from:
db/init.sql

---


