const { success, error } = require('../utils/reponse');
const authService = require('../services/authService');

function handleErreur(res, err, messageParDefaut) {
  if (err.status) {
    return error(res, err.message, err.status, err.type);
  }
  return error(res, messageParDefaut, 500, 'server-error');
}

async function register(req, res) {
  try {
    const { utilisateur, token } = await authService.register(req.body);
    return success(res, { utilisateur, token }, 201);
  } catch (err) {
    return handleErreur(res, err, "Erreur lors de l'inscription");
  }
}

async function login(req, res) {
  try {
    const { utilisateur, token } = await authService.login(req.body);
    return success(res, { utilisateur, token }, 200);
  } catch (err) {
    return handleErreur(res, err, 'Erreur lors de la connexion');
  }
}

module.exports = { register, login };