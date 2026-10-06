// Las variables se cargan desde .env con `node --env-file=.env` (ver scripts de package.json).
const { JWT_SECRET, JWT_EXPIRES_IN = '3600', PORT = '3000', DB_PATH = 'vendehumos.db' } = process.env;

if (!JWT_SECRET) {
  throw new Error('Falta la variable de entorno JWT_SECRET (defínela en .env)');
}

module.exports = {
  port: Number(PORT),
  dbPath: DB_PATH,
  jwtSecret: JWT_SECRET,
  // Duración del token en segundos
  jwtExpiresIn: Number(JWT_EXPIRES_IN),
};
