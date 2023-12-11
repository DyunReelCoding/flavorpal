// Updated function to download the recipe content as PDF and store user and recipe IDs
function downloadRecipe() {
    const title = document.getElementById("recipeModalLabel").textContent;
    const description = document.getElementById("recipeModalBody").innerHTML;

    // Check if cooking has started
    if (cookingStarted) {
        // Fetch the latest login ID
        fetch('http://backendtest.test/api/latest-login-id')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch latest login ID. Status: ${response.status}, ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                const userId = data.latest_login_id;

                // Continue with the existing code to fetch the latest recipe ID
                fetch('http://backendtest.test/api/latest-recipe-id')
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`Failed to fetch latest recipe ID. Status: ${response.status}, ${response.statusText}`);
                        }
                        return response.json();
                    })
                    .then(data => {
                        const recipeId = data.latest_recipe_id;

                        // Store user and recipe IDs using fetch
                        fetch('http://backendtest.test/api/saved-recipe', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json',
                            },
                            body: JSON.stringify({
                                user_id: userId,
                                recipe_id: recipeId,
                            }),
                        })
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error(`Failed to store user and recipe IDs. Status: ${response.status}, ${response.statusText}`);
                                }
                                return response.json();
                            })
                            .then(data => {
                                console.log('User and recipe IDs stored successfully!', data);
                            })
                            .catch(error => {
                                console.error('Error storing user and recipe IDs:', error);
                                // Handle the error, show an error message, or perform any other actions
                            });

                        // Create a wrapper element for title and description
                        const contentWrapper = document.createElement("div");

                        // Create an element for the title
                        const titleElement = document.createElement("h1");
                        titleElement.textContent = title;

                        // Append the title and description to the wrapper
                        contentWrapper.appendChild(titleElement);
                        contentWrapper.innerHTML += description;

                        // Convert HTML content to PDF
                        html2pdf(contentWrapper, {
                            margin: 10,
                            filename: `${title}_recipe.pdf`,
                            image: { type: 'jpeg', quality: 0.98 },
                            html2canvas: { scale: 2 },
                            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
                        });
                    })
                    .catch(error => {
                        console.error('Error fetching latest recipe ID:', error);
                        // Handle the error, show an error message, or perform any other actions
                    });
            })
            .catch(error => {
                console.error('Error fetching latest login ID:', error);
                // Handle the error, show an error message, or perform any other actions
            });
    } else {
        alert("Click 'Start Cooking' to begin the cooking process.");
    }
}
