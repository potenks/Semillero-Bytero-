# 📚 Proyecto: Integración con Google Classroom  

## 🚀 Contexto  
El proyecto surge en el marco del **Vibeathon** y busca resolver las limitaciones actuales de **Google Classroom** en la gestión de cursos con muchos alumnos y múltiples docentes.  

Actualmente, **Semillero Digital** utiliza Classroom para organizar cursos y tareas, pero el manejo manual dificulta:  
- Identificar qué alumnos entregaron o no sus tareas.  
- Distinguir quiénes entregaron tarde.  
- Visualizar las calificaciones de manera global.  
- Asignar alumnos a profesores de forma segmentada.  
- Obtener métricas agregadas de manera ágil y escalable.  

---

## ❌ Problemas identificados  
- Seguimiento manual y poco eficiente de entregas y correcciones.  
- Imposibilidad de segmentar alumnos entre distintos docentes.  
- Coordinadores sin acceso rápido a métricas globales.  
- Dificultad para escalar con gran volumen de alumnos y cursos.  

---

## 🎯 Objetivo  
Construir una **capa de reportería por encima de Google Classroom** que permita a profesores y coordinadores:  
- Gestionar tareas y entregas de manera ágil.  
- Supervisar métricas y desempeño de alumnos.  
- Mejorar la eficiencia y escalabilidad del seguimiento académico.  

---

## 🧩 Funcionalidades principales  

### 👩‍🏫 Dashboard para profesores  
- Visualizar **solo los alumnos asignados**.  
- Estado de tareas: entregadas, pendientes, tardías, evaluadas.  
- Acceso rápido a links de cada tarea.  
- Notificaciones automáticas sobre tareas y entregas pendientes.  

### 👨‍💼 Dashboard para coordinadores/admin  
- Vista global de todos los cursos y células.  
- Métricas agregadas por curso, célula o alumno:  
  - Tareas entregadas / pendientes.  
  - Tareas corregidas, iniciadas o en borrador.  
  - Comentarios de profesores.  
- Segmentación por **célula** (grupo de alumnos asignado a un profesor).  

### 🔗 Integración con Google Classroom API  
- Lectura de datos de tareas, entregas y calificaciones.  
- Relación de alumnos y profesores a través de Google Sheets.  
- Generación de reportes automáticos.  

### 📈 Escalabilidad  
- Soporte para grandes volúmenes de alumnos y profesores.  
- Reducción del trabajo manual del equipo de coordinación.  

---

## 🛠️ Tecnologías utilizadas  
- **Frontend**: React + Vite, Next.js, JavaScript  
- **Backend/BD**: MongoDB  
- **Integraciones**: Google Classroom API, Google Sheets  

---

## ⚙️ Instalación y uso  

1. **Clonar repositorio**  
   ```bash
   git clone https://github.com/tu-repo/proyecto-classroom.git
   cd proyecto-classroom
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   Crear un archivo `.env` con las credenciales necesarias:

   ```env
   MONGO_URI=your_mongodb_uri
   GOOGLE_API_KEY=your_google_api_key
   ```

4. **Ejecutar en modo desarrollo**

   ```bash
   npm run dev
   ```

5. **Build para producción**

   ```bash
   npm run build
   npm run start
   ```

---

## 👥 Contribución

1. Crear una rama nueva para la feature o fix.
2. Hacer un commit claro y descriptivo.
3. Abrir un Pull Request explicando los cambios.

---

## 📌 Equipo

Proyecto desarrollado en el marco del **Vibeathon** por el equipo conformado por **Sebastián Paz, Sebastián Palomino, David Potin, Nazareno Morales, Steven Arteaga y Dante Reggiani**.



---

# 🚀 Guía de Despliegue (Producción)

Esta guía describe cómo desplegar el backend y el frontend, configurar OAuth de Google y asegurar el tráfico en producción.

## 1) Requisitos

- **Node.js 18+** en el servidor.
- **MongoDB 7.0** (local o Atlas).
- **Cuenta de Google Cloud** con credenciales OAuth 2.0.
- **Dominio y HTTPS** con reverse proxy (Nginx/Caddy/Traefik).

## 2) Variables de entorno

- Backend `Back/.env` (no commitear este archivo):

```env
NODE_ENV=production
PORT=5001
MONGODB_URI=mongodb://localhost:27017/semillero
JWT_SECRET=tu_secreto_seguro

GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx
GOOGLE_REDIRECT_URI=https://tu-dominio.com/api/auth/google/callback

# URL pública del frontend
FRONTEND_URL=https://tu-dominio-frontend.com
```

- Frontend `front/.env`:

```env
VITE_API_URL=https://tu-dominio.com
```

> Ajusta los dominios a tu entorno real. En desarrollo, usa `http://localhost:5001` y `http://localhost:5173`.

## 3) Configuración en Google Cloud Console

- En tu proyecto → `APIs & Services` → `OAuth consent screen`:
  - Define el tipo de usuario (External) y agrega tus `Test users` si estás en estado Testing.
  - Añade scopes (ya usados por el proyecto):
    - `openid`, `profile`, `email`
    - `https://www.googleapis.com/auth/classroom.courses.readonly`
    - `https://www.googleapis.com/auth/classroom.rosters.readonly`
    - `https://www.googleapis.com/auth/classroom.coursework.me.readonly`
    - `https://www.googleapis.com/auth/classroom.coursework.students.readonly`
    - `https://www.googleapis.com/auth/calendar.readonly`

- `APIs & Services` → `Credentials` → `Create Credentials` → `OAuth Client ID` (Web application):
  - Authorized JavaScript origins (sin paths):
    - `https://tu-dominio-frontend.com`
    - `https://tu-dominio.com` (si también sirves front/back desde el mismo host)
  - Authorized redirect URIs (con path completo):
    - `https://tu-dominio.com/api/auth/google/callback`

Guarda `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET` y colócalos en `Back/.env`.

## 4) Build de Front y Back

```bash
# Backend
cd Back
npm ci

# Frontend
cd ../front
npm ci
npm run build   # genera front/dist
```

## 5) Arranque en Producción

```bash
# Backend (recomendado con PM2)
cd Back
npm i -g pm2
pm2 start src/server.js --name semillero-back --env production
pm2 save
```

### Servir el Frontend

Sirve `front/dist` con Nginx (o cualquier servidor estático):

```
root /var/www/semillero-frontend;  # copia aquí el contenido de front/dist
```

## 6) Reverse Proxy + HTTPS (Nginx ejemplo)

Backend (proxy a puerto 5001):

```nginx
server {
  listen 80;
  server_name tu-dominio.com;

  location / {
    proxy_pass http://127.0.0.1:5001;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Real-IP $remote_addr;
    # WebSocket notifications
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection $connection_upgrade;
  }
}
```

Frontend (sirviendo `front/dist`):

```nginx
server {
  listen 80;
  server_name tu-dominio-frontend.com;

  root /var/www/semillero-frontend;
  index index.html;

  location / {
    try_files $uri /index.html;
  }
}
```

Certificados con **Certbot**:

```bash
sudo certbot --nginx -d tu-dominio.com
sudo certbot --nginx -d tu-dominio-frontend.com
```

> Recuerda actualizar `FRONTEND_URL` y `GOOGLE_REDIRECT_URI` a `https://...` cuando tengas HTTPS activo.

## 7) MongoDB

- Local: servicio `mongod` (7.0) corriendo.
- Atlas: reemplaza `MONGODB_URI` por la connection string. Asegura IP allowlist y usuario/clave.

## 8) Realtime (WebSocket)

- El backend expone `wss://tu-dominio.com/ws/notifications`.
- El front se conecta desde `NotificationContext` usando `VITE_API_URL` y reemplazando http → ws.
- En Nginx, asegúrate de pasar las cabeceras `Upgrade/Connection` como en el bloque del backend.

## 9) Verificación post-deploy

- `https://tu-dominio.com/api/health` → 200 ok.
- `https://tu-dominio.com/api/docs` → Swagger operativo.
- Frontend:
  - Login con Google desde `/login`.
  - Dashboard visible.
  - Botón “Sincronizar Classroom” y “Exportar CSV”.
  - Toasts en tiempo real al sincronizar.

## 10) Docker Compose (opcional)

Estructura sugerida de servicios:

- **backend**: Node 18 ejecutando `Back/src/server.js` (puerto 5001).
- **mongo**: MongoDB 7.0 con volumen persistente.
- **frontend**: Nginx sirviendo `front/dist`.
- **reverse proxy** (opcional dentro del stack) o externo (Nginx del host / Traefik).

> Si lo deseas, podemos agregar un `docker-compose.yml` con estos servicios y un `.env.example` para acelerar el despliegue.

---

## 🔍 Troubleshooting

- **redirect_uri_mismatch**: Asegura que la URI esté en Google Console y en `GOOGLE_REDIRECT_URI`.
- **Missing client_id**: Revisa `GOOGLE_CLIENT_ID` y reinicia el backend.
- **CORS/cookies**: `FRONTEND_URL` debe apuntar al dominio real y el front usar `credentials: 'include'`.
- **WS no conecta**: Ver cabeceras `Upgrade/Connection` en el proxy y que `/ws/notifications` esté accesible.

