const express = require("express");
const router = express.Router();

module.exports = (enrollmentsCollection) => {
  router.post("/enrollments", async (req, res) => {
    try {
      const result = await enrollmentsCollection.insertOne(req.body);
      res.send(result);
    } catch (err) {
      res.status(500).send({ error: "Failed to save enrollment" });
    }
  });

  return router;
};
