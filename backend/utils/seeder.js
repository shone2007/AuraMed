const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const MedicalRecord = require('../models/MedicalRecord');
const Bill = require('../models/Bill');
const bcrypt = require('bcryptjs');

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await User.deleteMany();
    await Doctor.deleteMany();
    await Patient.deleteMany();
    await Appointment.deleteMany();
    await MedicalRecord.deleteMany();
    await Bill.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Admin@123', salt);

    // Create Admin
    const createdUsers = await User.insertMany([
      {
        name: 'Admin User',
        email: 'admin@hospital.com',
        password: hashedPassword,
        role: 'Admin',
      },
      {
        name: 'Dr. John Doe',
        email: 'john@hospital.com',
        password: hashedPassword,
        role: 'Doctor',
      },
      {
        name: 'Jane Patient',
        email: 'jane@gmail.com',
        password: hashedPassword,
        role: 'Patient',
      },
    ]);

    const adminUser = createdUsers[0]._id;
    const doctorUser = createdUsers[1]._id;
    const patientUser = createdUsers[2]._id;

    const doctor = await Doctor.create({
      user: doctorUser,
      doctorId: 'DOC001',
      name: 'Dr. John Doe',
      specialization: 'Cardiology',
      qualification: 'MBBS, MD',
      experience: '10 Years',
      phone: '1234567890',
      email: 'john@hospital.com',
      availability: ['Monday', 'Wednesday', 'Friday'],
      consultationFee: 500,
    });

    const patient = await Patient.create({
      user: patientUser,
      patientId: 'PAT001',
      name: 'Jane Patient',
      age: 30,
      gender: 'Female',
      bloodGroup: 'O+',
      phone: '0987654321',
      address: '123 Main St, City',
      emergencyContact: {
        name: 'Jim Patient',
        phone: '1112223333',
        relation: 'Husband',
      },
    });

    const appointment = await Appointment.create({
      appointmentId: 'APP001',
      patient: patient._id,
      doctor: doctor._id,
      date: new Date(),
      time: '10:00 AM',
      status: 'Scheduled',
      symptoms: 'Chest pain',
    });

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    await Doctor.deleteMany();
    await Patient.deleteMany();
    await Appointment.deleteMany();
    await MedicalRecord.deleteMany();
    await Bill.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
