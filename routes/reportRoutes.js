const express = require("express");
const router = express.Router();

const {
  lastWeekTasks,
  tasksClosedByTeams,
  tasksClosedByOwners,
  tasksClosedByProjects,
  pendingDays,
} = require("../controllers/reportsController");

// Fetch tasks completed in last week
router.get("/last-week", lastWeekTasks);

// Fetch total days of all the pending tasks
router.get("/pending", pendingDays);

// Fetch tasks closed by
// Teams
router.get("/closed-tasks/teams", tasksClosedByTeams);

// Owners
router.get("/closed-tasks/owners", tasksClosedByOwners);

// Projects
router.get("/closed-tasks/projects", tasksClosedByProjects);

module.exports = router;
