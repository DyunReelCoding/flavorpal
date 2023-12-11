// Your login logic here
async function login() {
    // Get user input
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
        // Perform validation if needed (e.g., check if email and password are not empty)
        if (!email || !password) {
            throw new Error('Please enter both email and password.');
        }

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
            // Handle authentication error
            document.getElementById("loginErrorMessage").innerText = data.error;
            document.getElementById("loginErrorMessage").style.display = "block";
        } else {
            // Login successful
            // Perform additional logic if needed (e.g., storing user data in local storage)
            // ...

            // Original logic: Prompt the user for recipe preferences
            const userPreference = prompt("What type of recipe do you like? (e.g., meat, soup, vegan)");

            // Store user preference in local storage
            localStorage.setItem("userPreference", userPreference);

            // Redirect to the dashboard
            window.location.href = "dashboard.html"; // Replace with your actual dashboard URL
        }
    } catch (error) {
        // Handle validation errors or network errors
        console.error('Error:', error);
        document.getElementById("loginErrorMessage").innerText = error.message;
        document.getElementById("loginErrorMessage").style.display = "block";
    }
}
