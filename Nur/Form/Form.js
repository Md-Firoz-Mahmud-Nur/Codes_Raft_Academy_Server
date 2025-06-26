const express = require("express");
const router = express.Router();

module.exports = (adminPaymentNumberCollection) => {
  router.get("/paymentNumber", async (req, res) => {
    console.log("object", req);
    console.log("body", req.body);
    const cursor = adminPaymentNumberCollection.find();
    const result = await cursor.toArray();
    res.send(result);
  });
  return router;
};
