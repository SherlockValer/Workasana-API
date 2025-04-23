const express = require("express");
const {
  createTask,
  getTask,
  updateTask,
  deleteTask,
} = require("../controllers/tasksController");

const router = express.Router();

// Create a new task
router.post("/", createTask);

// Get all tasks
router.get("/", getTask);

// Update a task
router.post("/:id", updateTask);

// Delete a task
router.delete("/:id", deleteTask);

module.exports = router;
