export function setupExclusiveCheckboxHandling() {
    const eventCraftingCheckbox = document.getElementById('eventCrafting');
    const glowingCraftingCheckbox = document.getElementById('glowingCrafting');
    const qualitySmithingCheckbox = document.getElementById('qualitySmithing');
    const holySmithingCheckbox = document.getElementById('holySmithing');
    const feedbackMessage = document.createElement('div');
    feedbackMessage.style.color = 'red';
    feedbackMessage.style.marginTop = '10px';
    const checkboxGroup = document.querySelector('.checkbox-group');
    checkboxGroup.appendChild(feedbackMessage);

    function updateExclusiveFeedback() {
        const selectedExclusive = [
            eventCraftingCheckbox.checked,
            glowingCraftingCheckbox.checked,
            qualitySmithingCheckbox.checked,
            holySmithingCheckbox.checked
        ].filter(Boolean).length;

        if (selectedExclusive > 1) {
            feedbackMessage.textContent = 'You can only select one of the special modifiers.';
        } else {
            feedbackMessage.textContent = '';
        }
    }

    eventCraftingCheckbox.addEventListener('change', updateExclusiveFeedback);
    glowingCraftingCheckbox.addEventListener('change', updateExclusiveFeedback);
    qualitySmithingCheckbox.addEventListener('change', updateExclusiveFeedback);
    holySmithingCheckbox.addEventListener('change', updateExclusiveFeedback);
}

export function setupCraftingModsEquippedHandling() {
    const craftingModsEquippedCheckbox = document.getElementById('craftingModsEquipped');
    const crafterModExtras = document.getElementById('crafterModExtras');  // Target the div to place content in

    function toggleCraftingModsSection() {
        // Remove the previous crafting mods section if it exists
        const existingCraftingModsSection = document.getElementById('craftingModsSection');
        if (existingCraftingModsSection) {
            crafterModExtras.removeChild(existingCraftingModsSection);
        }

        if (craftingModsEquippedCheckbox.checked) {
            // Create the crafting mods section content
            const craftingModsSection = document.createElement('div');
            craftingModsSection.id = 'craftingModsSection';

            // Cosmic mods selector
            const cosmicModsSelectorLabel = document.createElement('label');
            cosmicModsSelectorLabel.textContent = 'Select the number of cosmic mods equipped: ';
            const cosmicModsSelector = document.createElement('select');
            for (let i = 0; i <= 10; i++) {
                const option = document.createElement('option');
                option.value = i;
                option.textContent = i;
                cosmicModsSelector.appendChild(option);
            }

            // Create a "Crafting mods equipped" label
            const craftingModsEquippedText = document.createElement('div');
            craftingModsEquippedText.textContent = 'Crafting mods equipped :';
            craftingModsSection.appendChild(craftingModsEquippedText);

            // Input fields for Ring, Necklace, and Trinket
            const inputLabels = ['Ring', 'Necklace', 'Trinket'];
            inputLabels.forEach(label => {
                const inputWrapper = document.createElement('div');
                const inputLabel = document.createElement('label');
                inputLabel.textContent = label;
                const input = document.createElement('input');
                input.type = 'number';
                input.step = '0.01'; // Two decimal places
                input.value = '0.00';
                input.classList.add('crafting-input'); // Add a class to apply consistent styling
                inputWrapper.appendChild(inputLabel);
                inputWrapper.appendChild(input);
                craftingModsSection.appendChild(inputWrapper);
            });

            // Append cosmic mods selector and input fields to the section
            craftingModsSection.appendChild(cosmicModsSelectorLabel);
            craftingModsSection.appendChild(cosmicModsSelector);

            // Append the section inside crafterModExtras
            crafterModExtras.appendChild(craftingModsSection);
        }
    }

    craftingModsEquippedCheckbox.addEventListener('change', toggleCraftingModsSection);
    toggleCraftingModsSection(); // Initial check if craftingModsEquipped is already checked
}