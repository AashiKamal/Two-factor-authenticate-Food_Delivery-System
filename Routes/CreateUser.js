const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require('express-validator');

const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs");
const jwtSecret = "MynameisEndtoEndTouTubeChannel$#"
//const jwtSecret = "MynameisAashiAndThisIsTheToken"
router.post("/createuser", [
  body("email").isEmail(),
  body("name").isLength({ min: 5 }).withMessage("Name should be more than 8 characters"),
  body("password").isLength({ min: 5 }).withMessage("Incorrect password")
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
 
  // Check if the email is already in use
  const { name, email, password, geolocation } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already in use' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'An error occurred while checking email availability' });
  }
 const salt = await bcrypt.genSalt(10);
  let secPassword = await bcrypt.hash(req.body.password,salt)
   try {
    await User.create({
        name: req.body.name,
        password: secPassword,
        email: req.body.email,
        location: req.body.location
    });
    //testing purpose
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.json({ success: false });
  }
});


router.post("/loginuser", [
  body("email").isEmail(),

  body("password").isLength({ min: 5 }).withMessage("Incorrect password")
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  let email = req.body.email;


  try {
    let userData = await User.findOne({ email });
    if (!userData) {
      return res.status(400).json({ errors: "try Login Correct Crenentials" })
    }
    const pwdCompare = await bcrypt.compare(req.body.password,userData.password)
    if (!pwdCompare) {
      return res.status(400).json({ errors: "try Login Correct Crenentials" })
    }
    const data = {
      user:{
        id:userData.id
      }
    }
    const authToken = jwt.sign(data,jwtSecret)
    return res.json({ success: true,authToken:authToken })
  
  } catch (error) {
    console.log(error);
    res.json({ success: false });
  }
});



module.exports = router;

















