
# Challenge — Notes App (Full‑Stack)

A simple full-stack **Notes** application with **tags & filtering**.  
Single Page Application (**React + Vite + TypeScript**) talking to a **Spring Boot** REST API (**Java 21, JPA/Hibernate**) with **MySQL 8** for persistence.  
Production runtime is dockerized (DB + API + SPA), served via **Nginx**.

---

## Features
- Create, edit, delete notes
- Archive / unarchive notes
- Create categories (tags), add/remove to notes
- Filter notes by category
- Dark, “techy” UI theme

---

## Tech Stack
- **Backend:** Spring Boot (Java 21), JPA/Hibernate, layered architecture (Controllers, Services, Repositories)
- **Database:** MySQL 8 (initialized from SQL script)
- **Frontend:** React 18 + Vite + TypeScript, React Router, TanStack Query, Axios; production served by **Nginx**
- **Containerization:** Docker & Docker Compose

---

## Repository Structure
```
/ (repo root)
├─ challenge/                     # backend (Spring Boot) + docker-compose.yml
│  ├─ src/ …                      # Java sources
│  ├─ pom.xml
│  ├─ Dockerfile                  # backend container
│  └─ docker-compose.yml          # composes db + backend + frontend
├─ frontend/                      # SPA (Vite + React + TS)
│  ├─ src/ …
│  ├─ Dockerfile                  # frontend container (build + Nginx)
│  └─ nginx.conf                  # SPA routing + assets cache
└─ database/
   └─ 001_notesdb.sql             # DB creation + schema + seed data
```
> If you place `docker-compose.yml` elsewhere, adjust the relative paths accordingly.

---

## Requirements (local development)
- **Java 21** (JDK 21)
- **Node.js 20+** (for Vite dev server)
- **Docker** + **Docker Compose v2** (for one‑command run)

---

## Quick Start (Docker — one command)

From the **`challenge/`** directory (where `docker-compose.yml` lives):

**Windows (PowerShell):**
```powershell
.
un.ps1 rebuild
```

**macOS/Linux/Git Bash:**
```bash
./run.sh rebuild
```

This will:
- build and start **MySQL**, **backend**, **frontend**
- initialize the database from `../database/001_notesdb.sql` (first run only)

**URLs**
- Frontend: http://localhost:5173  
- API base: http://localhost:8080/api  
- Health: http://localhost:8080/api/health → `OK`

> The Compose file intentionally does **not** publish MySQL on the host to avoid port conflicts. The backend connects internally to `db:3306`.

---

## Environment

### Backend (Spring Boot)
Configured via environment variables (already set in compose):
```
SPRING_DATASOURCE_URL=jdbc:mysql://db:3306/notesdb?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=1614
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

`application.properties` reads these variables and typically sets:
```properties
spring.jpa.hibernate.ddl-auto=none   # recommended with preloaded schema
# use 'update' during development if desired
```

### Frontend (Vite)
**Dev:** create `frontend/.env.local`
```
VITE_API_URL=http://localhost:8080/api
```
**Docker build:** `docker-compose.yml` passes a build ARG `VITE_API_URL` (defaults to the API above).

---

## Database Initialization
- The MySQL container executes any `*.sql` files found in `/docker-entrypoint-initdb.d` **on first initialization only**.
- This repo mounts `../database/` there and runs **`001_notesdb.sql`**, which:
  - creates the `notesdb` database
  - sets up tables (`notes`, `categories`, `note_categories`)
  - inserts seed rows (categories and sample notes)

**Reset DB data (to re-run init scripts):**
```bash
cd challenge
docker compose down -v
docker compose up -d --build
```

---

## Local Development (without Docker)

### Backend
**macOS/Linux:**
```bash
export SPRING_DATASOURCE_URL="jdbc:mysql://localhost:3306/notesdb?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"
export SPRING_DATASOURCE_USERNAME="root"
export SPRING_DATASOURCE_PASSWORD="1614"
export CORS_ALLOWED_ORIGINS="http://localhost:5173"
./mvnw spring-boot:run
```

**Windows PowerShell:**
```powershell
$env:SPRING_DATASOURCE_URL="jdbc:mysql://localhost:3306/notesdb?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"
$env:SPRING_DATASOURCE_USERNAME="root"
$env:SPRING_DATASOURCE_PASSWORD="1614"
$env:CORS_ALLOWED_ORIGINS="http://localhost:5173"
.\mvnw spring-boot:run
```

### Frontend
```bash
cd frontend
echo "VITE_API_URL=http://localhost:8080/api" > .env.local
npm i
npm run dev
# open http://localhost:5173
```

---

## API Reference (summary)

**Base URL:** `/api`

### Health
- `GET /api/health` → `"OK"`

### Notes
- `GET /api/notes?archived=false&category=work` — list notes (filter by archive flag, optional category name)
- `GET /api/notes/{id}` — get a note
- `POST /api/notes` — create
  ```json
  { "title": "Buy solder", "content": "and flux" }
  ```
- `PUT /api/notes/{id}` — update
  ```json
  { "title": "Spring study plan", "content": "Review JPA, DTOs, tests" }
  ```
- `PATCH /api/notes/{id}/archive` — archive
- `PATCH /api/notes/{id}/unarchive` — unarchive
- `DELETE /api/notes/{id}` — delete

### Categories
- `GET /api/categories` — list categories
- `POST /api/categories` — create
  ```json
  { "name": "work" }
  ```

### Note ↔ Category
- `POST /api/notes/{noteId}/categories/{categoryId}` — add category to note
- `DELETE /api/notes/{noteId}/categories/{categoryId}` — remove category from note

---

## Run Scripts

Inside **`challenge/`**:

**Windows — `run.ps1`**
```
.
un.ps1            # build + up
.
un.ps1 rebuild    # rebuild images (no cache) + up
.
un.ps1 logs       # tail logs
.
un.ps1 down       # stop stack
.
un.ps1 reset      # stop + remove volumes (⚠ wipes DB)
```

**Bash — `run.sh`**
```
./run.sh
./run.sh rebuild
./run.sh logs
./run.sh down
./run.sh reset
```

---

## Troubleshooting
- **Port 3306 already in use**  
  Do not publish MySQL to the host (compose config removes `ports:` for `db`). The backend talks to `db:3306` internally.

- **Nginx error `unknown directive "server"`**  
  Ensure `frontend/nginx.conf` is saved **UTF‑8 without BOM** (Windows can inject BOM). Rebuild the `frontend` service.

- **`UnsupportedClassVersionError 65.0 vs 61.0`**  
  You compiled with **Java 21** but run with a lower runtime. Ensure runtime is Java 21 (Docker images already do).

- **CORS errors**  
  Set `CORS_ALLOWED_ORIGINS=http://localhost:5173` (and rebuild backend if you changed it).

- **DB init didn’t run**  
  Init scripts execute only when the data dir is empty. Run `docker compose down -v` then `up -d --build`.

---

## Versions
- Java **21**
- Node.js **20+**
- MySQL **8.0**
- Spring Boot **3.x**
- Vite **5.x**, React **18**

---

## License
This project is for a hiring exercise; no license specified.
