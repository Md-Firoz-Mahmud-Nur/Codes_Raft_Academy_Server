const express = require("express");
const router = express.Router();
const webhookURL = process.env.WEBHOOK_URL;

module.exports = (enrollmentsCollection, axios) => {
  router.post("/enrollments", async (req, res) => {
    try {
      const result = await enrollmentsCollection.insertOne(req.body);
      console.log(result);
      if (result.acknowledged) {
        await axios.post(webhookURL, {
          content: `new enrollment: ${req.body.email}`,
        });
        res.send(result);
      }
    } catch (err) {
      res.status(500).send({ error: "Failed to save enrollment" });
    }
  });

  router.get("/enrollments", async (req, res) => {
    try {
      const approved = await enrollmentsCollection.countDocuments({
        status: true,
      });
      const pending = await enrollmentsCollection.countDocuments({
        status: false,
      });
      res.send({ approved, pending });
    } catch (error) {
      console.error("Error fetching enrollments:", error);
      res.status(500).send({ message: "Server error" });
    }
  });

  // router.get("/enrollments/check", async (req, res) => {
  //   try {
  //     const email = req.query.email;
  //     if (!email) {
  //       return res
  //         .status(400)
  //         .json({ enrolled: false, message: "Email is required" });
  //     }

  //     const enrollment = await enrollmentsCollection.findOne({ email });
  //     const isEnrolled = !!enrollment;

  //     res.json({ enrolled: isEnrolled });
  //   } catch (error) {
  //     console.error("Enrollment check error:", error);
  //     res.status(500).json({ enrolled: false, message: "Server error" });
  //   }
  // });


  router.get("/enrollments/check", async (req, res) => {
    try {
      const email = req.query.email;

      // Step 1: Validate input
      if (!email) {
        return res.status(400).json({
          enrolled: false,
          message: "Email is required",
        });
      }

      // Step 2: Look for existing enrollment
      const enrollment = await enrollmentsCollection.findOne({ email });

      // Step 3: No enrollment found — allow user to enroll
      if (!enrollment) {
        return res.status(200).json({
          enrolled: false,
          message: "You can request enrollment.",
        });
      }

      // Step 4: Enrollment found — check status
      if (enrollment.status === true) {
        return res.status(200).json({
          enrolled: "approved",
        });
      } else {
        return res.status(200).json({
          enrolled: "pending",
        });
      }
    } catch (error) {
      console.error("Enrollment check error:", error);
      return res.status(500).json({
        enrolled: false,
        message: "Server error",
      });
    }
  });


  return router;
};
