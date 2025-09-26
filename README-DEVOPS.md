# DevOps, QA & Docs

This document summarizes local development, testing, CI and Docker usage for this monorepo.

## Structure
- Backend: `Back/`
- Frontend: `front/`

## Local development
### Backend
```
cd Back
npm ci
npm run dev
# http://localhost:3001
```

### Frontend
```
cd front
npm ci
npm run dev
# http://localhost:5173
```

## Testing
### Backend (Jest + Supertest)
```
cd Back
npm test
```

### Frontend (Vitest)
```
cd front
npm test
```

## Swagger / OpenAPI
- Spec file: `Back/src/docs/openapi.json`
- UI: `GET http://localhost:3001/api/docs`

## Docker Compose
At repo root:
```
docker compose up --build
```
Services:
- MongoDB: mongodb://localhost:27017/semillero
- Backend: http://localhost:3001
- Frontend: http://localhost:5173

Files:
- `docker-compose.yml`
- `Back/Dockerfile`
- `front/Dockerfile`

## CI (GitHub Actions)
Workflow: `.github/workflows/ci.yml`
Runs on pushes/PRs to `main` and `rama-de-prueba`:
- Backend: install deps and run tests
- Frontend: install deps, build and run tests
