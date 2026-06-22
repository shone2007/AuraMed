const express = require('express');
const router = express.Router();
const {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/authMiddleware');

router
  .route('/')
  .get(getDoctors)
  .post(protect, authorize('Admin'), createDoctor);

router
  .route('/:id')
  .get(getDoctorById)
  .put(protect, authorize('Admin', 'Doctor'), updateDoctor)
  .delete(protect, authorize('Admin'), deleteDoctor);

module.exports = router;
