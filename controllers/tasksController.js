const { catchAsync } = require("../services/catchAsync");
const Task = require("../models/task.model");
const AppError = require("../services/appError");

// Create a new task
exports.createTask = catchAsync(async (req, res, next) => {
  const { name, project, team, owners, tags, timeToComplete, status } =
    req.body;

  const newTask = new Task({
    name,
    project,
    team,
    owners,
    tags,
    timeToComplete,
    status,
  });

  const saveTask = await newTask.save();

  if (saveTask) {
    res.status(201).json({
      status: "success",
      data: {
        task: saveTask,
      },
    });
  }
});

// Get all tasks
exports.getTask = catchAsync(async (req, res, next) => {
  const tasks = await Task.find(req.query)
    .populate("project")
    .populate("team")
    .populate("owners");

  if (tasks.length === 0) {
    return next(new AppError("Tasks not found.", 404));
  }

  res.json({
    status: "success",
    data: {
      tasks,
    },
  });
});

// Update a task
exports.updateTask = catchAsync(async (req, res, next) => {
  if (!req.body) {
    return next(new AppError("Bad Request. No Request Body.", 400));
  }

  const taskID = req.params.id;
  const dataToUpdate = req.body;

  const task = await Task.findByIdAndUpdate(taskID, dataToUpdate, {
    new: true,
  });

  if (task) {
    res.status(200).json({
      status: "success",
      data: {
        task,
      },
    });
  }
});

// Delete a task
exports.deleteTask = catchAsync(async (req, res, next) => {
  const taskID = req.params.id;

  const deleted = await Task.findByIdAndDelete(taskID);

  if (deleted) {
    res.status(200).json({
      status: "success",
    });
  }
});
