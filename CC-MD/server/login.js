const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models');
const router = express.Router();

router.post('/', async (req, res) => {
  const { Email, Password } = req.body;

  try {
    console.log("Attempting to login with email:", Email);

    const user = await db.User.findOne({ where: { Email } });
    if (!user) {
      console.log("User not found for email:", Email);
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    console.log("User found, comparing password...");
    const isMatch = await bcrypt.compare(Password, user.Password);
    if (!isMatch) {
      console.log("Password mismatch for email:", Email);
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.UserID, email: user.Email },
      process.env.JWT_SECRET,
      { expiresIn: '10000h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token: token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

module.exports = router;
