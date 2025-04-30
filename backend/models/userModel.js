const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  AId: { type: Number, required: true, unique: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  gender: { type: String, required: true },
  address: { type: String, required: true },
  dob: { type: Date, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: Number, required: true, unique: true },
  image: { type: String },
  password: { type: String, required: true },

  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },

  role: { type: Number, required: true, enum: [1, 2, 3, 4] },

  AdminID: {
    type: String,
    unique: true,
    sparse: true,
    required: function () {
      return this.role === 1;
    },
  },

  ManagerID: {
    type: String,
    unique: true,
    sparse: true,
    required: function () {
      return this.role === 2;
    },
  },

  VeterinarianID: {
    type: String,
    unique: true,
    sparse: true,
    required: function () {
      return this.role === 3;
    },
  },

  CustomerID: {
    type: String,
    unique: true,
    sparse: true,
    required: function () {
      return this.role === 4;
    },
  },

  rewards: {
    type: Number,
    default: function () {
      return this.role === 4 ? 0 : undefined;
    },
    required: function () {
      return this.role === 4;
    },
  },
});

module.exports = mongoose.model("userModel", userSchema);
