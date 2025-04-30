const mongoose = require('mongoose');
const { Schema } = mongoose;

const petRegisterSchema = new Schema({
  petType: {
    type: String,
    enum: ['Dog', 'Cat'],
    required: true,
  },

  dogID: {
    type: String,
    unique: true,
    sparse: true,
    required: function () {
      return this.petType === 'Dog';
    },
  },

  catID: {
    type: String,
    unique: true,
    sparse: true,
    required: function () {
      return this.petType === 'Cat';
    },
  },

  name: {
    type: String,
    required: true,
  },

  breed: {
    type: String,
    required: true,
  },

  dob: {
    type: Date,
  },

  age: {
    years: { type: Number, default: 0 },
    months: { type: Number, default: 0 },
    days: { type: Number, default: 0 },
  },

  donorId: {
    type: String,
  },

  donorName: {
    type: String,
  },

  donatedDate: {
    type: Date,
    default: Date.now,
  },

  healthStatus: {
    type: String,
    enum: ['Normal', 'Under Treatment'],
    default: 'Normal',
  },

  status: {
    type: String,
    enum: ['In Care Center', 'Ready to Sell', 'Auctioned', 'Reserved', 'Adopted', 'Dead'],
    default: 'In Care Center',
  },

  qrCode: {
    type: String, // base64 or URL string
  },

  image: {
    type: String,
    default: 'default.jpg',
  },

  ownerId: {
    type: String,
  },

  ownerName: {
    type: String,
  },

}, {
  timestamps: true,
});

module.exports = mongoose.model('Pet', petRegisterSchema);
