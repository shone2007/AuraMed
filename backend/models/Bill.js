const mongoose = require('mongoose');

const billSchema = mongoose.Schema(
  {
    billId: {
      type: String,
      required: true,
      unique: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Patient',
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Doctor',
    },
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
    },
    consultationFee: {
      type: Number,
      required: true,
      default: 0,
    },
    medicineFee: {
      type: Number,
      required: true,
      default: 0,
    },
    laboratoryFee: {
      type: Number,
      required: true,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ['Unpaid', 'Paid'],
      default: 'Unpaid',
    },
    generatedDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Bill', billSchema);
