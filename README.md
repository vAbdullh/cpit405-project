# React + Express + Docker Template

A simple full-stack starter project using:
- React (frontend)
- Express (backend)
- Docker Compose (full environment)
- SQL init script for database setup

---
## Project Structure

- client/ → React app
- server/ → Express API
- db/ → Database initialization script
- docker-compose.yml → Docker Compose file

---

## Getting Started (Local Development)

### 1. Environment Variables

- Copy .env.example to .env for both client and server
- Fill in the required values
```bash
cp .env.example .env
```


### 2. Frontend (React)
```bash
cd client
npm install
npm start
```
Runs on: http://localhost:3000

---

### 3. Backend (Express)
```bash
cd server
npm install
npm run dev
```

Runs on: http://localhost:4000


## Run with Docker
```bash
docker compose up --build

# Stop
docker compose down
```

---

## Database

Automatically initialized from:
db/init.sql

---


