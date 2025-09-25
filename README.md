

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


