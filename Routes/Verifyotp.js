const express = require('express');
const speakeasy = require('speakeasy');
const Totp = require('../models/Totp');
const router = express.Router();

router.post('/verifyotp', async (req, res) => {
  const { email, otp } = req.body;

  try {
    const totpData = await Totp.findOne({ email });
    if (!totpData) {
      return res.json({ success: false, message: 'TOTP verification failed: User not found' });
    }

    const { secretKey } = totpData;

    // Generate the current time in seconds
    const currentTime = Math.floor(Date.now() / 1000);

    // Set the time window for token verification (in seconds)
    const timeWindow = 30; // Adjust this value as needed

    // Verify the token with the specified time window
    const isValid = speakeasy.totp.verifyDelta({
      secret: secretKey,
      encoding: 'base32',
      token: otp,
      window: timeWindow,
      time: currentTime,
    });
    console.log(isValid);
    if (isValid ) {
      // OTP verification successful
      return res.json({ success: true, message: 'TOTP verification successful' });
    } else {
      // Invalid OTP
      
      return res.json({ success: false, message: 'Invalid TOTP' });
    }
  } catch (error) {
    console.error('An error occurred while verifying TOTP:', error);
    res.status(500).json({ success: false, message: 'An error occurred while verifying TOTP' });
  }
});

module.exports = router;
