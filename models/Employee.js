const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const { Schema } = mongoose;

const addressSchema = new Schema({
  street: { type: String },
  city: { type: String },
  state: { type: String },
  postalCode: { type: String },
  country: { type: String },
});

const contactDetailsSchema = new Schema({
  localAddress: addressSchema,
  permanentAddress: addressSchema,
  mobileNo: {
    type: String,
    minlength: 10,
    maxlength: 10,
  },
  email: {
    type: String,
    match: [/.+\@.+\..+/, "Please enter a valid email address"],
  },
  maritalStatus: {
    type: String,
    enum: ["Unmarried", "Married", "Divorcee", "Widow", "Widower", "NA"],
  },
  spouseName: { type: String },
  alternateEmail: {
    type: String,
    match: [/.+\@.+\..+/, "Please enter a valid alternate email address"],
  },
  uanNumber: { type: String },
});

const familyDetailsSchema = new Schema({
  name: { type: String, required: [true, "Name is required"] },
  dateOfBirth: { type: Date, required: [true, "Date of Birth is required"] },
  relation: { type: String, required: [true, "Relation is required"] },
  occupation: { type: String },
  age: { type: Number, required: true, min: [0, "Age cannot be negative"] },
  contactNo: {
    type: String,
    required: [true, "Contact number is required"],
    minlength: 10,
    maxlength: 10,
  },
  emergency: { type: Boolean, required: true },
  gender: { type: String, required: true, enum: ["Male", "Female", "Other"] },
  aadharNumber: {
    type: String,
    minlength: 12,
    maxlength: 12,
  },
});

const nomineeDetailsSchema = new Schema({
  nomineeName: { type: String, required: [true, "Nominee Name is required"] },
  relation: { type: String, required: [true, "Relation is required"] },
  nominationDate: {
    type: Date,
    required: [true, "Nomination Date is required"],
  },
  percentage: {
    type: Number,
    required: [true, "Percentage is required"],
    min: 0,
    max: 100,
  },
  dateOfBirth: { type: Date, required: [true, "Date of Birth is required"] },
  address: { type: String },
  guardianName: { type: String },
  guardianAddress: { type: String },
  stayingWith: { type: Boolean },
  nomineeType: { type: String },
  subType: { type: String },
  isNomineeMinor: { type: Boolean },
  aadharNumber: {
    type: String,
    minlength: 12,
    maxlength: 12,
  },
});

const personalDetailsSchema = new Schema({
  nickName: { type: String },
  height: { type: Number, min: [0, "Height cannot be negative"] },
  weight: { type: Number, min: [0, "Weight cannot be negative"] },
  birthPlace: { type: String },
  religion: { type: String },
  bloodGroup: {
    type: String,
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
  },
  nationality: { type: String },
  maritalStatus: {
    type: String,
    enum: ["Single", "Married", "Divorced", "Widowed"],
  },
  language: { type: String },
  isHandicap: { type: Boolean },
  handicapNature: { type: String },
  nameAsPerPan: {
    type: String,
    required: ["Name as per PAN is required"],
  },
  nameAsPerAadhar: {
    type: String,
  },
  nameAsPerBank: {
    type: String,
  },
  marriageDate: { type: Date },
  handicapPercentage: {
    type: Number,
    min: [0, "Handicap Percentage cannot be negative"],
    max: 100,
    default: 0,
  },
  identificationMark: { type: String },
});

const profileDetailsSchema = new Schema({
  profilePicture: {
    type: String,
    default: null,
  },
  linkedinLink: { type: String },
});

const statutoryDetailsSchema = new Schema({
  pfNumber: { type: String, required: [true, "PF Number is required"] },
  panNumber: {
    type: String,
    required: [true, "PAN Number is required"],
    minlength: 10,
    maxlength: 10,
    match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Please enter a valid PAN Number"],
  },
  esicNumber: { type: String, required: [true, "ESIC Number is required"] },
});

const qualificationSchema = new Schema({
  degree: {
    type: String,
    required: [true, "Degree is required"],
  },
  specification: {
    type: String,
  },
  university: {
    type: String,
    required: [true, "University is required"],
  },
  institute: {
    type: String,
  },
  year: {
    type: Number,
    required: [true, "Year is required"],
    min: [1900, "Year cannot be earlier than 1900"],
    max: [new Date().getFullYear(), "Year cannot be in the future"],
  },
  month: {
    type: Number,
    required: [true, "Month is required"],
    min: [1, "Month must be between 1 and 12"],
    max: [12, "Month must be between 1 and 12"],
  },
  grade: {
    type: String,
  },
  location: {
    type: String,
  },
  duration: {
    type: String,
  },
  type: {
    type: String,
    enum: ["government", "private", "deemed"],
    message: "Type must be one of 'government', 'private', or 'deemed'",
  },
  courseType: {
    type: String,
    required: [true, "Course type is required"],
    enum: ["full time", "part time", "correspondence"],
    message:
      "Course type must be one of 'full time', 'part time', or 'correspondence'",
  },
});

const EmployeeSchema = new Schema({
  name: { type: String, required: true },
  employeeId: {
    type: String,
    required: [true, "Employee ID is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [4, "Password must be at least 4 characters long"],
  },
  gender: {
    type: String,
    required: true,
    enum: ["male", "female", "other"],
  },
  fathersName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  confirmationDate: { type: Date, required: true },
  joiningDate: { type: Date, required: true },
  bankAccountNumber: { type: String },
  aadharNumber: {
    type: String,
    minlength: 12,
    maxlength: 12,
  },
  uanNumber: { type: String },
  division: { type: String },
  subDivision: { type: String },
  department: { type: String, required: true },
  designation: { type: String, required: true },
  mainDivision: { type: String },
  isAdmin: { type: Boolean, default: false },
  contactDetails: contactDetailsSchema,
  familyDetails: [familyDetailsSchema],
  nomineeDetails: [nomineeDetailsSchema],
  personalDetails: {
    type: profileDetailsSchema,
    default: {},
  },
  profileDetails: profileDetailsSchema,
  statutoryDetails: statutoryDetailsSchema,
  qualificationDetails: [qualificationSchema],
});

// Hash password before saving
EmployeeSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("Employee", EmployeeSchema);
