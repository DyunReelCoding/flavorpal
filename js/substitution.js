// substitution.js

function openSubstitutionModal() {
    $('#substitutionModal').modal('show');
}

// substitution.js

function performSubstitution() {
    // Get the input value
    var ingredient = $('#substitutionInput').val();

    // Perform substitution logic
    var substitutionResult = substituteIngredient(ingredient);

    // Display the result in the modal
    $('#substitutionResult').html('<strong>Substitution Result:</strong> ' + substitutionResult);

    // Prevent the modal from closing
    return false;
}


function substituteIngredient(ingredient) {
    var substitutions = {
        'sugar': 'honey',
        'flour': 'almond flour',
        'butter': 'coconut oil',
        'milk': 'almond milk',
        'egg': 'flaxseed egg',
        'salt': 'sea salt',
        'vanilla extract': 'maple syrup',
        'baking powder': 'baking soda',
        'cocoa powder': 'carob powder',
        'vegetable oil': 'olive oil',
    };

    return substitutions[ingredient] || 'No substitution found';
}
