const { success, error } = require('../utils/reponse.js');
const partieService = require('../services/partieService.js');
const quizService = require('../services/quizService.js');

function handleErreur(res, err, messageParDefaut) {
  if (err.status) {
    return error(res, err.message, err.status, err.type);
  }
  return error(res, messageParDefaut, 500, 'server-error');
}

async function getAll(req, res) {
  try {
    const parties = await partieService.getAll();
    return success(res, parties, 200);
  } catch (err) {
    return handleErreur(res, err, 'Erreur lors de la récupération des parties');
  }
}

async function getById(req, res) {
  try {
    const p = await partieService.getById(req.params.id);
    return success(res, p, 200);
  } catch (err) {
    return handleErreur(res, err, 'Erreur lors de la récupération de la partie');
  }
}

/**
 * POST /quizzes/:id/terminer
 * body: { reponses: ['reponse1', 'reponse2', ...] }
 * Corrige les réponses, enregistre la partie, applique les récompenses.
 */
async function terminerQuiz(req, res) {
  try {
    const quizId = req.params.id;
    const { reponses } = req.body;

    const correction = await quizService.corriger(quizId, reponses);
    const resultat = await partieService.create(req.user.id, quizId, correction.bonnesReponses);

    return success(
      res,
      {
        correction,
        recompenses: resultat.recompenses,
        utilisateur: resultat.utilisateur,
      },
      201
    );
  } catch (err) {
    return handleErreur(res, err, 'Erreur lors de la validation du quiz');
  }
}

async function getClassement(req, res) {
  try {
    const classement = await partieService.getClassement(req.params.id);
    return success(res, classement, 200);
  } catch (err) {
    return handleErreur(res, err, 'Erreur lors de la récupération du classement');
  }
}

module.exports = { getAll, getById, terminerQuiz, getClassement };
