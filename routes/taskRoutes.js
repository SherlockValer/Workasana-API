const express = require("express");
const {
  createTask,
  getTask,
  updateTask,
  deleteTask,
} = require("../controllers/tasksController");
const { protect } = require("../controllers/authController");

const router = express.Router();

// Create a new task
router.post("/", protect, createTask);

// Get all tasks
router.get("/", getTask);

// Update a task
router.post("/:id", protect, updateTask);

// Delete a task
router.delete("/:id", protect, deleteTask);

module.exports = router;
