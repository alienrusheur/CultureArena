const mongoose = require('mongoose');

const Quiz = require('../schemas/quizschema');

console.log(
  'IMAGE DANS LE SCHEMA :',
  Quiz.schema.path('questions').schema.path('image')
);

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
    throw serviceError('ID de quiz invalide', 400);
  }

  const quiz = await Quiz.findById(id);

  if (!quiz) {
    throw serviceError('Quiz introuvable', 404);
  }

  verifierProprietaire(quiz, userId, role);

  console.log('===== DONNEES RECUES PAR UPDATE =====');
  console.log(JSON.stringify(donnees, null, 2));

  // Si les données arrivent sous { success, data }
  // on récupère uniquement le contenu de data
  if (donnees?.success === true && donnees?.data) {
    donnees = donnees.data;
  }

  // On ne doit pas modifier ces champs
  delete donnees._id;
  delete donnees.createurId;
  delete donnees.createdAt;
  delete donnees.updatedAt;
  delete donnees.__v;

  // Recalcul du nombre de questions
  if (Array.isArray(donnees.questions)) {
    donnees.nombreQuestions = donnees.questions.length;
  }

  try {

    const quizMisAJour = await Quiz.findByIdAndUpdate(
      id,
      donnees,
      {
        new: true,
        runValidators: true
      }
    );

    console.log('===== QUIZ APRÈS MODIFICATION =====');
    console.log(JSON.stringify(quizMisAJour, null, 2));

    return quizMisAJour;

  } catch (err) {

    if (err.name === 'ValidationError') {
      throw serviceError(err.message, 400, 'validator');
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

async function corriger(quizId, reponsesUtilisateur) {
  const quiz = await getById(quizId);

  if (!Array.isArray(reponsesUtilisateur) || reponsesUtilisateur.length !== quiz.questions.length) {
    throw serviceError(
      `Le tableau de réponses doit contenir exactement ${quiz.questions.length} éléments`,
      400,
      'validator'
    );
  }

  let bonnesReponses = 0;
  let pointsGagnes = 0;
  let piecesGagnees = 0;

  const details = quiz.questions.map((question, i) => {
    const reponseDonnee = String(reponsesUtilisateur[i] ?? '').trim().toLowerCase();
    const reponseAttendue = String(question.reponse).trim().toLowerCase();
    const correcte = reponseDonnee === reponseAttendue;

    if (correcte) {
      bonnesReponses++;
      pointsGagnes += question.points || 0;
      piecesGagnees += question.piecesGagnees || 0;
    }

    return {
      enonce: question.enonce,
      correcte,
      pointsObtenus: correcte ? (question.points || 0) : 0,
      piecesObtenues: correcte ? (question.piecesGagnees || 0) : 0
    };
  });

  return {
    quizId: quiz._id,
    totalQuestions: quiz.questions.length,
    bonnesReponses,
    pointsGagnes,
    piecesGagnees,
    details
  };
}

async function definirQuizDuJour(id, userId, role) {
  if (!estIdValide(id)) {
    throw serviceError('Identifiant de quiz invalide', 400, 'validator');
  }

  const quiz = await Quiz.findById(id);
  if (!quiz) {
    throw serviceError('Quiz non trouvé', 404, 'not-found');
  }

  if (role !== 'admin') {
    throw serviceError('Seul un administrateur peut définir le quiz du jour', 403, 'forbidden');
  }

  await Quiz.updateMany({ estQuizDuJour: true }, { $set: { estQuizDuJour: false } });
  quiz.estQuizDuJour = true;
  await quiz.save();

  return quiz;
}

async function restaurerImagesQuiz() {
  const id = '6a9e869552291bc536de121a';

  const quiz = await Quiz.findById(id);

  if (!quiz) {
    throw new Error('Quiz introuvable');
  }

  quiz.questions[0].image = '/image/RequinMarteau.png';
  quiz.questions[1].image = '/image/requin baleine 1.png';
  quiz.questions[2].image = '/image/bras.png';
  quiz.questions[3].image = '/image/Smart.png';
  quiz.questions[4].image = '/image/Tentacule.png';

  await quiz.save();

  console.log('✅ Images restaurées !');
  console.log(JSON.stringify(quiz, null, 2));

  return quiz;
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  corriger,
  definirQuizDuJour,
  restaurerImagesQuiz
};