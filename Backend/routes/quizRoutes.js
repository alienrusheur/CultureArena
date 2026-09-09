const express = require('express');
const router = express.Router();
const quizCtrl = require('../controllers/quizController');
const partieCtrl = require('../controllers/partieController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

router.get('/', quizCtrl.getAll);
router.get('/:id', quizCtrl.getById);
router.post('/', authMiddleware, quizCtrl.create);
router.put('/:id', authMiddleware, quizCtrl.update);
router.put('/:id/QuizDuJour', authMiddleware, adminMiddleware, quizCtrl.definirQuizDuJour);
router.delete('/:id', authMiddleware, quizCtrl.remove);

router.post('/:id/terminer', authMiddleware, partieCtrl.terminerQuiz);

module.exports = router;