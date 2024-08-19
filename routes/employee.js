const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Employee = require("../models/Employee");
const Birthday = require("../models/Birthday");
const WorkAnniversary = require("../models/WorkAnniversary");
const Profile = require("../models/Profile");
const router = express.Router();

// CREATE a new employee
router.post("/", async (req, res) => {
  const {
    name,
    employeeId,
    password,
    gender,
    fathersName,
    dateOfBirth,
    confirmationDate,
    joiningDate,
    department,
    designation,
    division,
    mainDivision,
    subDivision,
    bankAccountNumber,
    aadharNumber,
    uanNumber,
  } = req.body;

  try {
    if (
      !name ||
      !employeeId ||
      !password ||
      !gender ||
      !fathersName ||
      !dateOfBirth ||
      !confirmationDate ||
      !joiningDate ||
      !department ||
      !designation
    ) {
      return res.status(400).json({
        msg: "All required fields must be provided",
      });
    }

    // Check if an employee with the same employeeId already exists
    const existingEmployee = await Employee.findOne({ employeeId });
    if (existingEmployee) {
      return res.status(400).json({ msg: "Employee ID already exists" });
    }

    // Create a new employee
    const newEmployee = new Employee({
      name,
      employeeId,
      gender,
      dateOfBirth,
      confirmationDate,
      joiningDate,
      department,
      designation,
      division,
      mainDivision,
      subDivision,
      fathersName,
      bankAccountNumber,
      aadharNumber,
      uanNumber,
      password,
    });

    const profileDetails = new Profile({
      empDbId: newEmployee._id,
      employeeId,
      employee: `${name} - ${employeeId}`,
    });
    const birthdayDetails = new Birthday({
      empDbId: newEmployee._id,
      employeeId,
      name,
      department,
      dateOfBirth,
      designation,
    });
    const workAnniversaryDetails = new WorkAnniversary({
      empDbId: newEmployee._id,
      employeeId,
      name,
      department,
      joiningDate,
      designation,
    });

    // Save the employee to the database
    const employee = await newEmployee.save();
    const profile = await profileDetails.save();
    const bithdays = await birthdayDetails.save();
    const workAnniversary = await workAnniversaryDetails.save();

    res.status(201).json({
      message: "Employee created successfully",
      employee,
      profile,
      bithdays,
      workAnniversary,
    });
  } catch (err) {
    console.error("Error creating employee:", err);
    res.status(500).send("Server Error");
  }
});

// LOGIN an employee
router.post("/login", async (req, res) => {
  const { employeeId, password } = req.body;

  try {
    // Check if the employee exists
    const employee = await Employee.findOne({ employeeId });
    if (!employee) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Generate JWT token
    const payload = {
      id: employee.id,
      employeeId: employee.employeeId,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      fullName: employee.name,
      isAdmin: employee.isAdmin,
      employeeId,
      token,
      loginUserId: employee._id,
    });
  } catch (err) {
    console.error("Error logging in:", err.message);
    res.status(500).send("Server Error");
  }
});

// READ all employees
router.get("/", async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// READ a single employee by ID
router.get("/:id", async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ msg: "Employee not found" });
    }

    res.json(employee);
  } catch (err) {
    console.error(err.message);

    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Employee not found" });
    }

    res.status(500).send("Server Error");
  }
});

// UPDATE an employee by ID
router.put("/:id", async (req, res) => {
  const { employeeId, password } = req.body;

  const employeeFields = {};
  if (employeeId) employeeFields.employeeId = employeeId;
  if (password) employeeFields.password = password;

  try {
    let employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ msg: "Employee not found" });
    }

    employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { $set: employeeFields },
      { new: true }
    );

    res.json(employee);
  } catch (err) {
    console.error(err.message);

    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Employee not found" });
    }

    res.status(500).send("Server Error");
  }
});

// DELETE an employee by ID
router.delete("/:id", async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ msg: "Employee not found" });
    }

    await Employee.findByIdAndDelete(req.params.id);

    res.json({ msg: "Employee removed" });
  } catch (err) {
    console.error(err.message);

    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Employee not found" });
    }

    res.status(500).send("Server Error");
  }
});

module.exports = router;
