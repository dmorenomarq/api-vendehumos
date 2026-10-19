const test = require('node:test');
const assert = require('node:assert');
const ErrorMiddleware = require('./error.middleware');
const { AppError } = require('../utils/errors');

class FakeRes {
  status(code) {
    this.status_code = code;
    return this;
  }

  json(body) {
    this.body = body;
    return this;
  }
}

test('responde con el statusCode y el mensaje de un AppError', () => {
  const res = new FakeRes();
  ErrorMiddleware.handle_error(new AppError(409, 'El email ya está registrado'), {}, res, () => {});
  assert.strictEqual(res.status_code, 409);
  assert.deepStrictEqual(res.body, { error: 'El email ya está registrado' });
});

test('responde 400 ante un JSON mal formado', () => {
  const res = new FakeRes();
  const err = Object.assign(new Error('Unexpected token'), { type: 'entity.parse.failed' });
  ErrorMiddleware.handle_error(err, {}, res, () => {});
  assert.strictEqual(res.status_code, 400);
  assert.deepStrictEqual(res.body, { error: 'JSON inválido' });
});

test('responde 500 sin filtrar el mensaje interno y lo registra', (t) => {
  const log = t.mock.method(console, 'error', () => {});
  const res = new FakeRes();
  const err = new Error('secreto interno');
  ErrorMiddleware.handle_error(err, {}, res, () => {});
  assert.strictEqual(res.status_code, 500);
  assert.deepStrictEqual(res.body, { error: 'Error interno del servidor' });
  assert.strictEqual(log.mock.callCount(), 1);
  assert.strictEqual(log.mock.calls[0].arguments[0], err);
});
