const express = require('express');
const router = express.Router();
const pool = require('./db');

const CALORIE_LIMIT = 2000;

function validateFoodInput(body) {
  const { food_name, calories, protein, carbs, fat } = body;

  if (!food_name || food_name.trim().length === 0) {
    return 'Food name is required.';
  }

  const numericFields = { calories, protein, carbs, fat };

  for (const [key, value] of Object.entries(numericFields)) {
    if (value === undefined || value === null || value === '') {
      return `${key} is required.`;
    }

    if (isNaN(value)) {
      return `${key} must be a number.`;
    }

    if (Number(value) < 0) {
      return `${key} cannot be negative.`;
    }
  }

  return null;
}

router.post('/foods', async (req, res) => {
  try {
    const errorMessage = validateFoodInput(req.body);

    if (errorMessage) {
      return res.status(400).json({
        success: false,
        message: errorMessage
      });
    }

    const { food_name, calories, protein, carbs, fat } = req.body;

    const sql = `
      INSERT INTO food_entries
      (food_name, calories, protein, carbs, fat, entry_date)
      VALUES (?, ?, ?, ?, ?, CURDATE())
    `;

    const [result] = await pool.query(sql, [
      food_name,
      calories,
      protein,
      carbs,
      fat
    ]);

    res.status(201).json({
      success: true,
      message: 'Food entry added successfully.',
      id: result.insertId
    });
  } catch (error) {
    console.error('Error adding food:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding food.'
    });
  }
});

router.get('/foods', async (req, res) => {
  try {
    const sql = `
      SELECT
        id,
        food_name,
        calories,
        protein,
        carbs,
        fat,
        entry_date
      FROM food_entries
      WHERE entry_date = CURDATE()
      ORDER BY created_at DESC
    `;

    const [rows] = await pool.query(sql);

    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching foods:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching foods.'
    });
  }
});

router.delete('/foods/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid food ID.'
      });
    }

    const [result] = await pool.query(
      'DELETE FROM food_entries WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Food entry not found.'
      });
    }

    res.json({
      success: true,
      message: 'Food entry deleted successfully.'
    });
  } catch (error) {
    console.error('Error deleting food:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting food.'
    });
  }
});

router.get('/summary', async (req, res) => {
  try {
    const sql = `
      SELECT
        COALESCE(SUM(calories), 0) AS total_calories,
        COALESCE(SUM(protein), 0) AS total_protein,
        COALESCE(SUM(carbs), 0) AS total_carbs,
        COALESCE(SUM(fat), 0) AS total_fat,
        COUNT(*) AS total_items
      FROM food_entries
      WHERE entry_date = CURDATE()
    `;

    const [rows] = await pool.query(sql);
    const totals = rows[0];

    res.json({
      success: true,
      data: {
        ...totals,
        calorie_limit: CALORIE_LIMIT,
        is_over_limit: totals.total_calories > CALORIE_LIMIT
      }
    });
  } catch (error) {
    console.error('Error fetching summary:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching summary.'
    });
  }
});

module.exports = router;