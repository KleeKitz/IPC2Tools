import { handleModSelection } from "./selectionManager.js";
import { modifiersData } from "../data/modifiersLoader.js";
import { allowedPrefixes } from "../data/constants.js"
import { selectedMods, updateCalculateButton } from "./selectionManager.js";

export function updateModifiers() {
    const modifiersList = document.getElementById("modifiers-list");
    const displayMode = document.getElementById("displayMode")?.value;
    const selectedButton = document.querySelector(".craft-button.active");
    const selectedGenre = selectedButton ? selectedButton.dataset.genre : "Tool";

    if (!modifiersList) return;

    modifiersList.innerHTML = "";

    if (!modifiersData?.modifiers) {
        console.error("Modifiers data not loaded correctly.");
        return;
    }

    const filteredMods = filterModifiers(modifiersData.modifiers, selectedGenre);

    if (filteredMods.length === 0) {
        const noModsMessage = document.createElement("div");
        noModsMessage.style.fontStyle = "italic";
        noModsMessage.style.color = "#777";
        noModsMessage.style.textAlign = "center";
        noModsMessage.textContent = "No modifiers available.";
        modifiersList.appendChild(noModsMessage);
        return;
    }

    const fragment = document.createDocumentFragment();
    filteredMods.forEach(mod => {
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "checkbox";
        checkbox.value = mod.prefix;
        checkbox.addEventListener("change", handleModSelection);

        const labelElement = document.createElement("label");
        labelElement.appendChild(checkbox);
        labelElement.appendChild(document.createTextNode(` ${getLabelText(mod, displayMode)}`));

        fragment.appendChild(labelElement);
        fragment.appendChild(document.createElement("br"));
    });

    modifiersList.appendChild(fragment);
}

export function selectCraftGenre(button) {
    const allButtons = document.querySelectorAll('.craft-button');
    allButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    selectedMods.length = 0;

    const allCheckboxes = document.querySelectorAll('#modifiers-list input[type="checkbox"]');
    allCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });

    updateCalculateButton();

    updateModifiers();
}

function filterModifiers(modifiers, selectedGenre) {
    const exclusiveToggle = document.getElementById("exclusiveModifiersToggle");
    const isExclusiveEnabled = exclusiveToggle?.checked;

    return modifiers.filter(mod => {
        let specialPrefixes = ["Potent", "Reacher's", "Wizard's", "Crafter's", "Gemcutter", "Rich", "Experience"];

        if (selectedGenre === "Trinkets") {
            specialPrefixes.push("Looter");
        }

        const isSpecial = specialPrefixes.includes(mod.prefix);

        if (["Jewellery", "Trinkets"].includes(selectedGenre)) {
            return isExclusiveEnabled ? isSpecial : true;
        }
        if (["Tool", "Armor"].includes(selectedGenre)) {
            return isExclusiveEnabled ? false : !isSpecial;
        }
        return false;
    });
}

function getLabelText(mod, mode) {
    if (!Array.isArray(mod.rarity)) return `${mod.prefix} (Invalid rarity)`;

    switch (mode) {
        case "stat": return mod.stat;
        case "prefix": return mod.prefix;
        case "suffix": return mod.suffix;
        case "both": return `${mod.prefix} / ${mod.suffix}`;
        default: return mod.stat;
    }
}
