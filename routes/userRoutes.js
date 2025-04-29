const express = require("express");
const { protect } = require("../controllers/authController");
const { getUsers } = require("../controllers/userController");

const router = express.Router();

// User details
router.get("/", protect, getUsers);

module.exports = router;
