const Doctor = require('../models/Doctor');

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public
const getDoctors = async (req, res, next) => {
  try {
    const doctors = await Doctor.find({}).populate('user', 'name email');
    res.json(doctors);
  } catch (error) {
    next(error);
  }
};

// @desc    Get doctor by ID
// @route   GET /api/doctors/:id
// @access  Public
const getDoctorById = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('user', 'name email');
    if (doctor) {
      res.json(doctor);
    } else {
      res.status(404);
      throw new Error('Doctor not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a doctor profile
// @route   POST /api/doctors
// @access  Private (Admin)
const createDoctor = async (req, res, next) => {
  try {
    const {
      user,
      doctorId,
      name,
      specialization,
      qualification,
      experience,
      phone,
      email,
      availability,
      consultationFee,
    } = req.body;

    const doctorExists = await Doctor.findOne({ doctorId });

    if (doctorExists) {
      res.status(400);
      throw new Error('Doctor ID already exists');
    }

    const doctor = new Doctor({
      user,
      doctorId,
      name,
      specialization,
      qualification,
      experience,
      phone,
      email,
      availability,
      consultationFee,
    });

    const createdDoctor = await doctor.save();
    res.status(201).json(createdDoctor);
  } catch (error) {
    next(error);
  }
};

// @desc    Update doctor profile
// @route   PUT /api/doctors/:id
// @access  Private (Admin/Doctor)
const updateDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (doctor) {
      doctor.name = req.body.name || doctor.name;
      doctor.specialization = req.body.specialization || doctor.specialization;
      doctor.qualification = req.body.qualification || doctor.qualification;
      doctor.experience = req.body.experience || doctor.experience;
      doctor.phone = req.body.phone || doctor.phone;
      doctor.email = req.body.email || doctor.email;
      doctor.availability = req.body.availability || doctor.availability;
      doctor.consultationFee = req.body.consultationFee || doctor.consultationFee;

      const updatedDoctor = await doctor.save();
      res.json(updatedDoctor);
    } else {
      res.status(404);
      throw new Error('Doctor not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete doctor
// @route   DELETE /api/doctors/:id
// @access  Private (Admin)
const deleteDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (doctor) {
      await Doctor.deleteOne({ _id: doctor._id });
      res.json({ message: 'Doctor removed' });
    } else {
      res.status(404);
      throw new Error('Doctor not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
};
