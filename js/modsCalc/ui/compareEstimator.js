import { getSelectedMods } from './selectionManager.js';
import { modifiersData } from '../data/modifiersLoader.js';
import { rarityLabels, specialModRules } from '../data/constants.js';
import { getCraftingMultiplier } from '../logic/calculator.js';

export function generateComparisonForm(container, isEnchanted = false) {
    const selected = getSelectedMods();
    if (selected.length === 0) return;

    container.innerHTML = '';
    const title = document.createElement('p');
    title.textContent = "What kind of gear rarity do you use?";
    container.appendChild(title);

    const raritySelect = document.createElement('select');
    rarityLabels.forEach(label => {
        const opt = document.createElement('option');
        opt.value = label;
        opt.textContent = label;
        raritySelect.appendChild(opt);
    });
    container.appendChild(raritySelect);

    let enchantmentTitle, enchantmentSelect;
    if (isEnchanted) {
        enchantmentTitle = document.createElement('p');
        enchantmentTitle.textContent = 'Declare the enchantment tier of the gear to compare';
        container.appendChild(enchantmentTitle);

        enchantmentSelect = document.createElement('select');
        ['T2', 'T3', 'T4', 'T5'].forEach(tier => {
            const opt = document.createElement('option');
            opt.value = tier;
            opt.textContent = tier;
            enchantmentSelect.appendChild(opt);
        });
        container.appendChild(enchantmentSelect);
    }

    selected.forEach((mod, index) => {
        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.alignItems = 'center';
        wrapper.style.marginBottom = '10px';

        const label = document.createElement('label');
        label.textContent = mod;
        label.style.marginRight = '10px';

        const input = document.createElement('input');
        input.type = 'number';
        input.placeholder = 'Your value';
        input.dataset.mod = mod;
        input.classList.add('mod-input');

        wrapper.appendChild(label);
        wrapper.appendChild(input);
        container.appendChild(wrapper);
    });

    const estimateBtn = document.createElement('button');
    estimateBtn.textContent = 'Estimate';
    estimateBtn.classList.add('pixel-button');
    estimateBtn.disabled = true;
    estimateBtn.style.marginTop = '1rem';
    estimateBtn.style.marginBottom = '1rem';
    container.appendChild(estimateBtn);

    const inputs = container.querySelectorAll('.mod-input');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            const atLeastOneFilled = Array.from(inputs).some(inp => inp.value.trim() !== '');
            estimateBtn.disabled = !atLeastOneFilled;
        });
    });

    const resultContainer = document.createElement('div');
    resultContainer.classList.add('compare-results');
    container.appendChild(resultContainer);

    estimateBtn.addEventListener('click', () => {
        resultContainer.innerHTML = '';
        const selectedRarity = raritySelect.value;
        const rarityIndex = rarityLabels.indexOf(selectedRarity);
        const rarityMultiplier = 1 + (rarityIndex * 0.4);

        const tierReduction = isEnchanted ? {
            T2: 0.10,
            T3: 0.15,
            T4: 0.20,
            T5: 0.25
        }[enchantmentSelect.value] || 0 : 0;

        const craftingMultiplier = getCraftingMultiplier();

        selected.forEach(modPrefix => {
            const modData = modifiersData.modifiers.find(mod => mod.prefix === modPrefix);
            if (!modData) return;

            const input = container.querySelector(`input[data-mod="${modPrefix}"]`);
            const userValue = parseFloat(input.value);
            if (isNaN(userValue)) return;

            const rule = specialModRules[modPrefix] || {};
            const baseMax = modData.rarity[9];

            let maxCrafted;

            if (rule.overrideMultipliers && typeof rule.apply === "function") {
                const fixed = rule.apply();
                maxCrafted = fixed.max;
            } else {
                maxCrafted = rule.skipCraftingMultiplier ? baseMax : baseMax * craftingMultiplier;
                maxCrafted *= rarityMultiplier;

                if (rule.cap) {
                    maxCrafted = Math.min(maxCrafted, rule.cap);
                }
            }

            const adjustedInput = userValue * (1 - tierReduction);
            const percentage = Math.min(100, (adjustedInput / maxCrafted) * 100);
            const percentageText = percentage.toFixed(2);

            let color = 'white';
            if (percentage <= 25) color = '#e74c3c';
            else if (percentage <= 50) color = '#e67e22';
            else if (percentage <= 74) color = '#f1c40f';
            else if (percentage <= 89) color = '#2ecc71';
            else color = '#27ae60';

            const p = document.createElement('p');
            p.innerHTML = `
                <strong style="font-family: Arial;">${modPrefix}:</strong>
                <span style="color: ${color}; font-family: Arial;">
                    ${percentageText}% of max
                    (${adjustedInput.toFixed(2)} vs ${maxCrafted.toFixed(2)})
                </span>`;
            resultContainer.appendChild(p);

            if (adjustedInput > maxCrafted) {
                const warning = document.createElement('p');
                warning.style.color = '#ff4d4d';
                warning.style.fontWeight = 'bold';
                warning.style.marginTop = '8px';
                warning.style.marginBottom = '10px';
                warning.style.fontFamily = 'Arial';
                warning.textContent = `⚠ Your value (${adjustedInput.toFixed(2)}) exceeds the expected max (${maxCrafted.toFixed(2)})!`;
                resultContainer.appendChild(warning);
            }
        });
    });
}