const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const Employee = require("../models/Employee");
const { bucket } = require("../middleware/firebase");
const Birthday = require("../models/Birthday");
const WorkAnniversary = require("../models/WorkAnniversary");
const router = express.Router();

// Set up Multer for image uploads
const upload = multer({
  storage: multer.memoryStorage(),
});

// Validate ObjectId middleware
const validateObjectId = (req, res, next) => {
  const { employeeId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(employeeId)) {
    return res.status(400).json({ message: "Invalid employee ID" });
  }
  next();
};

// Create or Update Profile Picture
// Create or Update Profile Picture
router.post(
  "/:employeeId/picture",
  validateObjectId,
  upload.single("profilePicture"),
  async (req, res) => {
    const { employeeId } = req.params;

    try {
      const employee = await Employee.findById(employeeId);
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }

      // Initialize profileDetails if it does not exist
      if (!employee.profileDetails) {
        employee.profileDetails = {};
      }

      // Check if there is an existing profile picture
      const oldProfilePictureUrl = employee.profileDetails.profilePicture;
      if (oldProfilePictureUrl) {
        // Extract the file name from the URL
        const oldFileName = decodeURIComponent(
          oldProfilePictureUrl.split("/o/")[1].split("?")[0]
        );
        const oldFile = bucket.file(oldFileName);

        // Delete the old profile picture from Firebase Storage
        await oldFile.delete();
      }

      const file = req.file;
      const fileName = `${employeeId}-${Date.now()}-${file.originalname}`;
      const fileUpload = bucket.file(fileName);

      // Upload the image to Firebase
      const stream = fileUpload.createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
      });

      stream.on("error", (error) => {
        res.status(500).json({ message: "Failed to upload image", error });
      });

      stream.on("finish", async () => {
        // Get the public URL with the 'alt=media' parameter
        const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${
          bucket.name
        }/o/${encodeURIComponent(fileUpload.name)}?alt=media`;

        // Store the new URL in the profileDetailsSchema
        employee.profileDetails.profilePicture = publicUrl;

        // Update Birthday and WorkAnniversary models
        await Birthday.updateOne(
          { empDbId: employeeId },
          { $set: { profilePicture: publicUrl } },
          { upsert: true }
        );
        await WorkAnniversary.updateOne(
          { empDbId: employeeId },
          { $set: { profilePicture: publicUrl } },
          { upsert: true }
        );

        await employee.save();

        res
          .status(200)
          .json({ message: "Profile picture uploaded", publicUrl });
      });

      stream.end(file.buffer);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
);

router.delete("/:employeeId/picture", validateObjectId, async (req, res) => {
  const { employeeId } = req.params;

  try {
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const profilePictureUrl = employee.profileDetails.profilePicture;
    if (!profilePictureUrl) {
      return res.status(404).json({ message: "No profile picture found" });
    }

    // Extract the file name from the URL
    const fileName = decodeURIComponent(
      profilePictureUrl.split("/o/")[1].split("?")[0]
    );
    const file = bucket.file(fileName);

    // Delete the file from Firebase Storage
    await file.delete();

    // Remove the profile picture URL from the database
    employee.profileDetails.profilePicture = null;
    await Birthday.updateOne(
      { empDbId: employeeId },
      { $set: { profilePicture: null } }
    );
    await WorkAnniversary.updateOne(
      { empDbId: employeeId },
      { $set: { profilePicture: null } }
    );

    await employee.save();

    res.status(200).json({ message: "Profile picture deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.get("/:employeeId/picture", validateObjectId, async (req, res) => {
  const { employeeId } = req.params;

  try {
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const profilePictureUrl = employee.profileDetails?.profilePicture;
    if (!profilePictureUrl) {
      return res.status(404).json({ message: "No profile picture found" });
    }

    res.status(200).json({ profilePictureUrl });
  } catch (error) {
    console.error("Error retrieving profile picture:", error); // Log detailed error
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;