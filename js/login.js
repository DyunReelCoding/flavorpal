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

            const user_id = latestLoginIdData.latest_login_id;



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
                    user_id: user_id,
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

