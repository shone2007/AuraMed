const Bill = require('../models/Bill');
const Patient = require('../models/Patient');

// @desc    Get all bills
// @route   GET /api/bills
// @access  Private
const getBills = async (req, res, next) => {
  try {
    let query = {};

    if (req.user.role === 'Patient') {
      const patient = await Patient.findOne({ user: req.user._id });
      if (patient) query.patient = patient._id;
    }

    const bills = await Bill.find(query)
      .populate('patient', 'name patientId')
      .populate('doctor', 'name specialization doctorId')
      .populate('appointment', 'date time status');
    res.json(bills);
  } catch (error) {
    next(error);
  }
};

// @desc    Get bill by ID
// @route   GET /api/bills/:id
// @access  Private
const getBillById = async (req, res, next) => {
  try {
    const bill = await Bill.findById(req.params.id)
      .populate('patient', 'name patientId')
      .populate('doctor', 'name specialization doctorId')
      .populate('appointment', 'date time status');

    if (bill) {
      res.json(bill);
    } else {
      res.status(404);
      throw new Error('Bill not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a bill
// @route   POST /api/bills
// @access  Private (Admin)
const createBill = async (req, res, next) => {
  try {
    const { billId, patient, doctor, appointment, consultationFee, medicineFee, laboratoryFee, paymentStatus } = req.body;

    const totalAmount = Number(consultationFee || 0) + Number(medicineFee || 0) + Number(laboratoryFee || 0);

    const bill = new Bill({
      billId,
      patient,
      doctor,
      appointment,
      consultationFee,
      medicineFee,
      laboratoryFee,
      totalAmount,
      paymentStatus,
    });

    const createdBill = await bill.save();
    res.status(201).json(createdBill);
  } catch (error) {
    next(error);
  }
};

// @desc    Update bill
// @route   PUT /api/bills/:id
// @access  Private (Admin)
const updateBill = async (req, res, next) => {
  try {
    const bill = await Bill.findById(req.params.id);

    if (bill) {
      bill.consultationFee = req.body.consultationFee !== undefined ? req.body.consultationFee : bill.consultationFee;
      bill.medicineFee = req.body.medicineFee !== undefined ? req.body.medicineFee : bill.medicineFee;
      bill.laboratoryFee = req.body.laboratoryFee !== undefined ? req.body.laboratoryFee : bill.laboratoryFee;
      bill.totalAmount = Number(bill.consultationFee) + Number(bill.medicineFee) + Number(bill.laboratoryFee);
      bill.paymentStatus = req.body.paymentStatus || bill.paymentStatus;

      const updatedBill = await bill.save();
      res.json(updatedBill);
    } else {
      res.status(404);
      throw new Error('Bill not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete bill
// @route   DELETE /api/bills/:id
// @access  Private (Admin)
const deleteBill = async (req, res, next) => {
  try {
    const bill = await Bill.findById(req.params.id);

    if (bill) {
      await Bill.deleteOne({ _id: bill._id });
      res.json({ message: 'Bill removed' });
    } else {
      res.status(404);
      throw new Error('Bill not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBills,
  getBillById,
  createBill,
  updateBill,
  deleteBill,
};
