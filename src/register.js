const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../models');
const router = express.Router();

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

router.get('/:id', async (req, res) => {
  try {
    const user = await db.User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

router.put('/:id', async (req, res) => {
  const { FullName, Username, Email, PhoneNumber, Location } = req.body;
  try {
    const user = await db.User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.update({ FullName, Username, Email, PhoneNumber, Location });
    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const user = await db.User.findByPk(req.params.id);
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