document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission
    login();
});

document.getElementById('registerForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission
    register();
});


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

    fetch('http://backendtest.test/api/register', {
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



async function login() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    // Basic form validation
    if (!email || !password) {
        document.getElementById('loginErrorMessage').innerText = 'Please enter both email and password.';
        document.getElementById('loginErrorMessage').style.display = 'block';
        return;
    }

    try {
        const response = await fetch("http://backendtest.test/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        });

        if (!response.ok) {
            throw new Error('Wrong Credentials');
        }

        const data = await response.json();

        if (data.error) {
            // Update the error message element
            document.getElementById("loginErrorMessage").innerText = data.error;
            document.getElementById("loginErrorMessage").style.display = "block";
        } else {
            // Fetch latest login ID
            const latestLoginIdResponse = await fetch('http://backendtest.test/api/latest-login-id');
            const latestLoginIdData = await latestLoginIdResponse.json();

            if (!latestLoginIdResponse.ok) {
                throw new Error(`Failed to fetch latest login ID. Status: ${latestLoginIdResponse.status}, ${latestLoginIdResponse.statusText}`);
            }

            const userId = latestLoginIdData.latest_login_id;

            // Prompt user for preference
            const userPreference = prompt("What type of recipe do you like? (e.g., meat, soup, vegan)");

            // Store user preference
            const userPreferenceResponse = await fetch('http://backendtest.test/api/user-preference', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    user_id: 1,
                    preference_type: userPreference,
                }),
            });

            if (!userPreferenceResponse.ok) {
                throw new Error(`Failed to store user preference. Status: ${userPreferenceResponse.status}, ${userPreferenceResponse.statusText}`);
            }

            // Set user preference in local storage
            localStorage.setItem("userPreference", userPreference);

            // Redirect to dashboard
            window.location.href = "dashboard.html";
        }
    } catch (error) {
        console.error('Error:', error);

        // Update the error message element for various scenarios
        if (error.message.includes('Please enter both email and password.')) {
            document.getElementById("loginErrorMessage").innerText = 'Please enter both email and password.';
        } else if (error.message.includes('Wrong Credentials')) {
            document.getElementById("loginErrorMessage").innerText = 'Incorrect email or password. Please try again.';
        } else {
            document.getElementById("loginErrorMessage").innerText = 'Login failed. Please try again.';
        }

        document.getElementById("loginErrorMessage").style.display = "block";
    }
}

