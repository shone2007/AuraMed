const MedicalRecord = require('../models/MedicalRecord');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

// @desc    Get all medical records
// @route   GET /api/records
// @access  Private
const getRecords = async (req, res, next) => {
  try {
    let query = {};

    if (req.user.role === 'Patient') {
      const patient = await Patient.findOne({ user: req.user._id });
      if (patient) query.patient = patient._id;
    } else if (req.user.role === 'Doctor') {
      const doctor = await Doctor.findOne({ user: req.user._id });
      if (doctor) query.doctor = doctor._id;
    }

    const records = await MedicalRecord.find(query)
      .populate('patient', 'name patientId')
      .populate('doctor', 'name specialization doctorId')
      .populate('appointment', 'date time');
    res.json(records);
  } catch (error) {
    next(error);
  }
};

// @desc    Get record by ID
// @route   GET /api/records/:id
// @access  Private
const getRecordById = async (req, res, next) => {
  try {
    const record = await MedicalRecord.findById(req.params.id)
      .populate('patient', 'name patientId')
      .populate('doctor', 'name specialization doctorId')
      .populate('appointment', 'date time');

    if (record) {
      res.json(record);
    } else {
      res.status(404);
      throw new Error('Record not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a medical record
// @route   POST /api/records
// @access  Private (Doctor)
const createRecord = async (req, res, next) => {
  try {
    const { recordId, patient, doctor, appointment, diagnosis, prescription, treatment, notes } = req.body;

    const record = new MedicalRecord({
      recordId,
      patient,
      doctor,
      appointment,
      diagnosis,
      prescription,
      treatment,
      notes,
    });

    const createdRecord = await record.save();
    res.status(201).json(createdRecord);
  } catch (error) {
    next(error);
  }
};

// @desc    Update record
// @route   PUT /api/records/:id
// @access  Private (Doctor)
const updateRecord = async (req, res, next) => {
  try {
    const record = await MedicalRecord.findById(req.params.id);

    if (record) {
      record.diagnosis = req.body.diagnosis || record.diagnosis;
      record.prescription = req.body.prescription || record.prescription;
      record.treatment = req.body.treatment || record.treatment;
      record.notes = req.body.notes || record.notes;

      const updatedRecord = await record.save();
      res.json(updatedRecord);
    } else {
      res.status(404);
      throw new Error('Record not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete record
// @route   DELETE /api/records/:id
// @access  Private (Admin)
const deleteRecord = async (req, res, next) => {
  try {
    const record = await MedicalRecord.findById(req.params.id);

    if (record) {
      await MedicalRecord.deleteOne({ _id: record._id });
      res.json({ message: 'Record removed' });
    } else {
      res.status(404);
      throw new Error('Record not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRecords,
  getRecordById,
  createRecord,
  updateRecord,
  deleteRecord,
};
