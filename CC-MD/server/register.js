const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../models');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const router = express.Router();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Token missing' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

router.post('/', async (req, res) => {
  const { FullName, Username, Email, Password } = req.body;

  try {
    const existingUser = await db.User.findOne({ where: { Email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(Password, 10);

    const user = await db.User.create({
      FullName,
      Username,
      Email,
      Password: hashedPassword,
    });

    res.status(201).json({
      message: 'User registered successfully',
      userId: user.UserID,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register user' });
  }
});

router.get('/', authenticateToken, async (req, res) => {
  try {
    const user = await db.User.findByPk(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

router.put('/', authenticateToken, async (req, res) => {
  const { FullName, Username, Email, PhoneNumber, Location } = req.body;

  try {
    const user = await db.User.findByPk(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.update({ FullName, Username, Email, PhoneNumber, Location });
    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

router.delete('/', authenticateToken, async (req, res) => {
  try {
    const user = await db.User.findByPk(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.destroy();
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;