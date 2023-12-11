// edit-profile.js

// Fetch and populate the edit profile form with user data when the page loads
document.addEventListener("DOMContentLoaded", fetchAndPopulateEditProfileForm);

// Function to fetch user data and populate the edit profile form
async function fetchAndPopulateEditProfileForm() {
    try {
        // You can fetch user data from your backend using AJAX or fetch API
        const response = await fetch('YOUR_BACKEND_API_ENDPOINT'); // Replace with your API endpoint
        const userData = await response.json();

        // Populate the edit profile form with user data
        populateEditProfileForm(userData);
    } catch (error) {
        console.error('Error fetching user data for edit profile:', error);
    }
}

// Function to populate the edit profile form with user data
function populateEditProfileForm(userData) {
    const editName = document.getElementById("editName");
    const editEmail = document.getElementById("editEmail");

    // Populate the form fields with user data
    editName.value = userData.name;
    editEmail.value = userData.email;
}

// Function to update the user profile
async function updateProfile() {
    try {
        // Get updated profile data from the form
        const updatedName = document.getElementById("editName").value;
        const updatedEmail = document.getElementById("editEmail").value;

        // You can send the updated data to your backend for processing
        // Example using fetch API:
        const response = await fetch('YOUR_BACKEND_UPDATE_PROFILE_ENDPOINT', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: updatedName,
                email: updatedEmail,
                // Add other fields as needed
            }),
        });

        // Check if the update was successful
        if (response.ok) {
            alert("Profile updated successfully");
        } else {
            alert("Failed to update profile");
        }
    } catch (error) {
        console.error('Error updating user profile:', error);
    }
}
