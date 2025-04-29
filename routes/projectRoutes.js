const express = require("express");
const {
  addProject,
  getProjects,
  getProjectsOnly,
} = require("../controllers/projectController");
const { protect } = require("../controllers/authController");
const router = express.Router();

// Add a new project
router.post("/", protect, addProject);

// get all projects with data
router.get("/", getProjects);

// get all projects only
router.get("/only", getProjectsOnly);

module.exports = router;
