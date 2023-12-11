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
        document.getElementById('registerForm').reset(); // Clear form
        document.getElementById('registerSuccessMessage').style.display = 'block';
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

async function login() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
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
            document.getElementById("loginErrorMessage").innerText = data.error;
            document.getElementById("loginErrorMessage").style.display = "block";
        } else {
            const latestLoginIdResponse = await fetch('http://backendtest.test/api/latest-login-id');
            const latestLoginIdData = await latestLoginIdResponse.json();

            if (!latestLoginIdResponse.ok) {
                throw new Error(`Failed to fetch latest login ID. Status: ${latestLoginIdResponse.status}, ${latestLoginIdResponse.statusText}`);
            }

            const userId = latestLoginIdData.latest_login_id;

            const userPreference = prompt("What type of recipe do you like? (e.g., meat, soup, vegan)");

            const userPreferenceResponse = await fetch('http://backendtest.test/api/user-preference', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    user_id: 1  , //userId is not working
                    preference_type: userPreference,
                }),
            });

            if (!userPreferenceResponse.ok) {
                throw new Error(`Failed to store user preference. Status: ${userPreferenceResponse.status}, ${userPreferenceResponse.statusText}`);
            }

            localStorage.setItem("userPreference", userPreference);
            window.location.href = "dashboard.html";
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById("loginErrorMessage").innerText = error.message;
        document.getElementById("loginErrorMessage").style.display = "block";
    }
}
