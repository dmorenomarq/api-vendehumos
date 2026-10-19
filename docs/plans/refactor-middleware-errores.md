# Plan: Middleware de gestión de errores

**Tipo:** refactor
**Tiempo total estimado:** 30 min

## Objetivo

Hoy el manejador de errores está escrito en línea dentro de `src/app.js` (líneas 10-20). Se quiere moverlo a `src/middlewares/` para que `app.js` solo monte middleware, como dice la arquitectura. El comportamiento externo de la API no cambia.

**Supuestos:**
- El middleware es una clase `ErrorMiddleware` con método `handle_error` en `snake_case`, como exige CLAUDE.md. Es un método `static`, porque Express exige la firma de 4 argumentos `(err, req, res, next)`.
- El archivo se llama `src/middlewares/error.middleware.js`, igual que `*.controller.js` y `*.service.js`.
- `AppError` se queda en `src/utils/errors.js`, porque ya es una clase y los services la importan.

**Fuera de alcance:** convertir los controllers a clases (hoy son funciones sueltas), añadir un middleware de 404 o de autenticación, y cambiar los mensajes o códigos de error.

## Tareas

| # | Tarea | Archivos | Min | Hecha |
|---|-------|----------|-----|-------|
| 1 | Crear la clase `ErrorMiddleware` con `handle_error(err, req, res, next)`. Traslada las tres ramas actuales sin cambios: `AppError` → `err.statusCode`, `entity.parse.failed` → 400 `JSON inválido`, resto → `console.error` y 500 `Error interno del servidor`. Exporta la clase. | `src/middlewares/error.middleware.js` | 8 | [x] |
| 2 | En `app.js`, sustituir el handler en línea por `app.use(ErrorMiddleware.handle_error)` y quitar el `require` de `AppError`, que ya no se usa. Mantener el comentario sobre Express 5 y los handlers async. | `src/app.js` | 5 | [x] |
| 3 | Escribir pruebas con `node:test` y `node:assert`, llamando a `handle_error` con un `res` falso. Cubrir los tres casos: `AppError(409, ...)`, error con `type: 'entity.parse.failed'` y error genérico, comprobando el 500 y que no se filtra el mensaje interno. | `src/middlewares/error.middleware.test.js` | 10 | [ ] |
| 4 | Verificar con la API arrancada: JSON mal formado, `POST /auth/login` con credenciales erróneas y `POST /auth/register` con un email repetido. Comparar status y cuerpo con los de antes del refactor. | — | 7 | [ ] |

## Criterios de aceptación

- [ ] Las respuestas de la API (cuerpos y códigos de estado) son idénticas a las de antes.
- [ ] `POST /auth/login` con credenciales inválidas devuelve 401 `{ "error": "Credenciales inválidas" }`.
- [ ] `POST /auth/register` con un email ya registrado devuelve 409 `{ "error": "El email ya está registrado" }`.
- [ ] Un body con JSON mal formado devuelve 400 `{ "error": "JSON inválido" }`.
- [ ] Un error no controlado devuelve 500 `{ "error": "Error interno del servidor" }`, sin mostrar el mensaje original, y se registra con `console.error`.
- [ ] `app.js` no contiene lógica de errores; solo monta `ErrorMiddleware.handle_error`, y lo hace después de `routes`.
- [ ] `src/middlewares/error.middleware.js` contiene una clase con método en `snake_case`, usa CommonJS, exporta la clase y no usa librerías externas.
- [ ] `node --test` pasa con las pruebas nuevas.
