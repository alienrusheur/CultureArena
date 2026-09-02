const { success, error } = require('../utils/reponse');
const boutiqueService = require('../services/boutiqueService');

function handleErreur(res, err, messageParDefaut) {
  if (err.status) {
    return error(res, err.message, err.status, err.type);
  }
  return error(res, messageParDefaut, 500, 'server-error');
}

async function getAll(req, res) {
  try {
    const articles = await boutiqueService.getAll();
    return success(res, articles, 200);
  } catch (err) {
    return handleErreur(res, err, 'Erreur lors de la récupération des articles');
  }
}

async function getById(req, res) {
  try {
    const article = await boutiqueService.getById(req.params.id);
    return success(res, article, 200);
  } catch (err) {
    return handleErreur(res, err, "Erreur lors de la récupération de l'article");
  }
}

async function createArticle(req, res) {
  try {
    const article = await boutiqueService.createArticle(req.body);
    return success(res, article, 201);
  } catch (err) {
    return handleErreur(res, err, "Erreur lors de la création de l'article");
  }
}

async function updateArticle(req, res) {
  try {
    const article = await boutiqueService.updateArticle(req.params.id, req.body);
    return success(res, article, 200);
  } catch (err) {
    return handleErreur(res, err, "Erreur lors de la mise à jour de l'article");
  }
}

async function removeArticle(req, res) {
  try {
    const supprime = await boutiqueService.removeArticle(req.params.id);
    return success(res, supprime, 200);
  } catch (err) {
    return handleErreur(res, err, "Erreur lors de la suppression de l'article");
  }
}

async function acheter(req, res) {
  try {
    const resultat = await boutiqueService.acheter(req.user.id, req.params.id);
    return success(res, resultat, 200);
  } catch (err) {
    return handleErreur(res, err, "Erreur lors de l'achat de l'article");
  }
}

async function getMonInventaire(req, res) {
  try {
    const inventaire = await boutiqueService.getInventaire(req.user.id);
    return success(res, inventaire, 200);
  } catch (err) {
    return handleErreur(res, err, "Erreur lors de la récupération de l'inventaire");
  }
}

module.exports = {
  getAll,
  getById,
  createArticle,
  updateArticle,
  removeArticle,
  acheter,
  getMonInventaire,
};