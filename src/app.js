const express = require('express');
const routes = require('./routes');
const ErrorMiddleware = require('./middlewares/error.middleware');

const app = express();

app.use(express.json());
app.use(routes);

// Express 5 propaga los errores de handlers async a este middleware
app.use(ErrorMiddleware.handle_error);

module.exports = app;
