
# 🚀 Node.js + TypeScript API con PostgreSQL, TypeORM, JWT y Más

Esta API REST está construida con **Node.js**, **TypeScript**, **Express**, y **TypeORM**, utilizando una base de datos **PostgreSQL** (e.g., Railway). Incluye autenticación con JWT, sistema de verificación por correo, recuperación de contraseña, manejo de errores, protección contra saturación, configuración de seguridad con Helmet y CORS, migraciones y tests unitarios.

---

## 🧱 Tecnologías principales

- **Node.js + Express**
- **TypeScript**
- **TypeORM**
- **PostgreSQL**
- **JWT (Autenticación)**
- **Nodemailer** (Verificación por correo y recuperación)
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
npm run dev                # Compila y levanta el servidor con nodemon
npm run build              # Compila el código TypeScript
npm run start              # Ejecuta la versión compilada (dist/)

npm run migration:generate  # Genera nueva migración con TypeORM
npm run migration:run       # Ejecuta migraciones pendientes
npm run migration:revert    # Revierte la última migración

npm test                   # Corre los tests con Jest
```

---

## 📂 Estructura del proyecto

```
src/
├── app.ts                      # Configuración Express y middlewares
├── server.ts                   # Punto de arranque de la app
├── config/
│   ├── database.ts             # Configuración principal del DataSource
│   ├── data-source.ts         # Usado por CLI para migraciones
│   └── mailer.config.ts       # Transporter de Nodemailer
├── controllers/               # Controladores (auth, users, password)
├── mails/                     # Envíos de correo y plantillas
├── middlewares/               # Auth, errores, seguridad, rate-limit
├── migrations/                # Migraciones generadas por TypeORM
├── models/                    # Entidades de la base de datos
├── routes/                    # Rutas agrupadas
├── services/                  # Lógica de negocio
├── types/                     # Tipos extendidos (req.user)
├── utils/                     # JWT utils, logger, etc
├── validators/                # Validaciones con Zod
└── dist/                      # Código compilado

tests/
└── services/
    ├── user.service.test.ts
    ├── auth.service.test.ts
    └── password.service.test.ts

.env.example                   # Variables de entorno de ejemplo
jest.config.js                 # Configuración de Jest
tsconfig.json                  # Configuración de TypeScript
```

---

## 🔐 Autenticación, Verificación y Recuperación

- **Registro**: `POST /api/users`  
  - Crea usuario con `verified = false`, genera un OTP y lo envía por correo.

- **Verificación de correo**: `POST /api/auth/verify`  
  - Recibe `{ email, otp }` y marca al usuario como verificado.

- **Login**: `POST /api/auth/login`  
  - Requiere que el usuario esté verificado.  
  - Devuelve token JWT válido.

- **Solicitar recuperación de contraseña**: `POST /api/password/request-reset`  
  - Recibe `{ email }` y envía un nuevo código OTP si el usuario existe.

- **Cambiar contraseña**: `POST /api/password/reset`  
  - Recibe `{ email, otp, newPassword }`, actualiza la contraseña y elimina el token.

---

## 🔧 Seguridad

- `helmet` para agregar headers de seguridad
- `cors` para controlar origenes permitidos
- `express-rate-limit` para limitar ataques de fuerza bruta
- Validaciones estrictas con **Zod** en requests

---

## 🧪 Testing

- **Jest** para pruebas unitarias
- Mock de:
  - `bcrypt` para encriptado de contraseñas
  - `crypto` para generación de OTPs
  - `nodemailer` para correos
  - Modelos de TypeORM (`User`, `PasswordReset`)
- Tests para servicios:
  - Creación de usuarios
  - Login y verificación
  - Recuperación y actualización de contraseña

---

## 🌍 Desarrollo remoto con ngrok

Para exponer tu servidor si estás usando Firebase Studio o cualquier entorno remoto:

```bash
ngrok http 3000
```

> Luego usá esa URL en Postman. **Recordá cerrar ngrok con Ctrl+C al terminar.**

---

## 🧑‍💻 Autor

**Fernando Ramones**  
[LinkedIn](https://linkedin.com/in/fernandoramones) · [GitHub](https://github.com/ferchox920)
```

