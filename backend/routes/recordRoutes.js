const express = require('express');
const router = express.Router();
const {
  getRecords,
  getRecordById,
  createRecord,
  updateRecord,
  deleteRecord,
} = require('../controllers/recordController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router
  .route('/')
  .get(getRecords)
  .post(authorize('Doctor', 'Admin'), createRecord);

router
  .route('/:id')
  .get(getRecordById)
  .put(authorize('Doctor', 'Admin'), updateRecord)
  .delete(authorize('Admin'), deleteRecord);

module.exports = router;
