const express = require('express');
const router = express.Router();
const {
  getBills,
  getBillById,
  createBill,
  updateBill,
  deleteBill,
} = require('../controllers/billController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router
  .route('/')
  .get(getBills)
  .post(authorize('Admin'), createBill);

router
  .route('/:id')
  .get(getBillById)
  .put(authorize('Admin'), updateBill)
  .delete(authorize('Admin'), deleteBill);

module.exports = router;
