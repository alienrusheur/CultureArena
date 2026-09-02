const { success, error } = require('../utils/reponse');
const utilisateurService = require('../services/utilisateursServices');

function handleErreur(res, err, messageParDefaut) {
  if (err.status) {
    return error(res, err.message, err.status, err.type);
  }
  return error(res, messageParDefaut, 500, 'server-error');
}

async function getAll(req, res) {
  try {
    const utilisateurs = await utilisateurService.getAll();
    return success(res, utilisateurs, 200);
  } catch (err) {
    return handleErreur(res, err, 'Erreur lors de la récupération des utilisateurs');
  }
}

async function getById(req, res) {
  try {
    const u = await utilisateurService.getById(req.params.id);
    return success(res, u, 200);
  } catch (err) {
    return handleErreur(res, err, "Erreur lors de la récupération de l'utilisateur");
  }
}

async function update(req, res) {
  try {
    const u = await utilisateurService.update(req.params.id, req.user.id, req.body);
    return success(res, u, 200);
  } catch (err) {
    return handleErreur(res, err, "Erreur lors de la mise à jour de l'utilisateur");
  }
}

async function remove(req, res) {
  try {
    const supprime = await utilisateurService.remove(req.params.id, req.user.id);
    return success(res, supprime, 200);
  } catch (err) {
    return handleErreur(res, err, "Erreur lors de la suppression de l'utilisateur");
  }
}

async function changerRole(req, res) {
  try {
    const u = await utilisateurService.changerRole(req.params.id, req.body.role);
    return success(res, u, 200);
  } catch (err) {
    return handleErreur(res, err, 'Erreur lors du changement de rôle');
  }
}

module.exports = { getAll, getById, update, remove, changerRole };