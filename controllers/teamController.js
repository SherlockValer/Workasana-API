const { catchAsync } = require("../services/catchAsync");
const Team = require("../models/team.model");
const Task = require("../models/task.model");
const User = require("../models/user.model");

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
      teams,
    });
  }
});

// Get all teams
exports.getTeamsWithTask = catchAsync(async (req, res) => {
  const teams = await Task.aggregate([
    { $unwind: "$owners" },
    {
      $group: {
        _id: "$team",
        tasks: { $push: "$name" },
        owners: { $addToSet: "$owners" },
        totalTasks: { $count: {} },
      },
    },
    {
      $project: {
        _id: 1,
        team: "$_id",
        tasks: 1,
        owners: 1,
        totalTasks: 1,
      },
    },
  ]);

  const populatedTeams = await Team.populate(teams, {
    path: "team",
    select: "name description -_id",
  });

  const populateWithOwners = await User.populate(populatedTeams, {
    path: "owners",
    select: "name email",
  });

  if (teams) {
    res.status(200).json({
      status: "success",
      teams: populateWithOwners,
    });
  }
});
