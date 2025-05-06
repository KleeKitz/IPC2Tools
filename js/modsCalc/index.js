import { selectCraftGenre, updateModifiers } from "./ui/uiModifiers.js";
import { loadModifiers } from "./data/modifiersLoader.js";
import { handleModSelection } from "./ui/selectionManager.js";
import { calculateValues } from "./logic/calculator.js";
import { toggleCollapse } from "./ui/toggleCollapse.js";
import { setupCompareToggle } from "./ui/compareToggle.js"
import { setupExclusiveCheckboxHandling, setupCraftingModsEquippedHandling } from './ui/craftingModifersManager.js';

document.addEventListener("DOMContentLoaded", async () => {
    await loadModifiers();
    setupCraftButtons();
    setupDisplayMode();
    setupExclusiveToggle();
    setupCalculateButton();
    setupCollapsibles();
    setupExclusiveCheckboxHandling();
    setupCraftingModsEquippedHandling();
    setupCompareToggle();

    const firstButton = document.querySelector('.craft-button');
    if (firstButton) {
        firstButton.classList.add('active');
        updateModifiers();
    }
});

// Function to handle craft button clicks
function setupCraftButtons() {
    const craftButtons = document.querySelectorAll('.craft-button');
    craftButtons.forEach(button => {
        button.addEventListener('click', () => selectCraftGenre(button));
    });
}

// Function to setup display mode
function setupDisplayMode() {
    const displayModeSelect = document.getElementById('displayMode');
    if (displayModeSelect) {
        displayModeSelect.addEventListener('change', updateModifiers);
    } else {
        console.warn('Display mode select not found.');
    }
}

// Function to setup exclusive toggle
function setupExclusiveToggle() {
    const exclusiveModifiersToggle = document.getElementById('exclusiveModifiersToggle');
    if (exclusiveModifiersToggle) {
        exclusiveModifiersToggle.addEventListener('change', updateModifiers);
    } else {
        console.warn('Exclusive modifiers toggle not found.');
    }
}

// Function to setup calculate button
function setupCalculateButton() {
    const calculateButton = document.getElementById("calculateButton");
    if (calculateButton) {
        calculateButton.addEventListener("click", calculateValues);
    } else {
        console.warn('Calculate button not found.');
    }
}

// Function to setup collapsible headers
function setupCollapsibles() {
    const headers = document.querySelectorAll('.collapsible-header');
    headers.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            if (content && content.classList.contains('collapsible-content')) {
                content.classList.toggle('expanded');
            }
        });
    });
}