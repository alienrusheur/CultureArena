const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/utilisateursController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.put('/:id', authMiddleware, ctrl.update);
router.put('/:id/role', authMiddleware, adminMiddleware, ctrl.changerRole);
router.delete('/:id', authMiddleware, ctrl.remove);

module.exports = router;