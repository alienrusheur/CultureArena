const { error } = require('../utils/reponse');

function adminMiddleware(req, res, next) {
  if (req.user.role !== 'admin') {
    return error(res, 'Accès réservé aux administrateurs', 403, 'forbidden');
  }
  return next();
}

module.exports = adminMiddleware;