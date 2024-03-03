const express = require('express');
const Totp = require('../models/Totp');
const router = express.Router();

router.post("/checktotp", async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the secret key exists in the TOTP table based on the provided email
    const totpData = await Totp.findOne({ email });
    const secretKeyExists = totpData && totpData.secretKey;

    if (secretKeyExists) {
      res.json({ success: true, secretKeyExists: true });
    } else {
      res.json({ success: true, secretKeyExists: false });
    }
  } catch (error) {
    console.error("An error occurred while checking secret key:", error);
    res.status(500).json({ success: false, message: "An error occurred while checking secret key" });
  }
});

module.exports = router;
