// Perform logout actions
function logout() {
    
    window.location.replace("index.html");
}

// Display welcome message on Home button click
function displayHome() {
    const welcomeMessage = document.getElementById("welcomeMessage");
    welcomeMessage.textContent = "Welcome to Flavorpal";

    // Fetch recipes based on user preference stored in local storage
    fetchRecipes();
}

// Fetch recipes based on user preference stored in local storage
async function fetchRecipes() {
    try {
        // Show the loading indicator
        const loadingIndicator = document.getElementById('loadingIndicator');
        if (loadingIndicator) {
            loadingIndicator.style.display = 'block';
        }

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

        // Hide the loading indicator after fetching data
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }
    } catch (error) {
        console.error("Error fetching recipes:", error);
        // Hide the loading indicator in case of an error
        const loadingIndicator = document.getElementById('loadingIndicator');
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }
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

async function searchRecipes() {
    try {
        const searchInput = document.getElementById('searchInput').value;

        if (searchInput) {
            // Show the loading indicator for search results
            const searchLoadingIndicator = document.getElementById('searchLoadingIndicator');
            if (searchLoadingIndicator) {
                searchLoadingIndicator.style.display = 'block';
            }

            // Remove the recommendations section
            const recommendationsSection = document.getElementById('recommendations');
            recommendationsSection.innerHTML = '';

            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchInput}`);
            const data = await response.json();

            // Display search results above the recipe section
            displaySearchResult(searchInput, data.meals);

            // Clear the search input field
            document.getElementById('searchInput').value = '';

            // Hide the loading indicator for search results
            if (searchLoadingIndicator) {
                searchLoadingIndicator.style.display = 'none';
            }
        }
    } catch (error) {
        console.error("Error searching recipes:", error);

        // Hide the loading indicator for search results in case of an error
        const searchLoadingIndicator = document.getElementById('searchLoadingIndicator');
        if (searchLoadingIndicator) {
            searchLoadingIndicator.style.display = 'none';
        }
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
    searchResultMessage.style.color = 'white';
    searchResultMessage.style.fontWeight = 'bold';
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

//fetch recipes from mealdb
async function fetchCategoryForRecipe(recipeTitle) {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${recipeTitle}`);
        const data = await response.json();

        if (data.meals && data.meals.length > 0) {
            
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

// StartCooking function
function startCooking() {
    cookingStarted = true;
    const recipeTitle = document.getElementById('recipeModalLabel').innerText;
    const recipeDescription = document.getElementById('recipeModalBody').innerText;
    let nutritionPayload;
    let recipeId;
    let userId;

    // Fetch the latest login ID
    fetch('http://flavorpal-project-2.test/api/latest-login-id')
        .then(latestLoginIdResponse => {
            if (!latestLoginIdResponse.ok) {
                throw new Error('Failed to fetch latest login ID');
            }
            return latestLoginIdResponse.json();
        })
        .then(latestLoginIdData => {
            userId = latestLoginIdData.latest_login_id;

            // Post the recipe with the user ID
            return fetch('http://flavorpal-project-2.test/api/recipe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userId, 
                    title: recipeTitle,
                    description: recipeDescription,
                }),
            });
        })
        .then(recipeResponse => {
            if (!recipeResponse.ok) {
                throw new Error('Failed to post recipe');
            }
            return recipeResponse.json();
        })
        .then(recipeData => {
            recipeId = recipeData.recipe_id;

            // Fetch the latest recipe ID
            return fetch('http://flavorpal-project-2.test/api/latest-recipe-id');
        })
        .then(latestRecipeIdResponse => {
            if (!latestRecipeIdResponse.ok) {
                throw new Error('Failed to fetch latest recipe ID');
            }
            return latestRecipeIdResponse.json();
        })
        .then(latestRecipeIdData => {
            recipeId = latestRecipeIdData.latest_recipe_id;

            // Fetch nutrition data from the MealDB API
            return fetch('https://www.themealdb.com/api/json/v1/1/random.php');
        })
        .then(response => response.json())
        .then(data => {
            const meal = data.meals[0];

            // Extract nutrition data from the meal object
            nutritionPayload = {
                recipe_id: recipeId,
                calories: parseFloat(meal.strMeasure1) || 0,
                protein: parseFloat(meal.strMeasure2) || 0,
                carbohydrates: parseFloat(meal.strMeasure3) || 0,
                fat: parseFloat(meal.strMeasure4) || 0,
                fiber: parseFloat(meal.strMeasure5) || 0,
            };

            // Post the nutrition data
            return fetch('http://flavorpal-project-2.test/api/nutrition', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(nutritionPayload),
            });
        })
        .then(nutritionResponse => {
            if (!nutritionResponse.ok) {
                throw new Error('Failed to post nutrition data');
            }
            return nutritionResponse.json();
        })
        .then(nutritionData => {
            nutritionId = nutritionData.nutrition_id;

           
            alert('Cooking started!');
            console.log('Cooking started!');
        })
        .catch(error => {
            console.error('Error:', error.message);
            // Handle the error, show an error message, or perform any other actions
        });
}


// Initial fetch of recipes and user profile
fetchRecipes();