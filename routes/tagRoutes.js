const express = require("express");
const { addTags, getTags } = require("../controllers/tagsController");
const router = express.Router();

// Add new tags
router.post("/", addTags);

// Get Tags
router.get("/", getTags);

module.exports = router;
