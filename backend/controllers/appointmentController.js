const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private
const getAppointments = async (req, res, next) => {
  try {
    let query = {};

    if (req.user.role === 'Patient') {
      const patient = await Patient.findOne({ user: req.user._id });
      if (patient) query.patient = patient._id;
    } else if (req.user.role === 'Doctor') {
      const doctor = await Doctor.findOne({ user: req.user._id });
      if (doctor) query.doctor = doctor._id;
    }

    const appointments = await Appointment.find(query)
      .populate('patient', 'name patientId')
      .populate('doctor', 'name specialization doctorId');
    res.json(appointments);
  } catch (error) {
    next(error);
  }
};

// @desc    Get appointment by ID
// @route   GET /api/appointments/:id
// @access  Private
const getAppointmentById = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'name patientId')
      .populate('doctor', 'name specialization doctorId');

    if (appointment) {
      res.json(appointment);
    } else {
      res.status(404);
      throw new Error('Appointment not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create an appointment
// @route   POST /api/appointments
// @access  Private
const createAppointment = async (req, res, next) => {
  try {
    const { appointmentId, patient, doctor, date, time, symptoms, notes } = req.body;

    const appointment = new Appointment({
      appointmentId,
      patient,
      doctor,
      date,
      time,
      symptoms,
      notes,
    });

    const createdAppointment = await appointment.save();
    res.status(201).json(createdAppointment);
  } catch (error) {
    next(error);
  }
};

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// @access  Private
const updateAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (appointment) {
      appointment.date = req.body.date || appointment.date;
      appointment.time = req.body.time || appointment.time;
      appointment.status = req.body.status || appointment.status;
      appointment.symptoms = req.body.symptoms || appointment.symptoms;
      appointment.notes = req.body.notes || appointment.notes;

      const updatedAppointment = await appointment.save();
      res.json(updatedAppointment);
    } else {
      res.status(404);
      throw new Error('Appointment not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Private (Admin)
const deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (appointment) {
      await Appointment.deleteOne({ _id: appointment._id });
      res.json({ message: 'Appointment removed' });
    } else {
      res.status(404);
      throw new Error('Appointment not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
};
