const Task = require("../models/task.model");
const Team = require("../models/team.model");
const User = require("../models/user.model");
const Project = require("../models/project.model");
const { catchAsync } = require("../services/catchAsync");

// tasks completed in last week
exports.lastWeekTasks = catchAsync(async (req, res, next) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7); // 18

  const stats = await Task.aggregate([
    { $match: { closedAt: { $gte: sevenDaysAgo } } },
    { $match: { status: "Completed" } },
    {
      $group: {
        _id: { $dayOfWeek: "$closedAt" }, // 1 to 7
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 1,
        dayOfWeek: "$_id",
        count: 1,
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
});

// total days of all the pending tasks
exports.pendingDays = catchAsync(async (req, res, next) => {
  const stats = await Task.aggregate([
    { $match: { status: { $ne: "Completed" } } },
    {
      $group: {
        _id: "$status",
        pendingDays: { $sum: "$timeToComplete" },
        totalTasks: { $sum: 1 },
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
});

// tasks closed by teams
exports.tasksClosedByTeams = catchAsync(async (req, res, next) => {
  const statsTeam = await Task.aggregate([
    { $match: { status: "Completed" } },
    {
      $group: {
        _id: "$team",
        tasksClosed: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 1,
        team: "$_id",
        tasksClosed: 1,
      },
    },
  ]);

  const closedByTeam = await Team.populate(statsTeam, {
    path: "team",
    select: "name -_id",
  });

  res.status(200).json({
    status: "success",
    data: {
      tasksClosed: closedByTeam,
    },
  });
});

// tasks closed by owners
exports.tasksClosedByOwners = catchAsync(async (req, res, next) => {
  const statsOwner = await Task.aggregate([
    { $match: { status: "Completed" } },
    { $unwind: "$owners" },
    {
      $group: {
        _id: "$owners",
        tasksClosed: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 1,
        owner: "$_id",
        tasksClosed: 1,
      },
    },
  ]);

  const closedByOwner = await User.populate(statsOwner, {
    path: "owner",
    select: "name -_id",
  });

  res.status(200).json({
    status: "success",
    data: {
      tasksClosed: closedByOwner,
    },
  });
});

// tasks closed by projects
exports.tasksClosedByProjects = catchAsync(async (req, res, next) => {
  const statsProjects = await Task.aggregate([
    { $match: { status: "Completed" } },
    {
      $group: {
        _id: "$project",
        tasksClosed: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 1,
        project: "$_id",
        tasksClosed: 1,
      },
    },
  ]);

  const closedByProjects = await Project.populate(statsProjects, {
    path: "project",
    select: "name -_id",
  });

  res.status(200).json({
    status: "success",
    data: {
      tasksClosed: closedByProjects,
    },
  });
});
