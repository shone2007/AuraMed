const Patient = require('../models/Patient');

// @desc    Get all patients
// @route   GET /api/patients
// @access  Private (Admin/Doctor)
const getPatients = async (req, res, next) => {
  try {
    const patients = await Patient.find({}).populate('user', 'name email');
    res.json(patients);
  } catch (error) {
    next(error);
  }
};

// @desc    Get patient by ID
// @route   GET /api/patients/:id
// @access  Private
const getPatientById = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id).populate('user', 'name email');
    if (patient) {
      res.json(patient);
    } else {
      res.status(404);
      throw new Error('Patient not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a patient profile
// @route   POST /api/patients
// @access  Private (Admin/Patient)
const createPatient = async (req, res, next) => {
  try {
    const {
      user,
      patientId,
      name,
      age,
      gender,
      bloodGroup,
      phone,
      address,
      emergencyContact,
    } = req.body;

    const patientExists = await Patient.findOne({ patientId });

    if (patientExists) {
      res.status(400);
      throw new Error('Patient ID already exists');
    }

    const patient = new Patient({
      user: user || req.user._id,
      patientId,
      name,
      age,
      gender,
      bloodGroup,
      phone,
      address,
      emergencyContact,
    });

    const createdPatient = await patient.save();
    res.status(201).json(createdPatient);
  } catch (error) {
    next(error);
  }
};

// @desc    Update patient profile
// @route   PUT /api/patients/:id
// @access  Private
const updatePatient = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (patient) {
      patient.name = req.body.name || patient.name;
      patient.age = req.body.age || patient.age;
      patient.gender = req.body.gender || patient.gender;
      patient.bloodGroup = req.body.bloodGroup || patient.bloodGroup;
      patient.phone = req.body.phone || patient.phone;
      patient.address = req.body.address || patient.address;
      patient.emergencyContact = req.body.emergencyContact || patient.emergencyContact;

      const updatedPatient = await patient.save();
      res.json(updatedPatient);
    } else {
      res.status(404);
      throw new Error('Patient not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete patient
// @route   DELETE /api/patients/:id
// @access  Private (Admin)
const deletePatient = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (patient) {
      await Patient.deleteOne({ _id: patient._id });
      res.json({ message: 'Patient removed' });
    } else {
      res.status(404);
      throw new Error('Patient not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
};
