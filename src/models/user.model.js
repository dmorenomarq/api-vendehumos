// Entidad User: { id, email, passwordHash, createdAt }
const createUser = ({ id, email, passwordHash }) => ({
  id,
  email: email.trim().toLowerCase(),
  passwordHash,
  createdAt: new Date().toISOString(),
});

// Representación segura para devolver al cliente (sin passwordHash)
const toPublicUser = ({ id, email }) => ({ id, email });

module.exports = { createUser, toPublicUser };
