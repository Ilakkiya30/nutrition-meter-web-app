const express = require('express');
const cors = require('cors');
const path = require('path');

require('dotenv').config();

const foodRoutes = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '../frontend')));

app.use('/api', foodRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Nutrition Meter API is running!'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});