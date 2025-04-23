const express = require("express");
const { getTeams, createTeam } = require("../controllers/teamController");
const router = express.Router();

// Add a new team
router.post("/", createTeam);

// Get all teams
router.get("/", getTeams);

module.exports = router;
