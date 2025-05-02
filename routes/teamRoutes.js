const express = require("express");
const {
  getTeams,
  createTeam,
  getTeamsWithTask,
} = require("../controllers/teamController");
const { protect } = require("../controllers/authController");
const router = express.Router();

// Add a new team
router.post("/", protect, createTeam);

// Get all teams
router.get("/", getTeams);

// Get teams with task data
router.get("/data", getTeamsWithTask);

module.exports = router;
