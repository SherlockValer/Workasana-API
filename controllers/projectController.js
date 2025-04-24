const { catchAsync } = require("../services/catchAsync");
const Project = require("../models/project.model");

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

// get all projects
exports.getProjects = catchAsync(async (req, res) => {
  const projects = await Project.find();

  if (projects) {
    res.status(200).json({
      status: "success",
      data: {
        projects,
      },
    });
  }
});
