// server/index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const geminiRoute = require('./routes/gemini');
const grokRoute = require('./routes/grok');

app.use('/api/gemini', geminiRoute);
app.use('/api/grok', grokRoute);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
