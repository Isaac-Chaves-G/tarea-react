# Proyecto React + Spring Boot para login y gestion de cursos

Proyecto full stack basado en los ejemplos del profesor. Incluye un frontend React con Vite y un backend Spring Boot en la carpeta `auth/`. El frontend consume la API REST del backend para iniciar sesion, proteger rutas, listar cursos y crear cursos.

## Requisitos

- Node.js 20 o superior.
- Java 17 o superior.
- Backend Spring Boot en `auth/`.
- Frontend React en la raiz del proyecto.
- API disponible en `http://localhost:8080/auth`.
- Endpoints esperados:
  - `POST /api/auth/login`
  - `GET /api/courses`
  - `POST /api/courses`

## Estructura general

```txt
.
  auth/
    build.gradle
    src/main/java/co/icesi/auth/
      api/
      config/
      dtos/
      mapper/
      model/
      repository/
      service/
    src/main/resources/
      application.properties
  src/
    services/
    context/
    hooks/
    components/
    pages/
  package.json
  vite.config.js
```

## Backend Spring Boot

El backend esta en la carpeta `auth/` y se basa en el proyecto de autenticacion del profesor, complementado para consumirlo desde React mediante JWT y endpoints REST de cursos.

Entrar a la carpeta del backend:

```bash
cd auth
```

Ejecutar en Windows:

```bash
gradlew.bat bootRun
```

Ejecutar en Linux/macOS:

```bash
./gradlew bootRun
```

El backend queda disponible en:

```txt
http://localhost:8080/auth
```

Credenciales iniciales:

```txt
admin / admin123
profesor / prof123
estudiante / est123
```

Para crear cursos desde el frontend se recomienda iniciar sesion como `admin`, porque tiene el permiso `COURSE_CREATE`.

El DTO enviado al crear cursos es:

```json
{
  "name": "Sistemas Operativos",
  "description": "Conceptos de procesos, memoria y E/S",
  "code": "SO101",
  "credits": 4,
  "teacherId": 2
}
```

## Frontend React

Desde la raiz del proyecto, instalar dependencias:

```bash
npm install
```

Ejecutar el frontend:

```bash
npm run dev
```

Por defecto la aplicacion usa:

```txt
VITE_API_BASE_URL=http://localhost:8080/auth
```

Si el backend corre en otra URL, crear un archivo `.env` con:

```txt
VITE_API_BASE_URL=http://localhost:8080/auth
```

## Build y preview

```bash
npm run build
npm run preview
```

La aplicacion esta configurada para publicarse en un dominio `.icesi.edu.co`, por ejemplo:

```txt
https://pi2tools.icesi.edu.co/iaslab/compu2/AMB/
```

En Vite y React Router se configura solo la subruta, porque el dominio lo aporta el servidor donde se despliega:

```txt
/iaslab/compu2/AMB/
```

Para probar el build local con preview, abrir:

```txt
http://localhost:4173/iaslab/compu2/AMB/
```

Si el profesor asigna otra subruta, actualizar el valor en:

- `vite.config.js`
- `src/config.js`

## Flujo principal integrado

1. Ejecutar el backend Spring Boot desde `auth/`.
2. Ejecutar el frontend React desde la raiz.
3. Iniciar sesion con usuario y contrasena.
4. Guardar el token JWT en `localStorage`.
5. Acceder a la ruta protegida de cursos.
6. Listar cursos desde `GET /api/courses`.
7. Crear cursos con `POST /api/courses`.
8. Cerrar sesion para eliminar el token y bloquear rutas privadas.

## Estructura principal del frontend

```txt
src/
  services/
    client.js
    authService.js
    courseService.js
  context/
    AuthContext.jsx
  hooks/
    useAuthContext.js
    usePermission.js
  components/
    CourseForm/
      CourseForm.jsx
    ProtectedRoute/
      ProtectedRoute.jsx
  pages/
    LoginPage/
      LoginPage.jsx
    CoursesPage.jsx
  App.jsx
  config.js
  main.jsx
  styles.css
```
