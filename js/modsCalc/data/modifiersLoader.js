export let modifiersData = [];

export async function loadModifiers() {
    try {
        const response = await fetch('../../data/mods.json');
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status}`);
        }

        const data = await response.json();

        if (!data || !Array.isArray(data.modifiers)) {
            throw new Error('Invalid data structure: expected { modifiers: [...] }');
        }

        modifiersData = data;

    } catch (error) {
        console.error("Error loading modifiers:", error);

        const errorMessageElement = document.getElementById('error-message');
        if (errorMessageElement) {
            errorMessageElement.textContent = "Failed to load modifiers. Please try again later.";
            errorMessageElement.style.display = "block";
        } else {
            alert("An error occurred while loading modifiers. Please check the console for details.");
        }
    }
}