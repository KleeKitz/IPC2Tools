export let selectedMods = [];

export function handleModSelection(event) {
    const checkbox = event.target;

    if (checkbox.checked && selectedMods.includes(checkbox.value)) {
        checkbox.checked = false;
        return;
    }

    if (checkbox.checked) {
        if (selectedMods.length >= 2) {
            checkbox.checked = false;
            return;
        }
        selectedMods.push(checkbox.value);
    } else {
        selectedMods = selectedMods.filter(mod => mod !== checkbox.value);
    }

    updateCalculateButton();
}

export function updateCalculateButton() {
    const calculateButton = document.getElementById("calculateButton");

    if (selectedMods.length >= 1 && selectedMods.length <= 2) {
        calculateButton.style.display = "inline-block";
        calculateButton.disabled = false;
    } else {
        calculateButton.style.display = "none";
        calculateButton.disabled = true;
    }
}

export function getSelectedMods() {
    return selectedMods;
}