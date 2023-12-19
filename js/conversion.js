// External JavaScript file for cooking conversion

// Function to open the conversion modal
function openConversionModal() {
    $('#conversionModal').modal('show');
}

// Function to handle form submission
function submitConversion() {
    // Get values from form inputs
    var amount = $('#amount').val();
    var fromUnit = $('#fromUnit').val();
    var toUnit = $('#toUnit').val();

    // Perform conversion logic
    var result = convertCooking(amount, fromUnit, toUnit);

    // Display result
    $('#resultText').text(result);

    // Show the result section
    $('#conversionResult').show();
  
}


// Function to perform cooking conversion
function convertCooking(amount, fromUnit, toUnit) {
    if (fromUnit === toUnit) {
        return amount + ' ' + toUnit;
    } else if (fromUnit === 'teaspoons' && toUnit === 'tablespoons') {
        return amount / 3 + ' tablespoons';
    } else if (fromUnit === 'teaspoons' && toUnit === 'cups') {
        return amount / 48 + ' cups';
    } else if (fromUnit === 'tablespoons' && toUnit === 'teaspoons') {
        return amount * 3 + ' teaspoons';
    } else if (fromUnit === 'tablespoons' && toUnit === 'cups') {
        return amount / 16 + ' cups';
    } else if (fromUnit === 'cups' && toUnit === 'teaspoons') {
        return amount * 48 + ' teaspoons';
    } else if (fromUnit === 'cups' && toUnit === 'tablespoons') {
        return amount * 16 + ' tablespoons';
    } else {
        return 'Invalid conversion';
    }
}

