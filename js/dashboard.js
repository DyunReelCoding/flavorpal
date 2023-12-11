// Perform logout actions
function logout() {
    // Set a flag in sessionStorage to indicate logout
    sessionStorage.setItem('logoutFlag', 'true');

    // Redirect to the homepage (index.html in this case)
    window.location.href = "index.html";
}

// Check for logout flag on page load
document.addEventListener('DOMContentLoaded', function () {
    // Check if logout flag is set
    const logoutFlag = sessionStorage.getItem('logoutFlag');
    
    if (logoutFlag === 'true') {
        // Clear the flag to prevent the logout behavior on subsequent loads
        sessionStorage.removeItem('logoutFlag');

        // Redirect to the homepage (index.html in this case)
        window.location.href = "index.html";
    }
});


// Display welcome message on Home button click
function displayHome() {
    const welcomeMessage = document.getElementById("welcomeMessage");
    welcomeMessage.textContent = "Welcome to the Home Page";

    // Fetch recipes based on user preference stored in local storage
    fetchRecipes();
}





// Fetch recipes based on user preference stored in local storage
async function fetchRecipes() {
    try {
        // Retrieve user preference from local storage
        const userPreference = localStorage.getItem('userPreference');

        // If userPreference is not available, ask for it asynchronously
        if (!userPreference) {
            const response = await fetchRecipesWithPrompt();
            const data = await response.json();

            // Display recipes
            displayRecipes(data.meals);
        } else {
            // Fetch recipes from The Meal DB API based on user preference
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${userPreference}`);
            const data = await response.json();

            // Display recipes
            displayRecipes(data.meals);
        }
    } catch (error) {
        console.error("Error fetching recipes:", error);
    }
}

// Fetch recipes with prompt to get user preference
async function fetchRecipesWithPrompt() {
    // Ask the user for their recipe preference
    const userPreference = prompt("What type of recipe do you like? (e.g., meat, soup, vegan)");

    // Store the user preference in local storage
    localStorage.setItem('userPreference', userPreference);

    // Fetch recipes from The Meal DB API based on user preference
    return fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${userPreference}`);
}

// Display recipes on the dashboard
function displayRecipes(recipes) {
    const recipeSection = document.getElementById("recipeSection");

    // Clear previous content
    recipeSection.innerHTML = '';

    // Display each recipe as a card
    recipes.forEach(recipe => {
        const recipeCard = `
            <div class="col-md-4 mb-4">
                <div class="card">
                    <img src="${recipe.strMealThumb}" class="card-img-top" alt="${recipe.strMeal}" style="cursor: pointer;" onclick="showRecipe('${recipe.strMeal}', '${formatDescription(recipe.strInstructions)}')">
                    <div class="card-body">
                        <h5 class="card-title">${recipe.strMeal}</h5>
                    </div>
                </div>
            </div>
        `;

        // Append the card to the recipe section
        recipeSection.innerHTML += recipeCard;
    });
}

// Show recipe details in the modal
function showRecipe(title, description) {
    const recipeModalLabel = document.getElementById("recipeModalLabel");
    const recipeModalBody = document.getElementById("recipeModalBody");

    // Set modal title and body content
    recipeModalLabel.textContent = title;
    recipeModalBody.innerHTML = description;

    // Show the modal using Bootstrap's modal function
    new bootstrap.Modal(document.getElementById('recipeModal')).show();
}

// Format recipe description for better readability
function formatDescription(description) {
    const paragraphs = description.split('\r\n');
    const formattedDescription = paragraphs.map(paragraph => `<p>${paragraph}</p>`).join('');
    return formattedDescription;
}

// Search recipes based on user input
async function searchRecipes() {
    try {
        const searchInput = document.getElementById('searchInput').value;

        if (searchInput) {
            // Remove the recommendations section
            const recommendationsSection = document.getElementById('recommendations');
            recommendationsSection.innerHTML = '';

            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchInput}`);
            const data = await response.json();

            // Display search results above the recipe section
            displaySearchResult(searchInput, data.meals);

            // Clear the search input field
            document.getElementById('searchInput').value = '';
        }
    } catch (error) {
        console.error("Error searching recipes:", error);
    }
}

// Display search result above the recipe section
function displaySearchResult(searchTerm, recipes) {
    const searchResultSection = document.getElementById("recipeSection");

    // Clear previous content
    searchResultSection.innerHTML = '';

    // Display search result
    const searchResultMessage = document.createElement('p');
    searchResultMessage.textContent = `Search result for "${searchTerm}":`;
    searchResultSection.appendChild(searchResultMessage);

    // Display each recipe as a card
    recipes.forEach(recipe => {
        const recipeCard = `
            <div class="col-md-4 mb-4">
                <div class="card">
                    <img src="${recipe.strMealThumb}" class="card-img-top" alt="${recipe.strMeal}" style="cursor: pointer;" onclick="showRecipe('${recipe.strMeal}', '${formatDescription(recipe.strInstructions)}')">
                    <div class="card-body">
                        <h5 class="card-title">${recipe.strMeal}</h5>
                    </div>
                </div>
            </div>
        `;

        // Append the card to the search result section
        searchResultSection.innerHTML += recipeCard;
    });
}

async function fetchCategoryForRecipe(recipeTitle) {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${recipeTitle}`);
        const data = await response.json();

        if (data.meals && data.meals.length > 0) {
            // Assuming the category is available in the first result
            return data.meals[0].strCategory;
        }

        // Return a default category or handle the case where no category is found
        return 'DefaultCategory';
    } catch (error) {
        console.error("Error fetching category for recipe:", error);
        // Return a default category or handle the error case
        return 'DefaultCategory';
    }
}

function startCooking() {
    cookingStarted = true;
    const recipeTitle = document.getElementById('recipeModalLabel').innerText;
    const recipeDescription = document.getElementById('recipeModalBody').innerText;
    let nutritionPayload; 
    let nutritionId; 

    // Fetch nutrition data from the MealDB API
    fetch('https://www.themealdb.com/api/json/v1/1/random.php')
        .then(response => response.json())
        .then(data => {
            const meal = data.meals[0];

            // Extract nutrition data from the meal object
            nutritionPayload = {
                calories: parseFloat(meal.strMeasure1) || 0,
                protein: parseFloat(meal.strMeasure2) || 0,
                carbohydrates: parseFloat(meal.strMeasure3) || 0,
                fat: parseFloat(meal.strMeasure4) || 0,
                fiber: parseFloat(meal.strMeasure5) || 0,
            };

            // Send a request to store the recipe category
            return fetch('http://backendtest.test/api/recipe-categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    title: recipeTitle,
                    description: recipeDescription,
                }),
            });
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Send a request to store the nutrition data
            return fetch('http://backendtest.test/api/nutrition', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(nutritionPayload),
            });
        })
        .then(nutritionResponse => nutritionResponse.json()) 
        .then(nutritionData => {
            nutritionId = nutritionData.nutrition_id;

            // Fetch the latest nutrition ID
            return fetch('http://backendtest.test/api/latest-nutrition-id');
        })
        .then(latestIdResponse => latestIdResponse.json())
        .then(latestIdData => {
            nutritionId = latestIdData.latest_nutrition_id;

            // Construct the recipe payload
            const recipePayload = {
                title: recipeTitle,
                description: recipeDescription,
                // instructions: instructions,
                difficulty: 3,
                preparation_time: 30,
                nutrition_id: nutritionId, // Use the latest nutrition ID
            };

            // Send a request to store the recipe
            return fetch('http://backendtest.test/api/recipes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(recipePayload),
            });
        })
        .then(recipeResponse => {
            if (!recipeResponse.ok) {
                throw new Error('Network response was not ok');
            }

            // // Display cooking started message in the UI
            // const cookingStartedMessage = document.createElement('div');
            // cookingStartedMessage.classList.add('alert', 'alert-info');
            // cookingStartedMessage.textContent = 'Cooking started!';
            // document.getElementById('recipeModalBody').appendChild(cookingStartedMessage);
            alert('Cooking started!');

            // Optionally, you can update the UI or perform any other actions for nutrition and cooking started

            console.log('Cooking started!');
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle the error, show an error message, or perform any other actions
        });
}



// Initial fetch of recipes and user profile
fetchRecipes();