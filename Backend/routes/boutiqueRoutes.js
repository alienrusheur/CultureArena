const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/boutiqueController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

router.get('/', ctrl.getAll);
router.get('/mon-inventaire', authMiddleware, ctrl.getMonInventaire);
router.get('/:id', ctrl.getById);
router.post('/', authMiddleware, adminMiddleware, ctrl.createArticle);
router.put('/:id', authMiddleware, adminMiddleware, ctrl.updateArticle);
router.delete('/:id', authMiddleware, adminMiddleware, ctrl.removeArticle);
router.post('/:id/acheter', authMiddleware, ctrl.acheter);

module.exports = router;