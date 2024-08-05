const express = require("express");
const router = express.Router();
const EmployeeWorkAnnivarsarySchema = require("../models/WorkAnniversary");

// GET endpoint to fetch all birthdays
router.get("/work-anniversaries", async (req, res) => {
  try {
    const birthdays = await EmployeeWorkAnnivarsarySchema.find();
    res.status(200).json(birthdays);
  } catch (error) {
    console.error("Error fetching birthdays:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
