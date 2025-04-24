const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { catchAsync } = require("../services/catchAsync.js");
const AppError = require("../services/appError.js");

// create a JWT token with jwt.sign(payload, secret)
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Register a new user
exports.registerUser = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;

  const newUser = new User({
    name,
    email,
    password,
    passwordConfirm,
  });

  const saveUser = await newUser.save();
  if (saveUser) {
    const token = signToken(saveUser._id);

    res.status(201).json({
      status: "success",
      token, // Send JWT signed token to client
      data: {
        user: { name: saveUser.name, email: saveUser.email },
      },
    });
  }
});

// Login
exports.userLogin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }

  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select("+password"); // Due to select : false in User model

  if (user) {
    const correct = await user.correctPassword(password, user.password); // Compare both passwords
    if (!correct) {
      return next(new AppError("Incorrect email or password", 400));
    } else {
      // 3) If everything ok, send token to client
      const token = signToken(user._id);
      res.status(200).json({
        status: "success",
        token,
      });
    }
  } else {
    return next(new AppError("Incorrect email or password", 400));
  }
});

// Get user details
exports.getUserDetails = async (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      user: req.user,
    },
  });
};

// Protect routes
exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  // 2) Verification token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // 3) Check if user stil exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});
