const authService = require('../services/auth.service');

const register = async (req, res) => {
  const session = await authService.register(req.body ?? {});
  res.status(201).json(session);
};

const login = async (req, res) => {
  const session = await authService.login(req.body ?? {});
  res.status(200).json(session);
};

module.exports = { register, login };
