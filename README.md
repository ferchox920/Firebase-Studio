# 🚀 Node.js + TypeScript API con PostgreSQL, TypeORM, JWT y Más

Esta API REST está construida con **Node.js**, **TypeScript**, **Express**, y **TypeORM**, utilizando una base de datos **PostgreSQL** (e.g., Railway). Incluye autenticación con JWT, sistema de verificación por correo, manejo de errores, protección contra saturación, configuración de seguridad con Helmet y CORS, migraciones y tests unitarios.

---

## 🧱 Tecnologías principales

- **Node.js + Express**
- **TypeScript**
- **TypeORM**
- **PostgreSQL**
- **JWT (Autenticación)**
- **Nodemailer** (Verificación por correo)
- **Helmet / CORS / Rate Limiting**
- **Jest** (Tests unitarios)
- **TypeORM CLI** (Migraciones)

---

## 📦 Instalación

1. Clonar el repositorio:

    ```bash
    git clone https://github.com/ferchox920/Firebase-Studio.git
    cd Firebase-Studio
    ```

2. Instalar dependencias:

    ```bash
    npm install
    ```

3. Crear archivo `.env` en la raíz (basado en `.env.example`):

    ```ini
    PORT=3000
    DATABASE_URL=postgresql://usuario:contraseña@host:puerto/db
    JWT_SECRET=tu_secreto

    MAIL_HOST=smtp.ejemplo.com
    MAIL_PORT=587
    MAIL_USER=usuario_mail
    MAIL_PASS=contraseña_mail
    ```

> La base de datos puede ser local o una instancia como [Railway](https://railway.app).

---

## 🏁 Scripts

```bash
npm run dev           # Compila y levanta el servidor con nodemon
npm run build         # Compila el código TypeScript
npm run start         # Ejecuta la versión compilada (dist/)

npm run migration:generate  # Genera nueva migración (TypeORM CLI)
npm run migration:run       # Ejecuta migraciones pendientes
npm run migration:revert    # Revierte la última migración

npm test              # Corre tests con Jest
```

---

## 📂 Estructura del proyecto

```
src/
├── app.ts                     # Configuración Express y middlewares
├── server.ts                  # Punto de arranque de la app
├── config/                    # Configuración técnica
│   ├── database.ts            # DataSource para la app
│   └── mailer.config.ts       # Transporter de Nodemailer
├── controllers/               # Lógica de controladores (auth, users)
├── mails/                     # Plantillas y envíos de correo
├── middlewares/               # Auth, CORS, rate-limit, errors, seguridad
├── migrants/                  # Carpeta de migraciones TypeORM
├── models/                    # Entidades TypeORM
├── routes/                    # Definición de rutas (auth, users)
├── services/                  # Lógica de negocio (auth, users)
├── types/                     # Tipados globales/extensiones (req.user)
├── utils/                     # Helpers: logger, jwt utils
├── validators/                # Esquemas Zod (auth, user)
├── data-source.ts             # Exporta AppDataSource para CLI
└── dist/                      # Código compilado

tests/
├── services/
│   ├── user.service.test.ts
│   └── auth.service.test.ts
└── controllers/  # (opcional tests e2e con supertest)

.env.example                  # Ejemplo de variables de entorno
jest.config.js                # Configuración de Jest
package.json
tsconfig.json
README.md
```

---

## 🔐 Autenticación y Verificación

- **Registro**: `POST /api/users`  
  - Genera OTP y envía correo de verificación.  
  - Usuario se crea con `verified=false`.

- **Verificar Email**: `POST /api/auth/verify`  
  - Recibe `{ email, otp }` y marca `verified=true`.

- **Login**: `POST /api/auth/login`  
  - Solo usuarios verificados reciben JWT.  
  - Rutas protegidas requieren header `Authorization: Bearer <token>`.

---

## 🔧 Seguridad

- `helmet` para headers seguros.  
- `cors` configurado.  
- `express-rate-limit` para limitar peticiones.  
- Validaciones con **Zod** en body y params.

---

## 🧪 Testing

- Unit tests con **Jest** cubriendo servicios y lógica clave.  
- Mock de `bcrypt`, `crypto`, `nodemailer` y modelos.

---

## 🌍 Desarrollo remoto con ngrok

Para probar desde tu máquina local o Postman cuando trabajas en IDE en la nube:

```bash
ngrok http 3000
```

Luego usa la URL pública en tus peticiones.

> NO olvides cerrar `ngrok` (Ctrl+C) al terminar para no exponer tu API indefinidamente.

---

## 🧑‍💻 Autor

**Fernando Ramones**  
[LinkedIn](https://linkedin.com/in/fernandoramones) · [GitHub](https://github.com/ferchox920)

