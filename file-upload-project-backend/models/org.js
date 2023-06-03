// Define User schema and model
const mongoose = require("mongoose");
const orgSchema = new mongoose.Schema({
  orgName: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isApproved: { type: Boolean, default: false },
});

module.exports = mongoose.model("Org", orgSchema);
