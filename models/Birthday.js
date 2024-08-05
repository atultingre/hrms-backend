const mongoose = require("mongoose");

const { Schema } = mongoose;

const EmployeeBirthdaySchema = new Schema({
  empDbId:{ type: String },
  name: { type: String },
  employeeId: { type: String },
  department: { type: String },
  dateOfBirth: { type: Date },
  designation: { type: String },
  profilePicture: { type: String },
  email: { type: String },
  branch: { type: String, default: "Pune" },
});

module.exports = mongoose.model("Birthday", EmployeeBirthdaySchema);
