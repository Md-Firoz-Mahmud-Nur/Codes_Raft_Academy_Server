const express = require("express");
const router = express.Router();

module.exports = (referralTracking) => {
  router.get("/verifyReferral/:code", async (req, res) => {
    const { code } = req.params;

    try {
      const referral = await referralTracking.findOne({ referralCode: code });

      if (!referral) {
        return res
          .status(404)
          .json({ success: false, message: "Referral code not found" });
      }

      if (referral.status !== "active") {
        return res
          .status(403)
          .json({ success: false, message: "Referral code is not active" });
      }

      return res.status(200).json({
        success: true,
        referral: {
          name: referral.name,
        },
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  });

  return router;
};
