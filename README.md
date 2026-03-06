# entrega1-nackend2

Entrega N° 1 (Backend II): **CRUD de usuarios + Autenticación/Autorización con Passport Local + JWT + JWT en cookie**.

## Requisitos
- Node.js + npm
- MongoDB local corriendo (o cambiar `MONGO_URL`)

## Instalación
```bash
npm install
```

## Configuración
1) Copiá el `.env.example` a `.env` y ajustá lo que quieras:
```bash
cp .env.example .env
```

## Ejecutar
```bash
npm run dev
```
Servidor por defecto: `http://localhost:8080`

## Endpoints

### Sessions
- **POST** `/api/sessions/register`
  - Body JSON:
    ```json
    { "first_name":"Valen", "last_name":"Test", "email":"valen@test.com", "age":20, "password":"1234" }
    ```
- **POST** `/api/sessions/login`
  - Body JSON:
    ```json
    { "email":"valen@test.com", "password":"1234" }
    ```
  - Respuesta: setea cookie **httpOnly** `token`
- **GET** `/api/sessions/current`
  - Requiere estar logueado (cookie `token` o `Authorization: Bearer <token>`)
  - Devuelve usuario asociado al JWT
- **POST** `/api/sessions/logout`
  - Borra la cookie `token`

### Users (CRUD)
- **GET** `/api/users`
- **GET** `/api/users/:uid`
- **POST** `/api/users`
- **PUT** `/api/users/:uid`
- **DELETE** `/api/users/:uid`

> Nota: Los endpoints de users no están protegidos por defecto para facilitar corrección.  
> Si querés protegerlos, podés envolver rutas con `passport.authenticate("jwt", { session:false })` o con el helper `authJwt()`.

## Notas de seguridad
- La contraseña se almacena hasheada con `bcrypt.hashSync`.
- `email` es único en el schema.
- `/api/sessions/current` valida JWT con Passport (`passport-jwt + passport-local`).
