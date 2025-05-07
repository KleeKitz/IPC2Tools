import { calculatePrestigeGain } from './logic/calculator.js';

document.addEventListener('DOMContentLoaded', () => {
    const prestigeInput = document.getElementById('prestigePercentage');
    const output = document.getElementById('prestigeOutput');
    const shortOutput = document.getElementById('prestigeShortOutput');
    const outputHardMode = document.getElementById('prestigeOutputHardMode');
    const shortOutputHardMode = document.getElementById('prestigeShortOutputHardMode');

    // Check if the result elements are available
    if (!output || !shortOutput || !outputHardMode || !shortOutputHardMode) {
        console.error('Result output elements not found.');
        return; // Exit if elements are missing
    }

    const skillFieldIds = [
        'universalSpeed',
        'universalDamage',
        'pickaxeHandling',
        'oreKnowledge',
        'axeHandling',
        'lumberKnowledge',
        'swordHandling',
        'enemyKnowledge'
    ];

    const skillInputs = skillFieldIds.map(id => document.getElementById(id));

    function formatShortNumber(num) {
        const suffixes = [
            "", "thousand", "million", "billion", "trillion",
            "quadrillion", "quintillion", "sextillion", "septillion",
            "octillion", "nonillion", "decillion"
        ];
        if (num === 0) return "0";

        const tier = Math.floor(Math.log10(num) / 3);
        const suffix = suffixes[tier] || `e${tier * 3}`;
        const scale = Math.pow(10, tier * 3);
        const scaled = num / scale;

        return `${scaled.toFixed(2)} ${suffix}`;
    }

    function updateOutput() {
        const prestigePercent = parseFloat(prestigeInput.value);
        if (isNaN(prestigePercent)) {
            output.textContent = '-';
            shortOutput.textContent = '-';
            outputHardMode.textContent = '-';
            shortOutputHardMode.textContent = '-';
            return;
        }

        const levels = skillInputs.map(input => parseInt(input.value) || 0);
        const totalGain = calculatePrestigeGain(prestigePercent, levels);

        // Display results for normal mode
        shortOutput.textContent = `${formatShortNumber(totalGain)} prestige`;
        output.textContent = `${totalGain.toLocaleString()} prestige`;

        // Calculate and display results for hard mode (multiplied by 9)
        const totalGainHardMode = totalGain * 9;
        shortOutputHardMode.textContent = `${formatShortNumber(totalGainHardMode)} prestige`;
        outputHardMode.textContent = `${totalGainHardMode.toLocaleString()} prestige`;
    }

    // Event listeners
    prestigeInput.addEventListener('input', updateOutput);
    skillInputs.forEach(input => input.addEventListener('input', updateOutput));
});