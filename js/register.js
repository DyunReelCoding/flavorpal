function register() {
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    // Basic form validation
    if (!username || !email || !password) {
        document.getElementById('registerErrorMessage').innerText = 'All fields are required. Please fill out all the fields.';
        document.getElementById('registerErrorMessage').style.display = 'block';

        // Clear success message if displayed
        document.getElementById('registerSuccessMessage').style.display = 'none';
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        document.getElementById('registerErrorMessage').innerText = 'Invalid email format. Please enter a valid email address.';
        document.getElementById('registerErrorMessage').style.display = 'block';

        // Clear success message if displayed
        document.getElementById('registerSuccessMessage').style.display = 'none';
        return;
    }

    // Password length validation
    if (password.length < 8) {
        document.getElementById('registerErrorMessage').innerText = 'Password must be at least 8 characters long.';
        document.getElementById('registerErrorMessage').style.display = 'block';

        // Clear success message if displayed
        document.getElementById('registerSuccessMessage').style.display = 'none';
        return;
    }

    fetch('http://flavorpal-project-2.test/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            email: email,
            password: password,
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Update the success message element
        document.getElementById('registerSuccessMessage').innerText = 'Registration successful!';
        document.getElementById('registerSuccessMessage').style.display = 'block';

        // Clear error message if displayed
        document.getElementById('registerErrorMessage').style.display = 'none';

        // Reset the form
        document.getElementById('registerForm').reset();
    })
    .catch(error => {
        console.error('Error:', error);

        // Update the error message element for various scenarios
        if (error.message.includes('Network response was not ok')) {
            document.getElementById('registerErrorMessage').innerText = 'Registration failed. Please check your network connection.';
        } else {
            document.getElementById('registerErrorMessage').innerText = 'Registration failed. Please check your input and try again.';
        }

        document.getElementById('registerErrorMessage').style.display = 'block';

        // Clear success message if displayed
        document.getElementById('registerSuccessMessage').style.display = 'none';
    });
}