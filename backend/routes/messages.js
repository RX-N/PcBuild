const express = require('express');
const Message = require('../models/Message');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    await Message.create({ name, email, message });
    res.status(201).json({ message: 'Message received!' });
  } catch {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

module.exports = router;
