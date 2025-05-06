import { generateComparisonForm } from './compareEstimator.js';

export function setupCompareToggle() {
    const compareButton = document.getElementById('compareButton');
    const compareSection = document.getElementById('compareSection');
    const nonEnchantedButton = document.getElementById('nonEnchantedButton');
    const enchantedButton = document.getElementById('enchantedButton');
    const buttonOptions = document.getElementById('buttonOptions');
    const nonEnchantedSection = document.getElementById('nonEnchantedSection');
    const enchantedSection = document.getElementById('enchantedSection');

    if (!compareButton) return;

    compareButton.addEventListener('click', () => {
        compareSection.classList.remove('hidden');
    });

    nonEnchantedButton?.addEventListener('click', () => {
        enchantedSection.innerHTML = '';
        buttonOptions.classList.add('hidden');
        nonEnchantedSection.classList.remove('hidden');
        enchantedSection.classList.add('hidden');
        generateComparisonForm(nonEnchantedSection, false);
    });

    enchantedButton?.addEventListener('click', () => {
        nonEnchantedSection.innerHTML = '';
        buttonOptions.classList.add('hidden');
        enchantedSection.classList.remove('hidden');
        nonEnchantedSection.classList.add('hidden');
        generateComparisonForm(enchantedSection, true);
    });
}

