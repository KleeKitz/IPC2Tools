// Prefixes that are allowed for specific filters in your modifiers (unused as calculator.js handles it for now)
export const allowedPrefixes = ["Potent", "Reacher's", "Wizard's", "Crafter's", "Gemcutter", "Experience"];

// Labels for different rarity levels to calculate values for modifiers
export const rarityLabels = ["Common", "Uncommon", "Rare", "Epic", "Legendary", "Exalted", "Mythic", "Godly"];

// IDs of checkboxes for various crafting bonuses that affect the crafting multiplier
export const craftingBonusCheckboxIds = {
    smith20: 10,
    smith40: 15,
    craftingHyperBundle: 20,
    eventCrafting: 25,
    glowingCrafting: 25,
    qualitySmithing: 20,
    holySmithing: 35,
    craftingPrestige: 50
};

// IDs of input fields for manual crafting mods bonuses
export const craftingModsInputIds = {
    ring: "craftingModRing",
    necklace: "craftingModNecklace",
    trinket: "craftingModTrinket",
    cosmic: "craftingModCosmic" // special handling (0.5 each)
};

// Calculator special calculation changes
export const specialModRules = {
    "Gemcutter": {
        apply: () => ({ min: 1, max: 1 }),
        message: "Gemcutter modifier value cannot be anything but 1.",
        overrideMultipliers: true
    },
    "Experience": {
        cap: 100,
        message: "Experience modifier value cannot go beyond 100%."
    },
    "Crafter's": {
        skipCraftingMultiplier: true,
        message: "Crafter's modifier doesn't take into account crafting modifiers, only the item rarity."
    }
};
