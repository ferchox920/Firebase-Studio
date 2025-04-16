
### 📄 `README.md`

```markdown
# 🚀 Node.js + TypeScript API con PostgreSQL, TypeORM y JWT

Esta API REST está construida con **Node.js**, **TypeScript**, **Express**, y **TypeORM**, utilizando una base de datos **PostgreSQL** (en este caso, alojada en Railway). Incluye autenticación con JWT, manejo de errores, protección contra saturación y configuración de seguridad con Helmet y CORS.

---

## 🧱 Tecnologías principales

- **Node.js + Express**
- **TypeScript**
- **TypeORM**
- **PostgreSQL**
- **JWT (Autenticación)**
- **Helmet / CORS / Rate Limiting**
- **Firebase Studio / Google Project IDX compatible**

---

## 📦 Instalación

1. Clonar el repositorio:

```bash
git clone https://github.com/tu_usuario/tu_repositorio.git
cd tu_repositorio
```

2. Instalar dependencias:

```bash
npm install
```

3. Crear archivo `.env` en la raíz:

```env
PORT=3000
DATABASE_URL=postgresql://usuario:contraseña@host:puerto/db
JWT_SECRET=tu_secreto
```

> La base de datos puede ser local o una instancia como [Railway](https://railway.app).

---

## 🏁 Scripts

```bash
npm run dev       # Compila y levanta el servidor con nodemon
npm run build     # Compila el código TypeScript
npm run start     # Ejecuta la versión compilada (dist/)
```

---

## 📂 Estructura del proyecto

```
src/
├── app.ts                     # Configuración Express
├── server.ts                  # Entry point
├── config/                    # Configuración de la base de datos
│   └── database.ts
├── controllers/               # Controladores para rutas
├── middlewares/              # Middleware: auth, errores, seguridad, etc
├── models/                   # Entidades de TypeORM
├── routes/                   # Definición de rutas
├── services/                 # Lógica de negocio
├── types/                    # Extensiones para Express (e.g. req.user)
├── utils/                    # Logger, JWT utils, etc
```

---

## 🔐 Autenticación

- Registro (`POST /api/users`)
- Login (`POST /api/auth/login`)
- Rutas protegidas utilizan el header:

```http
Authorization: Bearer <token>
```

---

## 🔧 Seguridad

Incluye:

- `helmet` para headers seguros
- `cors` configurado
- `express-rate-limit` para limitar cantidad de requests

---

## 🌍 Acceso desde Postman vía ngrok

Si estás desarrollando en Project IDX (Firebase Studio), podés exponer el servidor con:

```bash
ngrok http 3000
```

> Y usar la URL generada en Postman para probar los endpoints.

---

## 🛠 Próximas mejoras

- Sistema de verificación por correo electrónico
- Validaciones con Zod o Joi
- Tests unitarios e integración
- Migraciones con TypeORM CLI

---

## 🧑‍💻 Autor

**Fernando Ramones**  
[LinkedIn](https://linkedin.com/in/fernandoramones) · [GitHub](https://github.com/ferchox920)

---
# Firebase-Studio
