const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  s3_key: { type: String, required: true },
  isApproved: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", userSchema);
