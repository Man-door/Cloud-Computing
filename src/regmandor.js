const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../models');
const router = express.Router();

router.post('/', async (req, res) => {
  const { FullName, Username, Email, Password } = req.body;

  try {
    const existingMandor = await db.Mandor.findOne({ where: { Email } });
    if (existingMandor) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(Password, 10);

    const mandor = await db.Mandor.create({
      FullName,
      Username,
      Email,
      Password: hashedPassword,
    });

    res.status(201).json({
      message: 'Mandor registered successfully',
      mandorId: mandor.MandorID,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register mandor' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const mandor = await db.Mandor.findByPk(req.params.id);
    if (!mandor) {
      return res.status(404).json({ error: 'Mandor not found' });
    }
    res.status(200).json(mandor);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch mandor' });
  }
});

router.put('/:id', async (req, res) => {
  const { FullName, Username, Email, PhoneNumber, Location, Sertifikat, Experience, Portofilio } = req.body;
  try {
    const mandor = await db.Mandor.findByPk(req.params.id);
    if (!mandor) {
      return res.status(404).json({ error: 'Mandor not found' });
    }

    await mandor.update({ FullName, Username, Email, PhoneNumber, Location, Sertifikat, Experience, Portofilio });
    res.status(200).json({ message: 'Mandor updated successfully', mandor });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update mandor' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const mandor = await db.Mandor.findByPk(req.params.id);
    if (!mandor) {
      return res.status(404).json({ error: 'Mandor not found' });
    }

    await mandor.destroy();
    res.status(200).json({ message: 'Mandor deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete mandor' });
  }
});

module.exports = router;
