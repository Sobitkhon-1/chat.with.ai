// server/routes/grok.js
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  const { message } = req.body;

  // Simulated Grok response for now
  res.json({ reply: `Grok: This is a simulated response to "${message}"` });
});

module.exports = router;
