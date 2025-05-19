# Tareas App - Fullstack con Laravel + React/Next.js

Aplicación web fullstack que permite gestionar tareas con autenticación JWT, desarrollada con **Laravel (backend)** y **Next.js + Tailwind CSS (frontend)**.

---

## Tecnologías Utilizadas

### Backend
- PHP 8.2
- Laravel 10
- MySQL 8
- JWT (tymon/jwt-auth)

### Frontend
- Next.js 14 (App Router + TypeScript)
- Tailwind CSS
- Axios
- React Hot Toast
- Framer Motion (animaciones)

### Contenedores
- Docker & Docker Compose

---

## Estructura del Proyecto

```
tareas-proyecto/
├── docker-compose.yml
├── tareas-api/           # Backend Laravel
│   └── Dockerfile
    └── entrypoint.sh
│   └── ... (Lógica del backend)
├── tareas-frontend/      # Frontend Next.js
│   └── Dockerfile
│   └── ... (Lógica del frontend)
```

---

## Instalación
## Primero 
clonar el repositorio adjunto en la url: https://github.com/LilAyrtonx98/test_GUX.git,
con el siguiente comando:
git clone https://github.com/LilAyrtonx98/test_GUX.git (les pediran su usuario y su token de acceso o contraseña)

# A Continuación se detallarán dos opciones para utilizar el proyecto. 

### Opción 1: Sin Docker (local)

#### Backend (Laravel)
```bash
cd tareas-api
cp .env.example .env
# Edita las credenciales de DB en .env si es necesario
composer install
php artisan key:generate
php artisan jwt:secret
php artisan migrate
php artisan serve
```

Disponible en: `http://localhost:8000`

#### Frontend (Next.js)
```bash
cd tareas-frontend
cp .env.local.example .env.local
# Asegúrate que contenga:
# NEXT_PUBLIC_API_URL=http://localhost:8000/api
npm install
npm run dev
```
Disponible en: `http://localhost:3000`

---

###  Opción 2: Con Docker
 - Primero configurar el archivo .env del proyecto en el backend y cambiar lo siguiente:
   DB_HOST=mysql

 - Ejecutar el siguiente comando en la carpeta raíz del proyecto:
   sudo docker compose up -d --build

#### 1. Desde la raíz del proyecto:
```bash
docker compose up --build
```

#### 2. Servicios:
- Frontend (Next.js): `http://localhost:3001` (redirige directamente al inicio de sesión)
- Backend (Laravel): `http://localhost:8001`
- MySQL: puerto `3306` (usuario: root / pass: secret)

> El backend se conecta a MySQL automáticamente usando las variables del `docker-compose.yml`.
- Además se configura las migraciones gracias el entrypoint.sh 

---

##  Autenticación y Seguridad

- Autenticación con JWT usando `tymon/jwt-auth`.
- Rutas protegidas por middleware `auth:api`.
- Cada usuario solo puede ver, crear, editar y eliminar sus propias tareas.
- Control de acceso mediante `Gates` en Laravel y middleware personalizado.
- Requerimiento de tamaño de contraseña mínimo (6)
---

##  Funcionalidades Principales
- Registro y login de usuario
- CRUD de tareas (crear, editar, eliminar, completar)
- Visualización separada de tareas pendientes y completadas
- Animaciones con Framer Motion
- Feedback de usuario con React Hot Toast
- Contexto de autenticación global con `AuthContext`

---
## Autor
- Desarrollado por: **Ayrton Huenchual**

¡Gracias por revisar el proyecto! 
