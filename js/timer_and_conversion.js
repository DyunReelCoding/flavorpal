// js/timer.js

let timer;
let timerStatus = "Pending";
let timeRemaining;
let timerPaused = false;
let cookingStarted = true;

function openTimer() {
    if (cookingStarted) {
        $('#timerModal').modal('show');
    } else {
        alert("Click 'Start Cooking' to begin the cooking process.");
    }
}

function startTimer() {
    const inputMinutes = document.getElementById('timerInput').value;

    if (!inputMinutes || isNaN(inputMinutes) || inputMinutes <= 0) {
        alert("Please enter a valid time in minutes.");
        return;
    }

    const totalTimeInSeconds = inputMinutes * 60;
    timeRemaining = totalTimeInSeconds;

    // Set initial status and display
    updateTimerStatus();
    updateTimerDisplay();
    sendCookingTimerData();

    // Start the timer
    timer = setInterval(() => {
        if (!timerPaused) {
            updateTimer();
        }
    }, 1000);
}

function pauseTimer() {
    timerPaused = !timerPaused;
    updateTimerStatus();
}

function resetTimer() {
    clearInterval(timer);
    timerStatus = "Pending";
    timerPaused = false;
    startTimer();
}

function updateTimer() {
    if (timeRemaining > 0) {
        timeRemaining--;
        updateTimerDisplay();
    } else {
        clearInterval(timer);
        timerStatus = "Done";
        updateTimerStatus();

        // Send cooking timer data to the Laravel backend
        sendCookingTimerData();
    }
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    document.getElementById('timeRemaining').innerText = formattedTime;
}

function updateTimerStatus() {
    document.getElementById('timerStatus').innerText = timerStatus + (timerPaused ? " (Paused)" : "");
}


function sendCookingTimerData() {
    // Fetch the latest login ID
    fetch('http://backendtest.test/api/latest-login-id')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch latest login ID. Status: ${response.status}, ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            const loginId = data.latest_login_id;

            // Use the fetched login ID as the user ID
            const userId = loginId;

            // Continue with the existing code to fetch latest recipe ID and send cooking timer data
            fetch('http://backendtest.test/api/latest-recipe-id')
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Failed to fetch latest recipe ID. Status: ${response.status}, ${response.statusText}`);
                    }
                    return response.json();
                })
                .then(data => {
                    const recipeId = data.latest_recipe_id;

                    const cookingTimerData = {
                        user_id: userId,
                        recipe_id: recipeId,
                        duration: document.getElementById('timerInput').value,
                        status: timerStatus,
                    };

                    return fetch('http://backendtest.test/api/cooking-timers', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                        },
                        body: JSON.stringify(cookingTimerData),
                    });
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Failed to send cooking timer data. Status: ${response.status}, ${response.statusText}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Cooking timer data sent successfully!', data);
                })
                .catch(error => {
                    console.error('Error sending cooking timer data:', error);
                    // Handle the error, show an error message, or perform any other actions
                });
        })
        .catch(error => {
            console.error('Error fetching latest login ID:', error);
            // Handle the error, show an error message, or perform any other actions
        });
}

//converision JS

// Function to open the conversion modal
function openConversionModal() {
    if (cookingStarted) {
        // Fetch the latest recipe ID before opening the modal
        fetchLatestRecipeId()
            .then(latestRecipeId => {
                // Update the recipe ID input field
                document.getElementById('recipeIdInput').value = latestRecipeId;

                // Show the conversion modal after updating the recipe ID
                $('#conversionModal').modal('show');

                // Attach the convertIngredient function to the form submit event
                document.getElementById('conversionForm').addEventListener('submit', convertIngredient);
            })
            .catch(error => {
                console.error('Error fetching latest recipe ID:', error);
            });
    } else {
        // Alert the user to start cooking before conversion
        alert("Click 'Start Cooking' to begin the cooking process.");
    }
}

// Function to fetch the latest recipe ID
function fetchLatestRecipeId() {
    return fetch('http://backendtest.test/api/latest-recipe-id')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch latest recipe ID. Status: ${response.status}, ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => data.latest_recipe_id)
        .catch(error => {
            throw new Error(`Error parsing JSON: ${error}`);
        });
}

// Function to convert quantity to a desired unit
function convertToDesiredUnit(quantity, originalUnit) {
    // Define conversion factors based on measurement units
    const conversionFactors = {
        'Grams': 1,
        'Kilograms': 0.001,
        'Liters': 0.001,
        'Teaspoons': 0.2,
        'Tablespoons': 0.0666666667,
        'Cups': 0.0041666667,
        'Fluid Ounces': 0.033814,
        'Milliliters': 1,
        'Pints': 0.00211338,
        'Gallons': 0.000264172,
        'Quarts': 0.0000351951,
        'Ounces': 0.03527396,
        // Add more conversion factors as needed
    };

    // Perform the conversion
    const conversionFactor = conversionFactors[originalUnit] || 1; // Default to 1 if the unit is not found
    const convertedQuantity = quantity * conversionFactor;

    return convertedQuantity;
}

// Function to display the conversion result in the modal
function displayConversionResult(ingredientName, convertedQuantity) {
    // Replace this with your logic to update the content in the conversion modal
    const conversionContent = document.getElementById('conversionContent');
    conversionContent.innerHTML = `<p>Converted Quantity of ${ingredientName}: ${convertedQuantity} kg</p>`;

    // Show the conversion modal
    openConversionModal();
}

// Function to handle the form submission and initiate the conversion
function convertIngredient(event) {
    event.preventDefault();

    const ingredientName = document.getElementById('ingredientNameInput').value;
    const quantity = document.getElementById('quantityInput').value;
    const unit = document.getElementById('unitInput').value;
    const recipeId = document.getElementById('recipeIdInput').value;

    // Convert quantity to a desired unit
    const convertedQuantity = convertToDesiredUnit(quantity, unit);

    // Display the conversion result in the modal
    displayConversionResult(ingredientName, convertedQuantity);

    // Store the converted ingredient entry
    storeIngredientEntry(ingredientName, convertedQuantity, unit, recipeId);
}

// Function to store the converted ingredient entry
function storeIngredientEntry(ingredientName, convertedQuantity, unit, recipeId) {
    const conversionData = {
        ingredient_name: ingredientName,
        quantity: convertedQuantity,
        measurement_unit: unit,
        recipe_id: recipeId,
    };

    fetch('http://backendtest.test/api/ingredient-entries', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(conversionData),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Failed to store converted ingredient. Status: ${response.status}, ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Converted ingredient entry stored successfully!', data);

        // Handle the response, update UI, or perform any other actions

        // Clear input fields after successful conversion and storage
        document.getElementById('ingredientNameInput').value = '';
        document.getElementById('quantityInput').value = '';
        document.getElementById('unitInput').value = '';
    })
    .catch(error => {
        console.error('Error storing converted ingredient entry:', error);
        // Handle the error, show an error message, or perform any other actions
    });
}

// Attach the openConversionModal function to the appropriate event (e.g., button click)
document.getElementById('conversionButton').addEventListener('click', openConversionModal);
