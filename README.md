# Semillero Digital - Plataforma de Seguimiento

Monorepo con frontend (Vite + React + Tailwind) y backend (Node.js + Express + MongoDB).

## Estructura

- `front/`: Aplicación React con Vite y Tailwind.
- `Back/`: API Express con MongoDB.

## Requisitos

- Node.js 18+
- MongoDB 6+

## Variables de entorno

- Backend: `Back/.env` (ver `Back/.env.example`)
- Frontend: `front/.env` (ver `front/.env.example`)

## Desarrollo

Backend:
```
cd Back
npm install
cp .env.example .env
npm run dev
```

Frontend:
```
cd front
npm install
cp .env.example .env
npm run dev
```

## Scripts sugeridos (opcional)
Puedes agregar un orquestador (npm workspaces o `concurrently`) en el root si lo prefieres.
