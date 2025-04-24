const express = require("express");
const { addProject, getProjects } = require("../controllers/projectController");
const { protect } = require("../controllers/authController");
const router = express.Router();

// Add a new project
router.post("/", protect, addProject);

// get all projects
router.get("/", getProjects);

module.exports = router;
