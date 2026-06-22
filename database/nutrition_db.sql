CREATE DATABASE IF NOT EXISTS nutrition_db;

USE nutrition_db;

CREATE TABLE IF NOT EXISTS food_entries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    food_name VARCHAR(100) NOT NULL,
    calories FLOAT NOT NULL,
    protein FLOAT NOT NULL,
    carbs FLOAT NOT NULL,
    fat FLOAT NOT NULL,
    entry_date DATE NOT NULL DEFAULT (CURRENT_DATE),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO food_entries
(food_name, calories, protein, carbs, fat, entry_date)
VALUES
('Banana', 105, 1.3, 27, 0.4, CURDATE()),
('Grilled Chicken Breast', 165, 31, 0, 3.6, CURDATE()),
('Brown Rice (1 cup)', 215, 5, 45, 1.8, CURDATE()),
('Boiled Egg', 78, 6.3, 0.6, 5.3, CURDATE()),
('Almonds (28g)', 164, 6, 6, 14, CURDATE());