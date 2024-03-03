const express = require('express');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const Totp = require('../models/Totp');
const router = express.Router();

router.post('/createtotp', async (req, res) => {
  try {
    const { email } = req.body;

    // Check if a Totp document with the given email already exists in the database
    const existingTotp = await Totp.findOne({ email });
    if (existingTotp) {
      return res.json({ success: false, message: 'Totp for this email already exists' });
    }

    // Generate a secret key
    const secret = speakeasy.generateSecret();

    // Generate the TOTP token using the secret key
    const token = speakeasy.totp({
      secret: secret.base32,
      encoding: 'base32',
    });
    

    // Generate the OTP Auth URL for the QR code
    const otpAuthUrl = speakeasy.otpauthURL({
      secret: secret.base32,
      label: req.body.email,
      issuer: 'YourApp',
      algorithm: 'sha1',
      encoding: 'base32',
    });

    // Generate the QR code as a data URL
    const qrCode = await qrcode.toDataURL(otpAuthUrl);

    // Create a new Totp document in the database
    const totp = new Totp({
      email: req.body.email,
      secretKey: secret.base32,
      token: token,
    });
    await totp.save();

    // Send the response to the client
    res.json({
      success: true,
      qrCode: qrCode,
      secretKey: secret.base32,
    });
  } catch (error) {
    console.error('Error creating TOTP:', error);
    res.status(500).json({ success: false, message: 'Error creating TOTP' });
  }
});



router.post('/activate', (req, res) => {
  const { email, verificationCode } = req.body;

  Totp.findOne({ email })
    .then((totp) => {
      if (!totp) {
        return res.json({ success: false, message: 'Totp not found' });
      }

      console.log('Server Secret Key:', totp.secretKey);
      console.log('User Code:', verificationCode);

      // Generate the current time in seconds
      const currentTime = Math.floor(Date.now() / 1000);

      // Set the time window for token verification (in seconds)
      const timeWindow = 30; // Adjust this value as needed

      // Verify the token with the specified time window
      const verified = speakeasy.totp.verifyDelta({
        secret: totp.secretKey,
        encoding: 'base32',
        token: verificationCode,
        window: timeWindow,
        time: currentTime,
      });

      if (verified !== null) {
        // Activation successful
        // Perform any additional actions or save the activation status in the database
        res.json({ success: true, message: 'Activation successful' });
        
      } else {
        res.json({ success: false, message: 'Invalid verification code' });
      }
    })
    .catch((error) => {
      console.error('Error finding totp:', error);
      res.status(500).json({ success: false, message: 'Error finding totp' });
    });
});


router.delete('/disable2fa', async (req, res) => {
  try {
    const email = req.body.email;

    const result = await Totp.deleteOne({ email });

    if (result.deletedCount > 0) {
      res.json({ success: true });
    } else {
      res.json({ success: false, message: 'No matching email found in the Totp table' });
    }
  } catch (error) {
    console.error('An error occurred while disabling 2FA:', error);
    res.status(500).json({ success: false, message: 'Failed to disable 2FA' });
  }
});

module.exports = router;
