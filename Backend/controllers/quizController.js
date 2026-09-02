const { success, error } = require('../utils/reponse');
const quizService = require('../services/quizService');

function handleErreur(res, err, messageParDefaut) {
  if (err.status) {
    return error(res, err.message, err.status, err.type);
  }
  return error(res, messageParDefaut, 500, 'server-error');
}

async function getAll(req, res) {
  try {
    const quizzes = await quizService.getAll();
    return success(res, quizzes, 200);
  } catch (err) {
    return handleErreur(res, err, 'Erreur lors de la récupération des quiz');
  }
}

async function getById(req, res) {
  try {
    const quiz = await quizService.getById(req.params.id);
    return success(res, quiz, 200);
  } catch (err) {
    return handleErreur(res, err, 'Erreur lors de la récupération du quiz');
  }
}

async function create(req, res) {
  try {
    const nouveauQuiz = await quizService.create(req.user.id, req.body);
    return success(res, nouveauQuiz, 201);
  } catch (err) {
    return handleErreur(res, err, 'Erreur lors de la création du quiz');
  }
}

async function update(req, res) {
  try {
    const quizMisAJour = await quizService.update(req.params.id, req.user.id, req.user.role, req.body);
    return success(res, quizMisAJour, 200);
  } catch (err) {
    return handleErreur(res, err, 'Erreur lors de la mise à jour du quiz');
  }
}

async function remove(req, res) {
  try {
    const quizSupprime = await quizService.remove(req.params.id, req.user.id, req.user.role);
    return success(res, quizSupprime, 200);
  } catch (err) {
    return handleErreur(res, err, 'Erreur lors de la suppression du quiz');
  }
}

module.exports = { getAll, getById, create, update, remove };