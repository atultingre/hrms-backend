const express = require("express");
const router = express.Router();
const Birthday = require("../models/Birthday");

// GET endpoint to fetch all birthdays
router.get("/birthdays", async (req, res) => {
  try {
    const birthdays = await Birthday.find();
    res.status(200).json(birthdays);
  } catch (error) {
    console.error("Error fetching birthdays:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
