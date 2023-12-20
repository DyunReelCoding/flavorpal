function showRateModal() {
    let latestUserId; // Declare the variable in the outer scope

    // Fetch the latest user ID
    fetch('http://backendtest.test/api/latest-login-id')
        .then(response => response.json())
        .then(latestIdData => {
            latestUserId = latestIdData.latest_login_id;

            // Set the latest user ID in the modal
            document.querySelector("#user_id").value = latestUserId;

            // Trigger the modal show using vanilla JavaScript
            var myModal = new bootstrap.Modal(document.getElementById('rateModal'));
            myModal.show();
        })
        .catch(error => {
            console.error('Error fetching latest IDs:', error);
            // Handle the error, show an error message, or perform any other actions
        });
}


// Function to close the modal
function closeRateModal() {
    $('#rateModal').modal('hide');
}

(function(){
    emailjs.init("3IwhtwsqcQvo-GTWk"); // Replace with your EmailJS user ID
})();

function sendEmail() {
    var sendername = document.querySelector("#sendername").value;
    var to = document.querySelector("#to").value;
    var subject = document.querySelector("#subject").value;
    var replyto = document.querySelector("#replyto").value;
    var review = document.querySelector("#review").value;
    var userId = document.querySelector("#user_id").value;
    var score = document.querySelector("#score").value;

     // Check if any of the required fields are empty
     if (!sendername || !subject || !replyto || !review || !score) {
        alert("Please fill in all required fields before sending the email.");
        return;
    }

    // Check if the email field is empty or does not contain "@"
    if (!replyto || replyto.indexOf("@") === -1) {
        alert("Please enter a valid email address.");
        return;
    }
     // Validate the score
     if (isNaN(score) || score < 1 || score > 10) {
        alert("Please enter a valid score between 1 and 10.");
        return;
    }

    // Fetch the latest recipe ID
    fetch('http://backendtest.test/api/latest-recipe-id')
        .then(response => response.json())
        .then(latestIdData => {
            var recipeId = latestIdData.latest_recipe_id;

            // Store common parameters in variables
            const commonParams = {
                user_id: userId,
                recipe_id: recipeId,
                score: score,
                review: review,
            };

            // Store email-specific parameters in a variable
            var emailParams = {
                sendername: sendername,
                to: to,
                subject: subject,
                replyto: replyto,
                review: review,
                user_id: userId,
                recipe_id: recipeId,
                score: score,
            };

            var serviceID = "service_egdp949"; // Replace with your EmailJS service ID
            var templateID = "template_694ai8l"; // Replace with your EmailJS template ID

            // Send email using EmailJS
            emailjs.send(serviceID, templateID, emailParams)
                .then(res => {
                    // Email sent successfully
                    alert("Email sent successfully!!");
                    storeRatingData(commonParams);

                    // Reset the form
                    document.querySelector("#contactForm").reset();
                })
                .catch(error => {
                    // Handle email sending error
                    console.error('Error sending email:', error);
                    alert("Failed to send email. Please try again later.");
                });
        })
        .catch(error => {
            console.error('Error fetching latest recipe ID:', error);
            // Handle the error, show an error message, or perform any other actions
        });
}


function storeRatingData(params) {
    var endpoint = 'http://backendtest.test/api/rating';

    fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(params),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Failed to store rating data. Status: ${response.status}, ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Rating data stored successfully!', data);
        // You can add additional handling if needed
    })
    .catch(error => {
        console.error('Error storing rating data:', error);
        alert("Failed to store rating data. Please try again later.");
    });
}
