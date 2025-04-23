const express = require("express");
const {
  registerUser,
  userLogin,
  getUserDetails,
} = require("../controllers/authController");

const router = express.Router();

// Register
router.post("/signup", registerUser);

// Login
router.post("/login", userLogin);

// User details
router.get("/me", getUserDetails);

module.exports = router;
