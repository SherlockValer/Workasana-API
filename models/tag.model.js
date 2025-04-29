const mongoose = require("mongoose");

// Tag Schema
const tagSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // Tag names must be unique
  color: { type: String, required: true },
});

const Tag = mongoose.model("Tag", tagSchema);

module.exports = Tag;
