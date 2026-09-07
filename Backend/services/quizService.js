const mongoose = require('mongoose');

const Quiz = require('../schemas/quizschema');

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
  return Quiz.find();
}

async function getById(id) {

  if (!estIdValide(id)) {
    throw serviceError(
      'Identifiant de quiz invalide',
      400,
      'validator'
    );
  }

  const quiz = await Quiz.findById(id);

  if (!quiz) {
    throw serviceError(
      'Quiz non trouvé',
      404,
      'not-found'
    );
  }

  return quiz;
}

async function create(
  createurId,
  { nomQuiz, description, favoris, niveau, questions }
) {

  if (!nomQuiz || !description) {
    throw serviceError(
      'nomQuiz et description sont requis',
      400,
      'validator'
    );
  }

  if (!Array.isArray(questions) || questions.length === 0) {
    throw serviceError(
      'Le quiz doit contenir au moins une question',
      400,
      'validator'
    );
  }

  const questionInvalide = questions.find((q) =>
    !q.enonce || !q.optionA || !q.optionB || !q.optionC || !q.optionD || !q.reponse
  );
  if (questionInvalide) {
    throw serviceError(
      'Chaque question doit avoir un enonce, 4 options (A à D) et une reponse',
      400,
      'validator'
    );
  }

  const reponseIncoherente = questions.find((q) =>
    ![q.optionA, q.optionB, q.optionC, q.optionD].includes(q.reponse)
  );
  if (reponseIncoherente) {
    throw serviceError(
      'La reponse doit correspondre exactement à l\'une des options A, B, C ou D',
      400,
      'validator'
    );
  }

  try {

    return await Quiz.create({
      nomQuiz,
      createurId,
      description,
      favoris: favoris ?? false,
      niveau: niveau ?? 1,
      questions
    });

  } catch (err) {

    if (err.name === 'ValidationError') {
      throw serviceError(
        err.message,
        400,
        'validator'
      );
    }

    throw err;
  }
}

function verifierProprietaire(quiz, userId, role) {

  const estProprietaire =
    quiz.createurId.toString() === userId;

  const estAdmin = role === 'admin';

  if (!estProprietaire && !estAdmin) {
    throw serviceError(
      'Vous ne pouvez modifier que vos propres quiz',
      403,
      'forbidden'
    );
  }
}

async function update(id, userId, role, donnees) {

  if (!estIdValide(id)) {
    throw serviceError(
      'Identifiant de quiz invalide',
      400,
      'validator'
    );
  }

  const quiz = await Quiz.findById(id);

  if (!quiz) {
    throw serviceError(
      'Quiz non trouvé',
      404,
      'not-found'
    );
  }

  verifierProprietaire(
    quiz,
    userId,
    role
  );

  // Le créateur ne peut jamais être modifié
  delete donnees.createurId;

  if (Array.isArray(donnees.questions)) {
    donnees.nombreQuestions = donnees.questions.length;
  }

  try {

    const quizMisAJour =
      await Quiz.findByIdAndUpdate(
        id,
        donnees,
        {
          new: true,
          runValidators: true
        }
      );

    return quizMisAJour;

  } catch (err) {

    if (err.name === 'ValidationError') {
      throw serviceError(
        err.message,
        400,
        'validator'
      );
    }

    throw err;
  }
}

async function remove(id, userId, role) {

  if (!estIdValide(id)) {
    throw serviceError(
      'Identifiant de quiz invalide',
      400,
      'validator'
    );
  }

  const quiz = await Quiz.findById(id);

  if (!quiz) {
    throw serviceError(
      'Quiz non trouvé',
      404,
      'not-found'
    );
  }

  verifierProprietaire(
    quiz,
    userId,
    role
  );

  await Quiz.findByIdAndDelete(id);

  return quiz;
}

async function corriger(
  quizId,
  reponsesUtilisateur
) {

  const quiz = await getById(quizId);

  if (
    !Array.isArray(reponsesUtilisateur) ||
    reponsesUtilisateur.length !== quiz.questions.length
  ) {
    throw serviceError(
      `Le tableau de réponses doit contenir exactement ${quiz.questions.length} éléments`,
      400,
      'validator'
    );
  }

  let bonnesReponses = 0;

  const details = quiz.questions.map(
    (question, i) => {

      const reponseDonnee =
        String(
          reponsesUtilisateur[i] ?? ''
        )
          .trim()
          .toLowerCase();

      const reponseAttendue =
        String(question.reponse)
          .trim()
          .toLowerCase();

      const correcte =
        reponseDonnee === reponseAttendue;

      if (correcte) {
        bonnesReponses++;
      }

      return {
        enonce: question.enonce,
        correcte
      };
    }
  );

  return {
    quizId: quiz._id,
    totalQuestions: quiz.questions.length,
    bonnesReponses,
    details
  };
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  corriger
};