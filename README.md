# 🥗 Nutrition Meter Web App

A full-stack web application that helps users track the **calories, protein, carbohydrates, and fat** they consume each day, with a live dashboard and a warning when the daily calorie limit (2000 kcal) is exceeded.

> Built as a beginner-friendly, portfolio-ready project using **HTML, CSS, JavaScript (frontend)** and **Node.js, Express, MySQL (backend)**.

---

## 📌 GitHub Repository Description (short)

> A full-stack Nutrition Tracker built with Node.js, Express, MySQL, and vanilla JavaScript. Log daily meals, view real-time nutrition summaries, and get warned when you exceed your 2000 kcal daily limit. Fully responsive UI with client- and server-side validation.

---

## 📚 Table of Contents

1. [Features](#-features)
2. [Tech Stack](#-tech-stack)
3. [Architecture Diagram](#-architecture-diagram-ascii)
4. [Project Structure](#-project-structure)
5. [Installation Steps](#-installation-steps)
6. [Database Setup](#-database-setup)
7. [How to Run Locally](#-how-to-run-locally)
8. [Sample Data](#-sample-data)
9. [API Endpoints](#-api-endpoints)
10. [File-by-File Explanation](#-file-by-file-explanation)
11. [Validation Rules](#-validation-rules)
12. [Interview Questions & Answers](#-interview-questions--answers)
13. [Resume Project Description](#-resume-project-description)
14. [Future Improvements](#-future-improvements)

---

## ✨ Features

- ✅ Add food items with name, calories, protein, carbs, and fat
- ✅ View today's food log in a table
- ✅ Delete a food entry
- ✅ Live dashboard showing daily totals for all 4 nutrients
- ✅ Visual progress bar showing calories used vs. 2000 kcal limit
- ✅ Automatic **warning banner** when calories exceed 2000 kcal
- ✅ Client-side **and** server-side validation (never trust the frontend alone!)
- ✅ Fully **responsive design** — works on mobile, tablet, and desktop
- ✅ Data persisted in **MySQL**, so it survives server restarts

---

## 🛠 Tech Stack

| Layer        | Technology                          |
|--------------|--------------------------------------|
| Frontend     | HTML5, CSS3, Vanilla JavaScript (Fetch API) |
| Backend      | Node.js, Express.js                  |
| Database     | MySQL (via `mysql2` driver)          |
| Other        | dotenv (env config), CORS, nodemon (dev) |

---

## 🏗 Architecture Diagram (ASCII)

```
                         ┌────────────────────────────┐
                         │         BROWSER             │
                         │  (User's Device / Mobile)   │
                         │                              │
                         │   index.html + style.css     │
                         │           +                  │
                         │       script.js (Fetch API)  │
                         └──────────────┬───────────────┘
                                        │
                              HTTP Requests (JSON)
                              GET / POST / DELETE
                                        │
                                        ▼
                         ┌────────────────────────────┐
                         │      EXPRESS SERVER         │
                         │        (server.js)          │
                         │                              │
                         │  Middleware: cors, json      │
                         │  Static files: /frontend     │
                         │                              │
                         │   Routes Layer (routes.js)   │
                         │  ┌────────────────────────┐  │
                         │  │ POST   /api/foods       │  │
                         │  │ GET    /api/foods       │  │
                         │  │ DELETE /api/foods/:id   │  │
                         │  │ GET    /api/summary     │  │
                         │  └────────────────────────┘  │
                         │      (validation here)       │
                         └──────────────┬───────────────┘
                                        │
                              SQL Queries (mysql2)
                                        │
                                        ▼
                         ┌────────────────────────────┐
                         │         MySQL DATABASE      │
                         │       (nutrition_db)        │
                         │                              │
                         │   Table: food_entries        │
                         │   id | food_name | calories  │
                         │   protein | carbs | fat       │
                         │   entry_date | created_at     │
                         └────────────────────────────┘
```

**Request flow example (adding food):**
`User fills form → script.js validates → fetch POST /api/foods → routes.js validates again → INSERT INTO food_entries → response sent back → script.js refreshes dashboard`

---

## 📁 Project Structure

```
nutrition-meter-web-app/
│
├── frontend/
│   ├── index.html        # Single page UI: form, dashboard, table
│   ├── style.css         # All styling + responsive design
│   └── script.js         # Fetch calls, validation, DOM updates
│
├── backend/
│   ├── server.js         # Express app entry point
│   ├── routes.js         # All /api/* endpoint logic
│   ├── db.js             # MySQL connection pool
│   ├── package.json      # Backend dependencies & scripts
│   └── .env.example      # Template for environment variables
│
├── database/
│   └── nutrition_db.sql  # Schema + sample data
│
├── screenshots/          # App screenshots for this README
│
├── .gitignore
└── README.md
```

---

## ⚙️ Installation Steps

### Prerequisites
Make sure you have these installed:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MySQL](https://dev.mysql.com/downloads/) (v8 or higher recommended)
- A code editor like VS Code
- (Optional) [MySQL Workbench](https://dev.mysql.com/downloads/workbench/) for a visual database UI

### Step 1 — Clone the repository
```bash
git clone https://github.com/your-username/nutrition-meter-web-app.git
cd nutrition-meter-web-app
```

### Step 2 — Install backend dependencies
```bash
cd backend
npm install
```
This reads `package.json` and installs `express`, `mysql2`, `cors`, `dotenv`, and `nodemon`.

### Step 3 — Configure environment variables
```bash
cp .env.example .env
```
Then open `.env` and fill in your real MySQL username/password:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=nutrition_db
PORT=5000
```

---

## 🗄 Database Setup

### Option A — Using the MySQL command line
```bash
mysql -u root -p < ../database/nutrition_db.sql
```
This single command creates the `nutrition_db` database, the `food_entries` table, and inserts 5 sample rows.

### Option B — Using MySQL Workbench (GUI)
1. Open MySQL Workbench and connect to your local server.
2. Go to **File → Open SQL Script** and select `database/nutrition_db.sql`.
3. Click the ⚡ lightning bolt icon to execute the whole script.

### Verify it worked
```sql
USE nutrition_db;
SELECT * FROM food_entries;
```
You should see 5 sample food entries.

---

## ▶️ How to Run Locally

### Start the backend server
```bash
cd backend
npm start
```
You should see:
```
✅ Server is running on http://localhost:5000
📊 Open http://localhost:5000 in your browser to use the app
```

> 💡 For development with auto-restart on file changes, use `npm run dev` instead (requires `nodemon`, already in `package.json`).

### Open the app
Because `server.js` serves the `frontend` folder as static files, simply open:
```
http://localhost:5000
```
in your browser. No separate frontend server is needed.

> Alternative: you can open `frontend/index.html` directly in the browser using a tool like VS Code's "Live Server" extension — just remember to change `API_BASE_URL` in `script.js` to `http://localhost:5000/api` in that case, since the frontend and backend would then be on different origins.

---

## 🍱 Sample Data

The `database/nutrition_db.sql` file inserts these rows automatically:

| Food                     | Calories | Protein | Carbs | Fat |
|--------------------------|----------|---------|-------|-----|
| Banana                   | 105      | 1.3     | 27    | 0.4 |
| Grilled Chicken Breast   | 165      | 31      | 0     | 3.6 |
| Brown Rice (1 cup)       | 215      | 5       | 45    | 1.8 |
| Boiled Egg               | 78       | 6.3     | 0.6   | 5.3 |
| Almonds (28g)            | 164      | 6       | 6     | 14  |

**Total for sample data:** 727 kcal, 49.6g protein, 78.6g carbs, 25.1g fat — well under the 2000 kcal limit, so the warning banner stays hidden until you add more food.

---

## 🔌 API Endpoints

Base URL: `http://localhost:5000/api`

| Method | Endpoint         | Description                              | Body (JSON)                                                              |
|--------|------------------|-------------------------------------------|---------------------------------------------------------------------------|
| GET    | `/health`        | Check if the API is running              | —                                                                          |
| GET    | `/foods`         | Get today's food entries                 | —                                                                          |
| POST   | `/foods`         | Add a new food entry                     | `{ "food_name": "Apple", "calories": 95, "protein": 0.5, "carbs": 25, "fat": 0.3 }` |
| DELETE | `/foods/:id`     | Delete a food entry by ID                | —                                                                          |
| GET    | `/summary`       | Get today's totals + over-limit flag     | —                                                                          |

### Example: POST /api/foods (success response)
```json
{
  "success": true,
  "message": "Food entry added successfully.",
  "id": 6
}
```

### Example: GET /api/summary (response)
```json
{
  "success": true,
  "data": {
    "total_calories": 727,
    "total_protein": 49.6,
    "total_carbs": 78.6,
    "total_fat": 25.1,
    "total_items": 5,
    "calorie_limit": 2000,
    "is_over_limit": false
  }
}
```

### Example: validation error response
```json
{
  "success": false,
  "message": "calories must be a number."
}
```

---

## 📄 File-by-File Explanation

### `backend/server.js`
The **entry point** of the backend. It creates the Express app, applies middleware (`cors`, `express.json`, static file serving), mounts the API routes from `routes.js`, and starts listening on a port. Run this file with `node server.js` to start everything.

### `backend/db.js`
Creates a **MySQL connection pool** using credentials from `.env`. A pool (instead of one single connection) lets multiple requests query the database at the same time efficiently — important for any real web app.

### `backend/routes.js`
Defines all `/api/*` endpoints: adding, listing, deleting food entries, and computing the daily summary. Contains **server-side validation** (`validateFoodInput`) which is the real security boundary — frontend validation is only for user experience.

### `backend/package.json`
Lists the npm dependencies (`express`, `mysql2`, `cors`, `dotenv`) and defines the `start`/`dev` scripts.

### `backend/.env.example`
A template showing which environment variables are needed. Copy it to `.env` (which is git-ignored) so secrets never get committed to GitHub.

### `database/nutrition_db.sql`
Creates the database and `food_entries` table, and inserts sample rows so the app is testable immediately after setup.

### `frontend/index.html`
The single HTML page containing: the warning banner, the 4 dashboard summary cards, the calorie progress bar, the "Add Food" form, and the food log table. All elements have IDs that `script.js` uses to update them dynamically.

### `frontend/style.css`
Defines the visual theme (colors, spacing, shadows) using CSS variables, plus a **CSS Grid–based responsive layout** that adapts from desktop down to mobile screens using a media query.

### `frontend/script.js`
The brains of the frontend. It:
- Validates form input before sending it anywhere (`validateForm`)
- Talks to the backend using the **Fetch API** (`fetchSummary`, `fetchFoodList`, form submit handler, delete handler)
- Updates the DOM with fresh data (`renderFoodTable`, updating card text content)
- Toggles the warning banner and progress bar based on the calorie total

---

## ✅ Validation Rules

Applied on **both** frontend (instant feedback) and backend (real protection):

| Field      | Rule                                              |
|------------|----------------------------------------------------|
| food_name  | Required, cannot be empty or only spaces           |
| calories   | Required, must be a number, cannot be negative     |
| protein    | Required, must be a number, cannot be negative     |
| carbs      | Required, must be a number, cannot be negative     |
| fat        | Required, must be a number, cannot be negative     |

**Why validate on both sides?**
Frontend validation = better user experience (instant red-text feedback, no waiting for a server round-trip).
Backend validation = real security, since anyone can bypass the frontend entirely (e.g. using Postman or browser dev tools) and send raw requests directly to the API.

---

## 🎤 Interview Questions & Answers

**Q1: Why did you separate `routes.js` from `server.js`?**
> To follow the **separation of concerns** principle. `server.js` is responsible for setting up and starting the application (middleware, server config), while `routes.js` is responsible for business logic — what happens when a specific URL is hit. This makes the codebase easier to navigate, test, and scale as more features are added.

**Q2: Why use a connection pool instead of a single MySQL connection?**
> A single connection can only handle one query at a time and can fail if the connection drops. A **pool** keeps several ready-to-use connections open, automatically manages reconnects, and lets multiple requests query the database concurrently — which is essential for any production-grade web app.

**Q3: How do you prevent SQL injection in this project?**
> By using **parameterized queries** with `?` placeholders (e.g. `pool.query('... WHERE id = ?', [id])`) instead of directly concatenating user input into SQL strings. The `mysql2` driver automatically escapes the values, so malicious input like `1; DROP TABLE food_entries;` is treated as plain data, not executable SQL.

**Q4: Why validate input on both the frontend and backend?**
> Frontend validation improves user experience by giving instant feedback without a network round trip. However, it can be bypassed (browser dev tools, Postman, curl), so **backend validation is the real security boundary** — it's the only validation you can actually trust.

**Q5: What is CORS and why is it needed here?**
> CORS (Cross-Origin Resource Sharing) is a browser security feature that blocks a webpage from making requests to a different origin (domain/port) unless that server explicitly allows it. Since the frontend could be served from a different port than the backend during development, we use the `cors` middleware to allow those cross-origin requests.

**Q6: How does the app decide if the user has exceeded their calorie limit?**
> The backend's `/api/summary` endpoint sums all calories for today using `SUM(calories)` in SQL, compares it against a constant `CALORIE_LIMIT = 2000`, and returns an `is_over_limit` boolean. The frontend then uses that flag to show/hide the warning banner and apply red styling — the **business logic lives on the server**, and the frontend simply reflects it.

**Q7: Why store `entry_date` separately instead of relying only on `created_at`?**
> `entry_date` (a `DATE` type) lets us cleanly group and filter "today's" entries using `WHERE entry_date = CURDATE()` without worrying about time-of-day components, while `created_at` (a `TIMESTAMP`) preserves the exact moment of insertion for ordering/auditing purposes.

**Q8: How would you scale this app to support multiple users?**
> Add a `users` table, an authentication system (e.g. JWT-based login), and a `user_id` foreign key column on `food_entries`. Every query in `routes.js` would then filter by the logged-in user's ID, so each user only sees their own data.

**Q9: What's the difference between `async/await` and callbacks, and which did you use?**
> Callbacks pass a function to be run after an asynchronous operation finishes, which can lead to deeply nested "callback hell" code. `async/await` (used throughout this project via `mysql2/promise`) lets asynchronous code read like synchronous code, making it far more readable and easier to handle errors with `try/catch`.

**Q10: How is this project's frontend "responsive"?**
> Using **CSS Grid with `auto-fit`/`minmax()`** for the summary cards (so the number of columns adjusts automatically to screen width), a max-width centered container, and a **media query** at 480px that stacks the two-column form into a single column on small phone screens.

---

## 📝 Resume Project Description

**Nutrition Meter Web App** | *Full-Stack Project (Node.js, Express, MySQL, JavaScript)*
- Built a full-stack nutrition tracking web app enabling users to log daily food intake and monitor calories, protein, carbs, and fat through a real-time dashboard.
- Designed a RESTful API with Express.js supporting CRUD operations, backed by a normalized MySQL schema and a connection-pooled database layer.
- Implemented dual-layer input validation (client + server) and parameterized SQL queries to prevent invalid data and SQL injection.
- Built a fully responsive UI from scratch using HTML5, CSS3 (Grid/Flexbox, media queries), and vanilla JavaScript with the Fetch API — no frontend framework dependency.
- Added a dynamic calorie-limit warning system that flags users in real time when daily intake exceeds 2000 kcal.

---

## 🚀 Future Improvements

- User authentication (login/signup) so multiple people can use the app with private data
- Weekly/monthly nutrition history with charts (e.g. using Chart.js)
- Editing existing food entries (currently only add/delete supported)
- Customizable calorie/macro goals per user instead of a fixed 2000 kcal
- Food search powered by a public nutrition API (e.g. USDA FoodData Central) to auto-fill nutrition values
- Deploy to a live host (e.g. Render/Railway for backend, free MySQL host or PlanetScale for database)

---

## 📜 License

This project is open-source under the MIT License — free to use for learning and portfolio purposes.
