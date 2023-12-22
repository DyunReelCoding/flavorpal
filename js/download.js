// Updated function to download the recipe content as PDF and store user and recipe IDs
function downloadRecipe() {
    const title = document.getElementById("recipeModalLabel").textContent;
    const description = document.getElementById("recipeModalBody").innerHTML;

                        // Create a wrapper element for title and description
                        const contentWrapper = document.createElement("div");

                        // Create an element for the title
                        const titleElement = document.createElement("h1");
                        titleElement.textContent = title;

                        // Append the title and description to the wrapper
                        contentWrapper.appendChild(titleElement);
                        contentWrapper.innerHTML += description;

                        // Convert HTML content to PDF
                        html2pdf(contentWrapper, {
                            margin: 10,
                            filename: `${title}_recipe.pdf`,
                            image: { type: 'jpeg', quality: 0.98 },
                            html2canvas: { scale: 2 },
                            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
                        });
                    
}
