// Define file schema and model
const mongoose = require("mongoose");
const fileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  author: { type: String, required: false },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "Org" },
  ownerName: { type: String },
  s3_key: { type: String, required: true },
  language: { type: String, required: false },
  downloads: { type: Number, default: 0 },
});

module.exports = mongoose.model("File", fileSchema);
