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