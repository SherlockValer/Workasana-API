const express = require("express");
const { addTags, getTags } = require("../controllers/tagsController");
const { protect } = require("../controllers/authController");
const router = express.Router();

// Add new tags
router.post("/", protect, addTags);

// Get Tags
router.get("/", getTags);

module.exports = router;
