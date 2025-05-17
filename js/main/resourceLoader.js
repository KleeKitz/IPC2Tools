export let returnData = [];

export async function dataFromJson(location) {
    try {
        returnData = []

        const response = await fetch(`../../data/${location}.json`);
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status}`);
        }

        const data = await response.json();


        returnData = data;

    } catch (error) {
        console.error("Error loading data:", error);

        const errorMessageElement = document.getElementById('error-message');
        if (errorMessageElement) {
            errorMessageElement.textContent = "Failed to load JSON data. Please try again later.";
            errorMessageElement.style.display = "block";
        } else {
            alert("An error occurred while loading JSON data. Please check the console for details.");
        }
    }
}