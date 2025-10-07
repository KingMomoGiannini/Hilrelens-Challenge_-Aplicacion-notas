
# Challenge — App de Notas (Full‑Stack)

Aplicación **full‑stack** de **Notas** con **tags y filtrado**.  
Single Page Application (**React + Vite + TypeScript**) que consume una **API REST** en **Spring Boot** (**Java 21, JPA/Hibernate**) con **MySQL 8** para persistencia.  
El entorno de producción está dockerizado (DB + API + SPA) y servido con **Nginx**.

---

## Funcionalidades
- Crear, editar y eliminar notas
- Archivar / desarchivar notas
- Crear categorías (tags) y agregarlas/quitarlas de las notas
- Filtrar notas por categoría
- Tema oscuro con estética “tech”

---

## Stack Tecnológico
- **Backend:** Spring Boot (Java 21), JPA/Hibernate, arquitectura por capas (Controllers, Services, Repositories)
- **Base de datos:** MySQL 8 (inicializada desde script SQL)
- **Frontend:** React 18 + Vite + TypeScript, React Router, TanStack Query, Axios; en producción servido con **Nginx**
- **Contenedores:** Docker y Docker Compose

---

## Estructura del repositorio
```
/ (raíz del repo)
├─ challenge/                     # backend (Spring Boot) + docker-compose.yml
│  ├─ src/ …                      # código Java
│  ├─ pom.xml
│  ├─ Dockerfile                  # contenedor del backend
│  └─ docker-compose.yml          # compone db + backend + frontend
├─ frontend/                      # SPA (Vite + React + TS)
│  ├─ src/ …
│  ├─ Dockerfile                  # contenedor del frontend (build + Nginx)
│  └─ nginx.conf                  # routing SPA + cache de assets
└─ database/
   └─ 001_notesdb.sql             # creación de DB + esquema + datos de seed
```
> Si movés `docker-compose.yml` a otra carpeta, ajustá las rutas relativas.

---

## Requisitos (desarrollo local)
- **Java 21** (JDK 21)
- **Node.js 20+** (para el dev server de Vite)
- **Docker** + **Docker Compose v2** (para correr todo con un comando)

---

## Inicio rápido (Docker — un comando)

Desde el directorio **`challenge/`** (donde vive `docker-compose.yml`):

**Windows (PowerShell):**
```powershell
.
un.ps1 rebuild
```

**macOS/Linux/Git Bash:**
```bash
./run.sh rebuild
```

Esto va a:
- buildear y levantar **MySQL**, **backend** y **frontend**
- inicializar la base desde `../database/001_notesdb.sql` (solo la primera vez)

**URLs**
- Frontend: http://localhost:5173  
- API base: http://localhost:8080/api  
- Health: http://localhost:8080/api/health → `OK`

> El Compose **no** publica MySQL en el host para evitar conflictos de puertos. El backend se conecta internamente a `db:3306`.

---

## Variables de entorno

### Backend (Spring Boot)
Configuradas vía variables de entorno (ya definidas en compose):
```
SPRING_DATASOURCE_URL=jdbc:mysql://db:3306/notesdb?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=1614
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

`application.properties` las lee y típicamente define:
```properties
spring.jpa.hibernate.ddl-auto=none   # recomendado con esquema precargado
# podés usar 'update' en desarrollo si querés
```

### Frontend (Vite)
**Dev:** crear `frontend/.env.local` (o copiar desde `.env.example`)
```
VITE_API_URL=http://localhost:8080/api
```
**Build en Docker:** `docker-compose.yml` pasa un build ARG `VITE_API_URL` (mismo valor por defecto).

---

## Inicialización de la base de datos
- El contenedor de MySQL ejecuta cualquier archivo `*.sql` que encuentre en `/docker-entrypoint-initdb.d` **solo en la primera inicialización**.
- Este repo monta `../database/` ahí y corre **`001_notesdb.sql`**, que:
  - crea la base `notesdb`
  - crea tablas (`notes`, `categories`, `note_categories`)
  - inserta datos de seed (categorías y notas de ejemplo)

**Resetear datos de la DB (para re‑correr los scripts):**
```bash
cd challenge
docker compose down -v
docker compose up -d --build
```

---

## Desarrollo local (sin Docker)

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
# si no existe:
cp .env.example .env.local  # o crear el archivo a mano
echo "VITE_API_URL=http://localhost:8080/api" > .env.local
npm i
npm run dev
# abrir http://localhost:5173
```

---

## API (resumen)

**Base URL:** `/api`

### Health
- `GET /api/health` → `"OK"`

### Notes
- `GET /api/notes?archived=false&category=work` — lista notas (filtra por archivadas y categoría opcional)
- `GET /api/notes/{id}` — obtiene una nota
- `POST /api/notes` — crea
  ```json
  { "title": "Comprar estaño", "content": "y flux" }
  ```
- `PUT /api/notes/{id}` — actualiza
  ```json
  { "title": "Plan de estudio Spring", "content": "Repasar JPA, DTOs, tests" }
  ```
- `PATCH /api/notes/{id}/archive` — archiva
- `PATCH /api/notes/{id}/unarchive` — desarchiva
- `DELETE /api/notes/{id}` — elimina

### Categories
- `GET /api/categories` — lista categorías
- `POST /api/categories` — crea
  ```json
  { "name": "work" }
  ```

### Nota ↔ Categoría
- `POST /api/notes/{noteId}/categories/{categoryId}` — agrega categoría a la nota
- `DELETE /api/notes/{noteId}/categories/{categoryId}` — quita categoría de la nota

---

## Scripts de ejecución

Dentro de **`challenge/`**:

**Windows — `run.ps1`**
```
.
un.ps1            # build + up
.
un.ps1 rebuild    # rebuild (sin caché) + up
.
un.ps1 logs       # ver logs
.
un.ps1 down       # bajar stack
.
un.ps1 reset      # bajar + borrar volúmenes (⚠ borra DB)
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
- **Puerto 3306 en uso**  
  No publiques MySQL en el host (el compose ya omite `ports:` en `db`). El backend se conecta a `db:3306` dentro de la red.

- **Error Nginx `unknown directive "server"`**  
  Asegurate de guardar `frontend/nginx.conf` como **UTF‑8 sin BOM** (Windows a veces agrega BOM). Rebuild del servicio `frontend`.

- **`UnsupportedClassVersionError 65.0 vs 61.0`**  
  Compilaste con **Java 21** pero ejecutás con un runtime menor. Asegurate de usar Java 21 (las imágenes Docker ya lo traen).

- **Errores de CORS**  
  Definí `CORS_ALLOWED_ORIGINS=http://localhost:5173` (y rebuild del backend si lo cambiaste).

- **No se corrieron los scripts de DB**  
  Solo corren con el directorio de datos vacío. Ejecutá `docker compose down -v` y luego `up -d --build`.

---

## Versiones
- Java **21**
- Node.js **20+**
- MySQL **8.0**
- Spring Boot **3.x**
- Vite **5.x**, React **18**

---

## Licencia
Proyecto para ejercicio de contratación; sin licencia especificada.
