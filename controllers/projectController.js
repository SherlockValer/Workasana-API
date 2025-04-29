const { catchAsync } = require("../services/catchAsync");
const Project = require("../models/project.model");
const Task = require("../models/task.model");
const User = require("../models/user.model");

// Add a new project
exports.addProject = catchAsync(async (req, res) => {
  const { name, description } = req.body;

  const newProject = new Project({
    name,
    description,
  });

  const saveProject = await newProject.save();

  if (saveProject) {
    res.status(201).json({
      status: "success",
      data: {
        project: saveProject,
      },
    });
  }
});

// get all projects with data
exports.getProjects = catchAsync(async (req, res) => {
  const projects = await Task.aggregate([
    {
      $group: {
        _id: "$project",
        tasks: {
          $push: {
            _id: "$_id",
            name: "$name",
            status: "$status",
            owners: "$owners",
            tags: "$tags",
            timeToComplete: "$timeToComplete",
            createdAt: "$createdAt",
          },
        },
        totalTasks: { $count: {} },
        completedTasks: {
          $sum: {
            $cond: { if: { $eq: ["$status", "Completed"] }, then: 1, else: 0 },
          },
        }, // Count completed tasks
      },
    },
    {
      $addFields: {
        status: {
          $cond: {
            if: { $eq: ["$completedTasks", "$totalTasks"] },
            then: "Completed",
            else: "In Progress",
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        project: "$_id",
        tasks: 1,
        totalTasks: 1,
        status: 1,
      },
    },
  ]);

  if (projects) {
    const populatedData = await Project.populate(projects, {
      path: "project",
      select: "name description",
    });

    const populatedDataWithUser = await User.populate(populatedData, {
      path: "tasks.owners",
      select: "name",
    });

    res.status(200).json({
      status: "success",
      data: populatedDataWithUser,
    });
  }
});

// get projects only
exports.getProjectsOnly = catchAsync(async (req, res) => {
  const projects = await Project.find();

  if (projects) {
    res.status(200).json({
      projects,
    });
  }
});
