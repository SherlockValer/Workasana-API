const express = require("express");
const {
  registerUser,
  userLogin,
  getUserDetails,
  protect,
} = require("../controllers/authController");

const router = express.Router();

// Register
router.post("/signup", registerUser);

// Login
router.post("/login", userLogin);

// User details
router.get("/me", protect, getUserDetails);

module.exports = router;
