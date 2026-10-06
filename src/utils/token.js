const { createHmac, timingSafeEqual } = require('node:crypto');
const { jwtSecret, jwtExpiresIn } = require('../config');

// JWT HS256 implementado con node:crypto.
const encode = (value) => Buffer.from(JSON.stringify(value)).toString('base64url');
const sign = (data) => createHmac('sha256', jwtSecret).update(data).digest('base64url');

const signToken = (payload) => {
  const now = Math.floor(Date.now() / 1000);
  const header = encode({ alg: 'HS256', typ: 'JWT' });
  const body = encode({ ...payload, iat: now, exp: now + jwtExpiresIn });
  const data = `${header}.${body}`;
  return `${data}.${sign(data)}`;
};

// Devuelve el payload si el token es válido y no ha caducado; si no, null.
const verifyToken = (token) => {
  const parts = typeof token === 'string' ? token.split('.') : [];
  if (parts.length !== 3) return null;

  const [header, body, signature] = parts;
  const expected = Buffer.from(sign(`${header}.${body}`));
  const received = Buffer.from(signature);
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString());
    return payload.exp > Math.floor(Date.now() / 1000) ? payload : null;
  } catch {
    return null;
  }
};

module.exports = { signToken, verifyToken };
