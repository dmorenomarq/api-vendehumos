const { createUser } = require('../models/user.model');

// Almacenamiento en memoria: se pierde al reiniciar. Sustituir por una base de datos
// manteniendo la misma interfaz (async) para no tocar los services.
const users = new Map();

const normalize = (email) => email.trim().toLowerCase();

const findByEmail = async (email) => users.get(normalize(email)) ?? null;

const create = async ({ email, passwordHash }) => {
  const user = createUser({ id: users.size + 1, email, passwordHash });
  users.set(user.email, user);
  return user;
};

module.exports = { findByEmail, create };
