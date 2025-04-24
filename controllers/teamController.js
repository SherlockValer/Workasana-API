const { catchAsync } = require("../services/catchAsync");
const Team = require("../models/team.model");

// Add a new team
exports.createTeam = catchAsync(async (req, res) => {
  const { name, description } = req.body;

  const newTeam = new Team({
    name,
    description,
  });

  const saveTeam = await newTeam.save();
  if (saveTeam) {
    res.status(201).json({
      status: "Success",
      data: {
        team: saveTeam,
      },
    });
  }
});

// Get all teams
exports.getTeams = catchAsync(async (req, res) => {
  const teams = await Team.find();

  if (teams) {
    res.status(200).json({
      status: "success",
      data: {
        teams,
      },
    });
  }
});
