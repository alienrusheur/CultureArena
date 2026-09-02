const express = require('express');
const router = express.Router();
const quizCtrl = require('../controllers/quizController');
const partieCtrl = require('../controllers/partieController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', quizCtrl.getAll);
router.get('/:id', quizCtrl.getById);
router.post('/', authMiddleware, quizCtrl.create);
router.put('/:id', authMiddleware, quizCtrl.update);
router.delete('/:id', authMiddleware, quizCtrl.remove);

router.post('/:id/terminer', authMiddleware, partieCtrl.terminerQuiz);

module.exports = router;