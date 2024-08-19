const mongoose = require("mongoose");

const { Schema } = mongoose;

const profileDetailsSchema = new Schema({
  empDbId: { type: String },
  employee: { type: String },
  profilePicture: {
    type: String,
    default: null,
  },
  linkedinLink: {
    type: String,
    default: null,
  },
});

module.exports = mongoose.model("Profile", profileDetailsSchema);
