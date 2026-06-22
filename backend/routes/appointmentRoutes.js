const express = require('express');
const router = express.Router();
const {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router
  .route('/')
  .get(getAppointments)
  .post(createAppointment);

router
  .route('/:id')
  .get(getAppointmentById)
  .put(updateAppointment)
  .delete(authorize('Admin'), deleteAppointment);

module.exports = router;
