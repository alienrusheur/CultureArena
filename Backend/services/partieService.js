const mongoose = require('mongoose');
const Partie = require('../schemas/partieSchema');
const Utilisateur = require('../schemas/utilisateurSchema');

function serviceError(message, status, type) {
  const err = new Error(message);
  err.status = status;
  err.type = type;
  return err;
}

function estIdValide(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

async function getAll() {
  return Partie.find();
}

async function getById(id) {
  if (!estIdValide(id)) {
    throw serviceError('Identifiant de partie invalide', 400, 'validator');
  }

  const p = await Partie.findById(id);
  if (!p) {
    throw serviceError('Partie non trouvée', 404, 'not-found');
  }
  return p;
}

// Barème de récompenses : ajustable selon l'équilibrage du jeu
const PIECES_PAR_BONNE_REPONSE = 10;
const EXP_PAR_BONNE_REPONSE = 20;
const MULTIPLICATEUR_EXP_REQUISE = 1.2;

/**
 * Enregistre le résultat d'une partie et applique les récompenses
 * (pièces, exp, éventuelle montée de niveau) à l'utilisateur.
 */
async function create(userId, quizId, bonnesReponses) {
  if (!estIdValide(userId)) {
    throw serviceError('Identifiant utilisateur invalide', 400, 'validator');
  }
  if (!estIdValide(quizId)) {
    throw serviceError('Identifiant de quiz invalide', 400, 'validator');
  }

  const utilisateur = await Utilisateur.findById(userId);
  if (!utilisateur) {
    throw serviceError('Utilisateur non trouvé', 404, 'not-found');
  }

  const score = bonnesReponses * PIECES_PAR_BONNE_REPONSE;
  const expGagnee = bonnesReponses * EXP_PAR_BONNE_REPONSE;

  const partie = await Partie.create({ userId, quizId, score });

  // Applique les récompenses
  utilisateur.nombredepieces += score;
  utilisateur.exp.actuel += expGagnee;

  // Gère la ou les montées de niveau (au cas où plusieurs paliers sont franchis d'un coup)
  let niveauxGagnes = 0;
  while (utilisateur.exp.actuel >= utilisateur.exp.requis) {
    utilisateur.exp.actuel -= utilisateur.exp.requis;
    utilisateur.niveau += 1;
    utilisateur.exp.requis = Math.round(utilisateur.exp.requis * MULTIPLICATEUR_EXP_REQUISE);
    niveauxGagnes++;
  }

  await utilisateur.save();

  return {
    partie,
    recompenses: {
      piecesGagnees: score,
      expGagnee,
      niveauxGagnes,
    },
    utilisateur,
  };
}

async function getClassement(quizId) {
  if (!estIdValide(quizId)) {
    throw serviceError('Identifiant de quiz invalide', 400, 'validator');
  }

  const classement = await Partie.aggregate([
    { $match: { quizId: new mongoose.Types.ObjectId(quizId) } },
    { $sort: { score: -1 } },
    // Garde uniquement le meilleur score de chaque joueur pour ce quiz
    { $group: { _id: '$userId', meilleurScore: { $first: '$score' } } },
    { $sort: { meilleurScore: -1 } },
    {
      $lookup: {
        from: 'utilisateurs',
        localField: '_id',
        foreignField: '_id',
        as: 'utilisateur',
      },
    },
    { $unwind: '$utilisateur' },
    {
      $project: {
        _id: 0,
        userId: '$_id',
        pseudonyme: '$utilisateur.pseudonyme',
        score: '$meilleurScore',
      },
    },
  ]);

  return classement;
}

module.exports = { getAll, getById, create, getClassement };
