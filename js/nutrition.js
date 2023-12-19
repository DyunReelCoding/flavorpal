function openNutritionModal() {
    // Fetch the nutrition data and update the modal content
    fetchNutritionData()
        .then(nutritionData => {
            // Update the modal content with the fetched nutrition data
            updateNutritionModalContent(nutritionData);

            // Show the modal
            $('#nutritionModal').modal('show');
        })
        .catch(error => {
            console.error('Error fetching nutrition data:', error.message);
            // Handle the error, show an error message, or perform any other actions
        });
}

function fetchNutritionData() {
    return fetch('https://www.themealdb.com/api/json/v1/1/random.php')
        .then(response => response.json())
        .then(data => {
            const meal = data.meals[0];

            // Extract nutrition data from the meal object
            return {
                calories: parseFloat(meal.strMeasure1) || 0,
                protein: parseFloat(meal.strMeasure2) || 0,
                carbohydrates: parseFloat(meal.strMeasure3) || 0,
                fat: parseFloat(meal.strMeasure4) || 0,
                fiber: parseFloat(meal.strMeasure5) || 0,
            };
        });
}

function updateNutritionModalContent(nutritionData) {
    // Update the content of the nutrition modal dynamically
    const modalTitle = document.getElementById('nutritionModalLabel');
    modalTitle.innerText = 'Nutrition Information';

    const modalBody = document.getElementById('nutritionModalBody');
    modalBody.innerHTML = `
        <p>Calories: ${nutritionData.calories}</p>
        <p>Protein: ${nutritionData.protein}</p>
        <p>Carbohydrates: ${nutritionData.carbohydrates}</p>
        <p>Fat: ${nutritionData.fat}</p>
        <p>Fiber: ${nutritionData.fiber}</p>
    `;
}
