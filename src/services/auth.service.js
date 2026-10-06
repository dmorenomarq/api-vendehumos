const userRepository = require('../repositories/user.repository');
const { toPublicUser } = require('../models/user.model');
const { hashPassword, verifyPassword } = require('../utils/password');
const { signToken } = require('../utils/token');
const { AppError } = require('../utils/errors');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

const buildSession = (user) => ({
  user: toPublicUser(user),
  token: signToken({ sub: user.id, email: user.email }),
});

const register = async ({ email, password }) => {
  if (typeof email !== 'string' || typeof password !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    throw new AppError(400, 'Email y contraseña son obligatorios y el email debe ser válido');
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new AppError(400, `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`);
  }
  if (await userRepository.findByEmail(email)) {
    throw new AppError(409, 'El email ya está registrado');
  }

  const passwordHash = await hashPassword(password);
  const user = await userRepository.create({ email, passwordHash });
  return buildSession(user);
};

const login = async ({ email, password }) => {
  if (typeof email !== 'string' || typeof password !== 'string') {
    throw new AppError(400, 'Email y contraseña son obligatorios');
  }

  const user = await userRepository.findByEmail(email);
  const valid = user && (await verifyPassword(password, user.passwordHash));
  if (!valid) {
    // Mismo error para email desconocido y contraseña incorrecta
    throw new AppError(401, 'Credenciales inválidas');
  }
  return buildSession(user);
};

module.exports = { register, login };
