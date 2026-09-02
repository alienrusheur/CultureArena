const jwt = require('jsonwebtoken');
const { error } = require('../utils/reponse');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return error(res, 'Token manquant ou mal formé', 401, 'unauthorized');
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id, role: payload.role };
    return next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return error(res, 'Token expiré, veuillez vous reconnecter', 401, 'unauthorized');
    }
    return error(res, 'Token invalide', 401, 'unauthorized');
  }
}

module.exports = authMiddleware;