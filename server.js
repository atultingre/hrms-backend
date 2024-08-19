const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const employeeRoutes = require("./routes/employee");
const contactDetailsRoutes = require("./routes/contactDetails");
const birthdayRoutes = require("./routes/birthday");
const workAnniversaryRoutes = require("./routes/workAnniversary");
const profileDetailsRoutes = require("./routes/profile");

require("dotenv").config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(
  cors({
    origin: ["*", "http://localhost:3000", "http://192.168.0.106:5173","http://localhost:5173"], 
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);

app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Define Routes
app.use("/api/employees", employeeRoutes);
app.use("/api/contact-details", contactDetailsRoutes);
app.use("/api", birthdayRoutes);
app.use("/api", workAnniversaryRoutes);
app.use("/api/profile", profileDetailsRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  // console.log(` http://192.168.0.106:${PORT}`);
  console.log(` http://localhost:${PORT}`);
});
