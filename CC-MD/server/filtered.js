const express = require('express');
const jwt = require('jsonwebtoken');
const { Survey, Mandor } = require('../models');
require('dotenv').config();

const router = express.Router();

const checkAuth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Authorization token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userID = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

router.get('/', checkAuth, async (req, res) => {
  try {
    const survey = await Survey.findOne({
      where: { UserID: req.userID },
    });

    if (!survey || !survey.FilteredMandors) {
      return res.status(404).json({ error: 'No filtered mandors found for this user' });
    }

    const filteredMandorsArray = survey.FilteredMandors.split(',');

    const mandors = await Mandor.unscoped().findAll({
      where: {
        MandorID: filteredMandorsArray,
      },
    });

    if (mandors.length === 0) {
      return res.status(404).json({ error: 'No mandors found matching the filtered criteria' });
    }

    const orderedMandors = filteredMandorsArray.map(mandorID => {
      return mandors.find(mandor => mandor.MandorID.toString() === mandorID);
    }).filter(mandor => mandor !== undefined);

    res.json(orderedMandors);
  } catch (error) {
    console.error('Error fetching mandors:', error);
    res.status(500).json({ error: 'Failed to fetch mandors' });
  }
});

module.exports = router;
