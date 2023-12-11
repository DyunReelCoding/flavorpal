// Function to fetch user data
async function fetchUserData() {
    try {
        // Fetch user data from the server
        const response = await fetch("http://backendtest.test/api/get-user-data", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                // Add any other headers if needed
            },
            credentials: "include", // Include cookies in the request
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const userData = await response.json();
        console.log(userData); // Log user data to the console

        displayUserData(userData);
    } catch (error) {
        console.error("Error fetching user data:", error);
    }
}
