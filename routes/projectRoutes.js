const express = require("express");
const { addProject, getProjects } = require("../controllers/projectController");
const router = express.Router();

// Add a new project
router.post("/", addProject);

// get all projects
router.get("/", getProjects);

module.exports = router;
