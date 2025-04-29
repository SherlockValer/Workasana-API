const { catchAsync } = require("../services/catchAsync");
const User = require("../models/user.model");

exports.getUsers = catchAsync(async (req, res) => {
  const users = await User.find();

  if (users) {
    res.status(200).json({
      status: "success",
      users,
    });
  }
});
