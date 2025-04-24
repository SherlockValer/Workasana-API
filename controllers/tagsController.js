const { catchAsync } = require("../services/catchAsync");
const Tag = require("../models/tag.model");
const AppError = require("../services/appError");

// Add new tags
exports.addTags = catchAsync(async (req, res) => {
  const { name } = req.body;

  const newTag = new Tag({
    name,
  });

  const saveTag = await newTag.save();
  if (saveTag) {
    res.status(201).json({
      status: "success",
      data: {
        tag: saveTag,
      },
    });
  }
});

// Get Tags
exports.getTags = catchAsync(async (req, res) => {
  const tags = await Tag.find();

  if (tags) {
    res.status(200).json({
      status: "success",
      data: {
        tags,
      },
    });
  }
});
