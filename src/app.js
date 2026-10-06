const express = require('express');
const routes = require('./routes');
const { AppError } = require('./utils/errors');

const app = express();

app.use(express.json());
app.use(routes);

// Express 5 propaga los errores de handlers async a este middleware
app.use((err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'JSON inválido' });
  }
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

module.exports = app;
