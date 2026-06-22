// =====================================================================
// File: script.js
// Why this file exists:
//   This file contains ALL the frontend logic: fetching data from the
//   backend API, validating the form before submission, updating the
//   dashboard numbers, rendering the food table, and handling delete
//   button clicks. It is what makes the page "interactive".
// =====================================================================

// ---------------------------------------------------------------------
// CONFIG
// Base URL of our backend API. Since we serve the frontend from the
// same Express server (see server.js), we can use a relative path.
// If you run the frontend separately (e.g. via VS Code Live Server),
// change this to "http://localhost:5000/api".
// ---------------------------------------------------------------------
const API_BASE_URL = '/api';
const CALORIE_LIMIT = 2000;

// ---------------------------------------------------------------------
// GRAB DOM ELEMENTS
// We "cache" references to elements once, instead of querying the DOM
// repeatedly, which is more efficient.
// ---------------------------------------------------------------------
const foodForm = document.getElementById('foodForm');
const foodNameInput = document.getElementById('foodName');
const caloriesInput = document.getElementById('calories');
const proteinInput = document.getElementById('protein');
const carbsInput = document.getElementById('carbs');
const fatInput = document.getElementById('fat');

const submitBtn = document.getElementById('submitBtn');
const formMessage = document.getElementById('formMessage');

const totalCaloriesEl = document.getElementById('totalCalories');
const totalProteinEl = document.getElementById('totalProtein');
const totalCarbsEl = document.getElementById('totalCarbs');
const totalFatEl = document.getElementById('totalFat');

const warningBanner = document.getElementById('warningBanner');
const caloriesCard = document.querySelector('.calories-card');
const calorieProgress = document.getElementById('calorieProgress');
const progressText = document.getElementById('progressText');

const foodTableBody = document.getElementById('foodTableBody');
const emptyState = document.getElementById('emptyState');

// ---------------------------------------------------------------------
// FUNCTION: showFieldError
// Why: Reusable helper to display a validation error message under a
// specific input field and add a red border to that field.
// ---------------------------------------------------------------------
function showFieldError(inputEl, errorEl, message) {
    errorEl.textContent = message;
    inputEl.classList.toggle('invalid', Boolean(message));
}

// ---------------------------------------------------------------------
// FUNCTION: validateForm
// Why: Frontend validation gives the user INSTANT feedback (no need to
// wait for the server). We still validate again on the backend in
// routes.js, because frontend validation can always be bypassed.
// Returns true if the form is valid, false otherwise.
// ---------------------------------------------------------------------
function validateForm() {
    let isValid = true;

    // --- Validate food name ---
    const foodNameError = document.getElementById('foodNameError');
    if (foodNameInput.value.trim().length === 0) {
        showFieldError(foodNameInput, foodNameError, 'Please enter a food name.');
        isValid = false;
    } else {
        showFieldError(foodNameInput, foodNameError, '');
    }

    // --- Validate the four numeric fields using one shared check ---
    const numericFields = [
        { input: caloriesInput, errorEl: document.getElementById('caloriesError'), label: 'Calories' },
        { input: proteinInput, errorEl: document.getElementById('proteinError'), label: 'Protein' },
        { input: carbsInput, errorEl: document.getElementById('carbsError'), label: 'Carbs' },
        { input: fatInput, errorEl: document.getElementById('fatError'), label: 'Fat' }
    ];

    numericFields.forEach(({ input, errorEl, label }) => {
        const value = input.value;

        if (value === '' || value === null) {
            showFieldError(input, errorEl, `${label} is required.`);
            isValid = false;
        } else if (isNaN(value)) {
            showFieldError(input, errorEl, `${label} must be a number.`);
            isValid = false;
        } else if (Number(value) < 0) {
            showFieldError(input, errorEl, `${label} cannot be negative.`);
            isValid = false;
        } else {
            showFieldError(input, errorEl, '');
        }
    });

    return isValid;
}

// ---------------------------------------------------------------------
// FUNCTION: fetchSummary
// Why: Gets today's totals from the backend (/api/summary) and updates
// the dashboard cards, progress bar, and warning banner.
// ---------------------------------------------------------------------
async function fetchSummary() {
    try {
        const response = await fetch(`${API_BASE_URL}/summary`);
        const result = await response.json();

        if (!result.success) {
            console.error('Failed to load summary:', result.message);
            return;
        }

        const { total_calories, total_protein, total_carbs, total_fat, is_over_limit } = result.data;

        // Update the dashboard numbers (toFixed(1) keeps 1 decimal place)
        totalCaloriesEl.textContent = Number(total_calories).toFixed(0);
        totalProteinEl.textContent = Number(total_protein).toFixed(1);
        totalCarbsEl.textContent = Number(total_carbs).toFixed(1);
        totalFatEl.textContent = Number(total_fat).toFixed(1);

        // Update progress bar (cap visual value at the max so it doesn't overflow)
        const cappedCalories = Math.min(Number(total_calories), CALORIE_LIMIT);
        calorieProgress.value = cappedCalories;
        progressText.textContent = `${Number(total_calories).toFixed(0)} / ${CALORIE_LIMIT} kcal`;

        // Show/hide the warning banner and red styling based on the limit
        warningBanner.classList.toggle('hidden', !is_over_limit);
        caloriesCard.classList.toggle('over-limit', is_over_limit);

    } catch (error) {
        console.error('Network error while fetching summary:', error);
    }
}

// ---------------------------------------------------------------------
// FUNCTION: fetchFoodList
// Why: Gets today's list of food entries (/api/foods) and renders them
// into the table on the page.
// ---------------------------------------------------------------------
async function fetchFoodList() {
    try {
        const response = await fetch(`${API_BASE_URL}/foods`);
        const result = await response.json();

        if (!result.success) {
            console.error('Failed to load food list:', result.message);
            return;
        }

        renderFoodTable(result.data);
    } catch (error) {
        console.error('Network error while fetching food list:', error);
    }
}

// ---------------------------------------------------------------------
// FUNCTION: renderFoodTable
// Why: Takes an array of food entries and builds the HTML table rows.
// Separating "rendering" into its own function keeps fetch logic and
// DOM-building logic cleanly separated.
// ---------------------------------------------------------------------
function renderFoodTable(foods) {
    // Clear any existing rows before re-rendering
    foodTableBody.innerHTML = '';

    // Show "empty state" message if there is no data
    if (foods.length === 0) {
        emptyState.classList.remove('hidden');
        return;
    }
    emptyState.classList.add('hidden');

    // Loop through each food entry and create a table row for it
    foods.forEach((food) => {
        const row = document.createElement('tr');

        // Using template literals to build the row's inner HTML.
        // NOTE: food_name is escaped via textContent-safe approach below
        // to avoid any HTML injection from user input.
        row.innerHTML = `
            <td>${escapeHtml(food.food_name)}</td>
            <td>${Number(food.calories).toFixed(0)}</td>
            <td>${Number(food.protein).toFixed(1)}</td>
            <td>${Number(food.carbs).toFixed(1)}</td>
            <td>${Number(food.fat).toFixed(1)}</td>
            <td><button class="delete-btn" data-id="${food.id}">Delete</button></td>
        `;

        foodTableBody.appendChild(row);
    });

    // Attach click listeners to all the newly created delete buttons
    document.querySelectorAll('.delete-btn').forEach((btn) => {
        btn.addEventListener('click', handleDeleteClick);
    });
}

// ---------------------------------------------------------------------
// FUNCTION: escapeHtml
// Why: A basic safety measure — if a user types something like
// "<script>" as a food name, this prevents it from being treated as
// real HTML when we insert it into the page.
// ---------------------------------------------------------------------
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ---------------------------------------------------------------------
// FUNCTION: handleDeleteClick
// Why: Called when a "Delete" button in the table is clicked. Sends a
// DELETE request to the backend, then refreshes the table and summary.
// ---------------------------------------------------------------------
async function handleDeleteClick(event) {
    const foodId = event.target.getAttribute('data-id');

    // Ask the user to confirm before deleting (simple safety check)
    const confirmed = confirm('Are you sure you want to delete this food entry?');
    if (!confirmed) return;

    try {
        const response = await fetch(`${API_BASE_URL}/foods/${foodId}`, {
            method: 'DELETE'
        });
        const result = await response.json();

        if (result.success) {
            // Refresh both the table and the dashboard numbers
            await Promise.all([fetchFoodList(), fetchSummary()]);
        } else {
            alert(result.message || 'Could not delete this entry.');
        }
    } catch (error) {
        console.error('Network error while deleting food:', error);
        alert('Something went wrong. Please try again.');
    }
}

// ---------------------------------------------------------------------
// FUNCTION: handleFormSubmit
// Why: Runs when the user submits the "Add Food" form. Validates the
// input, sends a POST request to the backend, and refreshes the page
// data on success.
// ---------------------------------------------------------------------
async function handleFormSubmit(event) {
    // Stop the browser from doing a full page reload on form submit
    event.preventDefault();

    // Step 1: Run frontend validation first
    if (!validateForm()) {
        formMessage.textContent = 'Please fix the errors above.';
        formMessage.className = 'form-message error';
        return;
    }

    // Step 2: Build the data object to send to the backend
    const foodData = {
        food_name: foodNameInput.value.trim(),
        calories: Number(caloriesInput.value),
        protein: Number(proteinInput.value),
        carbs: Number(carbsInput.value),
        fat: Number(fatInput.value)
    };

    // Step 3: Disable the button while the request is in progress, so
    // the user can't accidentally submit the same item twice
    submitBtn.disabled = true;
    submitBtn.textContent = 'Adding...';

    try {
        const response = await fetch(`${API_BASE_URL}/foods`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(foodData)
        });

        const result = await response.json();

        if (result.success) {
            formMessage.textContent = '✅ Food added successfully!';
            formMessage.className = 'form-message success';

            // Clear the form for the next entry
            foodForm.reset();

            // Refresh the table and dashboard so the new item shows up
            await Promise.all([fetchFoodList(), fetchSummary()]);
        } else {
            // Backend validation failed (e.g. duplicate safety check)
            formMessage.textContent = `❌ ${result.message}`;
            formMessage.className = 'form-message error';
        }
    } catch (error) {
        console.error('Network error while adding food:', error);
        formMessage.textContent = '❌ Could not reach the server. Please try again.';
        formMessage.className = 'form-message error';
    } finally {
        // Always re-enable the button, whether it succeeded or failed
        submitBtn.disabled = false;
        submitBtn.textContent = '➕ Add Food';
    }
}

// ---------------------------------------------------------------------
// EVENT LISTENERS
// ---------------------------------------------------------------------
foodForm.addEventListener('submit', handleFormSubmit);

// ---------------------------------------------------------------------
// INITIAL PAGE LOAD
// As soon as the page loads, fetch today's data so the user sees their
// existing entries and totals immediately (not an empty dashboard).
// ---------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    fetchSummary();
    fetchFoodList();
});
