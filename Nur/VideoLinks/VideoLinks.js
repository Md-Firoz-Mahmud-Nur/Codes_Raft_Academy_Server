const express = require("express");
const router = express.Router();

module.exports = (adminPaymentNumberCollection) => {
  router.get("/videoLinks", async (req, res) => {
    const cursor = adminPaymentNumberCollection.find();
    const result = await cursor.toArray();
    res.send(result);
  });
  return router;
};
