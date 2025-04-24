const mongoose = require("mongoose");
const AppError = require("../services/appError");
// Task Schema
const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  }, // Refers to Project model
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: true,
  }, // Refers to Team model
  owners: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    required: true,
    validate: [(value) => value.length > 0, "At least one owner is required."],
  }, // Refers to User model (owners)
  tags: [{ type: String }], // Array of tags
  timeToComplete: { type: Number, required: true }, // Number of days to complete the task
  status: {
    type: String,
    enum: ["To Do", "In Progress", "Completed", "Blocked"],
    // Enum for task status
    default: "To Do",
  }, // Task status
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  closedAt: { type: Date },
});

// Automatically update the `updatedAt` field whenever the document is updated
taskSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();

  if (update.status === "Completed") {
    update.closedAt = Date.now();
  }

  update.updatedAt = Date.now(); // Always update `updatedAt`
  this.setUpdate(update); // Make sure to apply the modified update

  next();
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
