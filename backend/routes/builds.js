const express = require('express');
const jwt = require('jsonwebtoken');
const Build = require('../models/Build');

const router = express.Router();
const secret = 'your_jwt_secret';

// Middleware to check token
function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(403).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Save a build
router.post('/', auth, async (req, res) => {
  try {
    const { components, totalPrice } = req.body;

    const newBuild = new Build({
      userId: req.user.userId,
      components,
      totalPrice,
      createdAt: new Date(),
    });

    await newBuild.save();
    res.status(201).json({ message: 'Build saved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save build' });
  }
});

// Get user builds
router.get('/', auth, async (req, res) => {
  try {
    const builds = await Build.find({ userId: req.user.userId });
    res.json(builds);
  } catch {
    res.status(500).json({ error: 'Failed to load builds' });
  }
});

// Get all builds for logged-in user
router.get('/mybuilds', auth, async (req, res) => {
  try {
    const builds = await Build.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json(builds);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch builds' });
  }
});

module.exports = router;
