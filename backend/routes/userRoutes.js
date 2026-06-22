const express = require('express');
const router = express.Router();
const { getUsers, getUserById, deleteUser } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('Admin'));

router.route('/').get(getUsers);
router.route('/:id').get(getUserById).delete(deleteUser);

module.exports = router;
