const { AppError } = require('../utils/errors');

class ErrorMiddleware {
  // Express identifica un manejador de errores por su firma de 4 argumentos
  static handle_error(err, req, res, next) {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    if (err.type === 'entity.parse.failed') {
      return res.status(400).json({ error: 'JSON inválido' });
    }
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

module.exports = ErrorMiddleware;
