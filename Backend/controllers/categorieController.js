const { success, error } = require('../utils/reponse');
const categorieService = require('../services/categorieService');

function handleErreur(res, err, messageParDefaut) {
  if (err.status) {
    return error(res, err.message, err.status, err.type);
  }
  return error(res, messageParDefaut, 500, 'server-error');
}

async function getAll(req, res) {
  try {
    const categories = await categorieService.getAll();
    return success(res, categories, 200);
  } catch (err) {
    return handleErreur(res, err, 'Erreur lors de la récupération des catégories');
  }
}

async function getById(req, res) {
  try {
    const c = await categorieService.getById(req.params.id);
    return success(res, c, 200);
  } catch (err) {
    return handleErreur(res, err, 'Erreur lors de la récupération de la catégorie');
  }
}

async function create(req, res) {
  try {
    const nouvelleCategorie = await categorieService.create(req.body);
    return success(res, nouvelleCategorie, 201);
  } catch (err) {
    return handleErreur(res, err, 'Erreur lors de la création de la catégorie');
  }
}

async function update(req, res) {
  try {
    const c = await categorieService.update(req.params.id, req.body);
    return success(res, c, 200);
  } catch (err) {
    return handleErreur(res, err, 'Erreur lors de la mise à jour de la catégorie');
  }
}

async function remove(req, res) {
  try {
    const supprime = await categorieService.remove(req.params.id);
    return success(res, supprime, 200);
  } catch (err) {
    return handleErreur(res, err, 'Erreur lors de la suppression de la catégorie');
  }
}

module.exports = { getAll, getById, create, update, remove };