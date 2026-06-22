const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Doctor = require('./models/Doctor');
const Patient = require('./models/Patient');
const Appointment = require('./models/Appointment');
const Bill = require('./models/Bill');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create a generic User for testing if doesn't exist
    let adminUser = await User.findOne({ email: 'admin@auramed.com' });
    if (!adminUser) {
      adminUser = await User.create({
        name: 'Admin',
        email: 'admin@auramed.com',
        password: 'password123',
        role: 'Admin'
      });
    }

    let doctorUser = await User.findOne({ email: 'doctor@auramed.com' });
    if (!doctorUser) {
      doctorUser = await User.create({
        name: 'Sample Doctor',
        email: 'doctor@auramed.com',
        password: 'password123',
        role: 'Doctor'
      });
    }

    let patientUser = await User.findOne({ email: 'patient@auramed.com' });
    if (!patientUser) {
      patientUser = await User.create({
        name: 'Sample Patient',
        email: 'patient@auramed.com',
        password: 'password123',
        role: 'Patient'
      });
    }

    // Seed Doctors
    console.log('Seeding doctors...');
    await Doctor.deleteMany();
    const doctors = await Doctor.insertMany([
      {
        user: doctorUser._id,
        doctorId: 'DOC-001',
        name: 'Sarah Jenkins',
        specialization: 'Cardiologist',
        qualification: 'MD, FACC',
        experience: '12 Years',
        phone: '555-0101',
        email: 'sarah.j@auramed.com',
        availability: ['Monday', 'Wednesday'],
        consultationFee: 150
      },
      {
        user: doctorUser._id,
        doctorId: 'DOC-002',
        name: 'Marcus Chen',
        specialization: 'Neurologist',
        qualification: 'MD, PhD',
        experience: '8 Years',
        phone: '555-0102',
        email: 'marcus.c@auramed.com',
        availability: ['Tuesday', 'Thursday'],
        consultationFee: 200
      },
      {
        user: doctorUser._id,
        doctorId: 'DOC-003',
        name: 'Elena Rodriguez',
        specialization: 'Pediatrician',
        qualification: 'MD',
        experience: '5 Years',
        phone: '555-0103',
        email: 'elena.r@auramed.com',
        availability: ['Monday', 'Friday'],
        consultationFee: 100
      }
    ]);

    // Seed Patients
    console.log('Seeding patients...');
    await Patient.deleteMany();
    const patients = await Patient.insertMany([
      {
        user: patientUser._id,
        patientId: 'PAT-001',
        name: 'John Smith',
        age: 45,
        gender: 'Male',
        bloodGroup: 'O+',
        phone: '555-0201',
        address: '123 Main St, Cityville',
        emergencyContact: { name: 'Mary Smith', phone: '555-0202', relation: 'Wife' }
      },
      {
        user: patientUser._id,
        patientId: 'PAT-002',
        name: 'Emily Davis',
        age: 28,
        gender: 'Female',
        bloodGroup: 'A-',
        phone: '555-0203',
        address: '456 Oak Rd, Townsville',
        emergencyContact: { name: 'Bob Davis', phone: '555-0204', relation: 'Father' }
      },
      {
        user: patientUser._id,
        patientId: 'PAT-003',
        name: 'Michael Brown',
        age: 62,
        gender: 'Male',
        bloodGroup: 'B+',
        phone: '555-0205',
        address: '789 Pine Ln, Villageton',
        emergencyContact: { name: 'Lisa Brown', phone: '555-0206', relation: 'Daughter' }
      }
    ]);

    // Seed Appointments
    console.log('Seeding appointments...');
    await Appointment.deleteMany();
    const appointments = await Appointment.insertMany([
      {
        appointmentId: 'APT-001',
        patient: patients[0]._id,
        doctor: doctors[0]._id,
        date: new Date(),
        time: '10:00 AM',
        status: 'Completed',
        symptoms: 'Chest pain and shortness of breath',
        notes: 'Prescribed rest and medication.'
      },
      {
        appointmentId: 'APT-002',
        patient: patients[1]._id,
        doctor: doctors[1]._id,
        date: new Date(new Date().getTime() + 86400000), // Tomorrow
        time: '02:30 PM',
        status: 'Scheduled',
        symptoms: 'Chronic headaches',
        notes: 'Needs MRI scan.'
      },
      {
        appointmentId: 'APT-003',
        patient: patients[2]._id,
        doctor: doctors[2]._id,
        date: new Date(new Date().getTime() + 172800000), // Day after tomorrow
        time: '09:15 AM',
        status: 'Scheduled',
        symptoms: 'Fever and cough',
        notes: ''
      }
    ]);

    // Seed Bills
    console.log('Seeding bills...');
    await Bill.deleteMany();
    await Bill.insertMany([
      {
        billId: 'INV-001',
        patient: patients[0]._id,
        doctor: doctors[0]._id,
        appointment: appointments[0]._id,
        consultationFee: 150,
        medicineFee: 45,
        laboratoryFee: 200,
        totalAmount: 395,
        paymentStatus: 'Paid'
      },
      {
        billId: 'INV-002',
        patient: patients[1]._id,
        doctor: doctors[1]._id,
        appointment: appointments[1]._id,
        consultationFee: 200,
        medicineFee: 0,
        laboratoryFee: 500, // For the MRI
        totalAmount: 700,
        paymentStatus: 'Unpaid'
      }
    ]);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
