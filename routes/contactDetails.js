const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth");
const Employee = require("../models/Employee");

// Create Contact Details
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { employeeId, contactDetails } = req.body;
    const employee = await Employee.findOne({ employeeId });

    if (!employee) return res.status(404).send("Employee not found");

    employee.contactDetails = contactDetails;
    await employee.save();

    res.status(201).json(employee.contactDetails);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Read Contact Details
router.get("/", authenticateToken, async (req, res) => {
  try {
    const { employeeId } = req.user; // Ensure this line correctly gets the employeeId from the token
    const employee = await Employee.findOne({ employeeId });

    if (!employee) return res.status(404).send("Employee not found");

    res.json(employee.contactDetails);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update Contact Details
router.put("/", authenticateToken, async (req, res) => {
  try {
    const { employeeId, contactDetails } = req.body;
    const employee = await Employee.findOne({ employeeId });

    if (!employee) return res.status(404).send("Employee not found");

    employee.contactDetails = contactDetails;
    await employee.save();

    res.json(employee.contactDetails);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete Contact Details
router.delete("/", authenticateToken, async (req, res) => {
  try {
    const { employeeId } = req.body;
    const employee = await Employee.findOne({ employeeId });

    if (!employee) return res.status(404).send("Employee not found");

    employee.contactDetails = null;
    await employee.save();

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
