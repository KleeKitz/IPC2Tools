export function calculatePrestigeGain(prestigePercentage, skillLevels) {
    const multiplier = (prestigePercentage / 100) + 1; 

    const gainForLevel = (level) => {
        const base = Math.pow(1.15478, level - 1) + level - 2;
        return Math.floor(base * 60);
    };

    const totalBaseGain = skillLevels.reduce((sum, lvl) => sum + gainForLevel(lvl), 0);

    return Math.floor(totalBaseGain * multiplier);
}