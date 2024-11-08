const mongoose = require("mongoose");

const ideaSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, "Please add a text field"],
  },
  tag: {
    type: [String],
    enum: [
      "technology",
      "software",
      "business",
      "education",
      "health",
      "inventions",
    ], // Ensure tags are from the predefined list
    required: true, // Make sure at least one tag is provided
  },
  username: {
    type: String,
    required: [true, "Please add a username"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Idea", ideaSchema);
