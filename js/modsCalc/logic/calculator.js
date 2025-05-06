import { modifiersData } from '../data/modifiersLoader.js';
import { getSelectedMods } from '../ui/selectionManager.js';
import { rarityLabels, craftingBonusCheckboxIds, craftingModsInputIds, specialModRules } from '../data/constants.js';

export function calculateValues() {
    const resultsTable = document.getElementById("resultsTable").getElementsByTagName('tbody')[0];
    resultsTable.innerHTML = "";

    const messageContainer = document.getElementById("specialRulesMessage");
    messageContainer.innerHTML = "";

    const mods = getSelectedMods().map(prefix =>
        modifiersData.modifiers.find(mod => mod.prefix === prefix)
    );

    const craftingMultiplier = getCraftingMultiplier();

    mods.forEach(mod => {
        const row = resultsTable.insertRow();
        const statCell = row.insertCell(0);
        statCell.innerHTML = mod.stat;

        const rule = specialModRules[mod.prefix] || {};

        const minRarityValue = mod.rarity[0];
        const maxRarityValue = mod.rarity[9];

        const minCrafted = rule.skipCraftingMultiplier ? minRarityValue : minRarityValue * craftingMultiplier;
        const maxCrafted = rule.skipCraftingMultiplier ? maxRarityValue : maxRarityValue * craftingMultiplier;

        rarityLabels.forEach((_, idx) => {
            const rarityMultiplier = 1 + (idx * 0.4);

            let minFinal, maxFinal;

            if (rule.overrideMultipliers && typeof rule.apply === "function") {
                const fixed = rule.apply();
                minFinal = fixed.min;
                maxFinal = fixed.max;
            } else {
                minFinal = minCrafted * rarityMultiplier;
                maxFinal = maxCrafted * rarityMultiplier;

                if (rule.cap) {
                    minFinal = Math.min(minFinal, rule.cap);
                    maxFinal = Math.min(maxFinal, rule.cap);
                }
            }

            const cell = row.insertCell(idx + 1);
            cell.innerHTML = `${minFinal.toFixed(2)} (Min)<br>${maxFinal.toFixed(2)} (Max)`;
        });

        if (rule.message) {
            messageContainer.innerHTML += `<p style="color: #ff0000;">${rule.message}</p>`;
        }
    });

    document.getElementById("resultsTableContainer").style.display = "block";
}

export function getCraftingMultiplier() {
    let totalBonus = 0;

    for (const id in craftingBonusCheckboxIds) {
        const checkbox = document.getElementById(id);
        if (checkbox && checkbox.checked) {
            totalBonus += craftingBonusCheckboxIds[id];
        }
    }

    const ringInput = document.getElementById(craftingModsInputIds.ring);
    const necklaceInput = document.getElementById(craftingModsInputIds.necklace);
    const trinketInput = document.getElementById(craftingModsInputIds.trinket);
    const cosmicInput = document.getElementById(craftingModsInputIds.cosmic);

    const ringValue = parseFloat(ringInput?.value || "0");
    const necklaceValue = parseFloat(necklaceInput?.value || "0");
    const trinketValue = parseFloat(trinketInput?.value || "0");
    const cosmicValue = parseInt(cosmicInput?.value || "0");

    const cosmicBonus = cosmicValue * 0.5;

    totalBonus += ringValue + necklaceValue + trinketValue + cosmicBonus;

    return 1 + (totalBonus / 100);
}