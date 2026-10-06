# CLAUDE.md

Este archivo da orientación a Claude Code (claude.ai/code) para trabajar con el código de este repositorio.

## Comandos

- `npm install`: instala las dependencias
- `npm start`: arranca la API (`node --env-file=.env src/server.js`); requiere un `.env` (copia `.env.example`)
- `npm run dev`: igual, con `--watch` para recarga automática

Todavía no hay test runner, linter ni paso de build configurados.

## Convenciones

- **Dependencias externas:** no se usan librerías externas siempre que exista una solución nativa de Node. La excepción es Express, que es la base del proyecto. Antes de añadir una dependencia, comprueba si el módulo estándar de Node lo resuelve (por ejemplo `node:crypto`, `node:test`, `node:assert`).
- **Variables de entorno:** se cargan desde un archivo `.env` (o similar, según el entorno), sin librerías como `dotenv`. Usa la carga nativa de Node (`node --env-file=.env`, o `process.loadEnvFile()`). El `.env` no se versiona.
- **Módulos:** CommonJS (`require`).
- **Clases en las capas:** los archivos de routes, controllers, services, repositories y models contienen clases, no funciones sueltas. Toda función va dentro de una clase como método, y cada archivo exporta su clase.
- **Nombres de métodos en `snake_case`** (por ejemplo `find_by_email`, `create_user`). Los nombres de las clases siguen en `PascalCase`.
- **Base de datos:** SQLite. Se accede solo desde la capa de repositories. Como la convención es no usar librerías externas, usa el módulo nativo `node:sqlite` (`DatabaseSync`) en lugar del paquete `sqlite3` de npm. Requiere Node 22.5 o superior.

## Arquitectura

API Express 5 organizada por capas. Cada capa solo habla con la inmediatamente inferior, y las dependencias van siempre hacia abajo:

```
routes → controllers → services → repositories → models
```

- **routes:** declaran los endpoints y los asocian a un controller. No contienen lógica.
- **controllers:** leen la petición HTTP (body, params, query), llaman al service y construyen la respuesta y el código de estado. No contienen reglas de negocio ni acceden a datos.
- **services:** la lógica de negocio. No conocen `req` ni `res`; reciben datos simples y lanzan errores propios que el controller traduce a HTTP.
- **repositories:** el único punto de acceso a los datos (SQLite). Si se cambia el almacenamiento, solo se toca esta capa.
- **models:** la definición de las entidades y sus campos.

`app.js` construye y exporta la app Express (middleware y montaje de rutas) sin escuchar, y `server.js` solo llama a `listen`. Se mantienen separados para poder importar la app en tests sin abrir un puerto.

### Autenticación

Endpoints: `POST /auth/register` y `POST /auth/login`, ambos con `{ email, password }` y respuesta `{ user: { id, email }, token }`. El login devuelve el mismo 401 para un email desconocido y para una contraseña incorrecta, a propósito. El hash de contraseñas (`scrypt`) y el JWT HS256 están implementados con `node:crypto` en `src/utils/`. `verifyToken` existe pero todavía no hay middleware que lo use en rutas protegidas.

## Documentación adicional

- `docs/api/pagination.md`: convenciones de paginación de la API. Léelo solo cuando vayas a crear o modificar un endpoint que devuelva un listado (colecciones de recursos); no hace falta para el resto de tareas.

## Variables de entorno

Se leen una sola vez en `src/config.js`; el resto del código importa de ahí y no toca `process.env`.

- `JWT_SECRET`: obligatoria; la app no arranca sin ella.
- `JWT_EXPIRES_IN` (segundos, por defecto 3600), `PORT` (por defecto 3000): opcionales.
