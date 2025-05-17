import { dataFromJson } from "../main/resourceLoader.js";
import { returnData } from "../main/resourceLoader.js";
import { attributeTypeDisplay } from '../talentViewer/data/constants.js';
import { attributeTypeColor } from '../talentViewer/data/constants.js';

let characterData = []
let talentsData = []
let talentDict = {}
let realTalentDict = {} /* for the drawable */
let clickables = {}
let calculateTalents = []
let calculateDict = {}

document.addEventListener("DOMContentLoaded", async () => {
    await dataFromJson("characters");
    characterData = returnData
    await dataFromJson("talents");
    talentsData = returnData

    if (characterData.characters.length == 0) {
        console.error("Failed to collect characters from resource.")
        return
    }
    if (talentsData.talents.length == 0) {
        console.error("Failed to collect talents from resource.")
        return
    }

    updateSelectListWithCharacters();
    updateTalentMap();
    drawScene();

    // Add reset and center buttons side by side above the canvas
    const canvas = document.getElementById('myCanvas');
    const btnContainer = document.createElement('div');
    btnContainer.style.display = "flex";
    btnContainer.style.gap = "8px";
    btnContainer.style.marginBottom = "8px";

    const resetBtn = document.createElement('button');
    resetBtn.textContent = "Reset Enabled Talents";
    resetBtn.className = "canvas-util-btn";
    resetBtn.onclick = resetEnabledTalents;

    const centerBtn = document.createElement('button');
    centerBtn.textContent = "Center Canvas";
    centerBtn.className = "canvas-util-btn";
    centerBtn.onclick = centerCanvas;

    btnContainer.appendChild(resetBtn);
    btnContainer.appendChild(centerBtn);

    canvas.parentNode.insertBefore(btnContainer, canvas);

    // Add attribute enable/disable buttons at the bottom of the page
    addAttributeToggleButtons();
})

function updateSelectListWithCharacters() {
    let characterSelect = document.getElementById("characters");

    characterData.characters.forEach(character => {
        /**
         * {
            "town_dweller": {
                "display_name": "Town Dweller",
                "unique_talent": {
                "name": "???",
                "detail": "+1 confusion"
                },
                "active_skill": "None",
                "passive_skills": [
                {
                    "level": 20,
                    "detail": "5% more resources"
                },
                {
                    "level": 40,
                    "detail": "10% more resources"
                }
                ],
                "amber_cost": 0
            }
            }
         */

        let key = Object.keys(character)[0]
        let newOption = document.createElement('option')
        newOption.setAttribute("value", key)
        newOption.textContent = character[key]["display_name"]

        characterSelect.appendChild(newOption)

    });

}



function updateTalentMap() {

    let talents = talentsData.talents
    talentDict = {}

    let elementMap = document.getElementById("talent-map")

    let minY = 0;
    let minX = 0;
    let maxY = 0;
    let maxX = 0;

    let gridMap = {}

    // dynamically figure out bounds for the grid from JSON
    talents.forEach(talent => {
        let talentX = talent["X"];
        let talentY = talent["Y"];
        maxX = Math.max(maxX, talentX);
        maxY = Math.max(maxY, talentY);
        minX = Math.min(minX, talentX);
        minY = Math.min(minY, talentY);

        talentDict[talentY + "," + talentX] = talent
    })

    console.log(maxX, maxY, minX, minY)

    let realY = 0;

    for (let y = maxY; y >= minY; y--) {
        let realX = 0;
        for (let x = minX; x <= maxX; x++) {
            try {
                let isBlank = false;
                let isPC = false;
                let thisTalent = talentDict[y + "," + x]
                let name = thisTalent["Name"]
                let detail = thisTalent["Detail"]

                if (name == "BLANK") {
                    isBlank = true;
                }
                if (name == "PC") {
                    isPC = true;
                }

                let newObject = document.createElement("div")
                newObject.className = "grid-item"
                newObject.id = y + "," + x
                if (isBlank) {
                    newObject.textContent = ``
                    newObject.classList.add("grid-item-blank")
                } else if (isPC) {
                    newObject.textContent = `PC`
                    newObject.classList.add("grid-item-pc")
                } else {
                    newObject.textContent = `${name}`
                    newObject.classList.add("grid-item-content")

                    newObject.onclick = function (event) {
                        clickedTalent(event)
                    }
                }

                //elementMap.appendChild(newObject)


                realTalentDict[realY + "," + realX] = thisTalent

            } catch (e) {
                console.error("Error", e)
            }

            realX++;
        }
        realY++;
    }
}

function clickedTalent(event) {
    let selTalName = document.getElementById("talent-name")
    let selTalDetail = document.getElementById("talent-detail")
    let selTalCost = document.getElementById("talent-cost")

    let id = event.target.id

    selTalName.textContent = talentDict[id]["Name"]
    selTalDetail.textContent = talentDict[id]["Detail"]
    selTalCost.textContent = "Cost: " + talentDict[id]["TP Cost"]
}


const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

let isDragging = false;
let startX, startY;
let offsetX = 0, offsetY = 0;

const squareSize = 50;
const padding = 2.5;
const fontSize = 16;

const cellColor = 'lightgrey'
const hoveredColor = 'white'
const enabledColor = 'lightgreen'
const hoveredEnabledColor = 'green'
const pcColor = 'blue'
const emptyCell = 'black'

canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;

    let talent = clickables[startX, startY]

    if (talent) {
        console.log("Clicked on a talent: ", talent)
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    offsetX += dx;
    offsetY += dy;

    startX = e.clientX;
    startY = e.clientY;

    ctx.setTransform(1, 0, 0, 1, offsetX, offsetY);

    drawScene();
});

canvas.addEventListener('mouseup', () => {
    isDragging = false;
});

let lastHovered = null;

// Create and style the modal for talent info
const talentModal = document.createElement('div');
talentModal.className = 'talent-modal';
document.body.appendChild(talentModal);

canvas.addEventListener('mousemove', (e) => {
    if (isDragging) {
        talentModal.style.display = 'none';
        return;
    }

    const canvasClickX = e.offsetX;
    const canvasClickY = e.offsetY;

    const currentTransform = ctx.getTransform();
    const inverseTransform = currentTransform.inverse();

    const userClickPoint = inverseTransform.transformPoint({
        x: canvasClickX,
        y: canvasClickY
    });

    const userClickX = userClickPoint.x;
    const userClickY = userClickPoint.y;

    const drawSize = squareSize - padding;

    let foundHovered = false;
    let hoveredTalent = null;

    if (clickables) {
        for (const [key, talent] of Object.entries(clickables)) {

            const talentX = talent["localX"];
            const talentY = talent["localY"];

            const squareLeft = talentX;
            const squareTop = talentY;
            const squareRight = squareLeft + drawSize;
            const squareBottom = squareTop + drawSize;

            // Check if the userClickX and userClickY are within this square's bounds
            if (userClickX >= squareLeft && userClickX < squareRight &&
                userClickY >= squareTop && userClickY < squareBottom) {
                if (talent["isHovered"] && talent["isHovered"] == true) {
                    hoveredTalent = talent;
                    foundHovered = true;
                    break;
                }
                //console.log("Is hovering over:", talent);

                if (lastHovered != null && lastHovered == talent) {
                    hoveredTalent = talent;
                    foundHovered = true;
                    break;
                }

                if (talent["Name"] == "BLANK" || talent["Name"] == "PC") {
                    break;
                }

                // do highltighting


                talent["isHovered"] = true
                lastHovered = talent
                hoveredTalent = talent;
                foundHovered = true;
                break;
            } else {
                talent["isHovered"] = false
            }
        }
    }

    // Show modal if hovering a talent
    if (foundHovered && hoveredTalent) {
        talentModal.style.display = 'block';
        talentModal.innerHTML = `
            <strong>${hoveredTalent["Name"] || ""}</strong><br>
            <span>${hoveredTalent["Detail"] || ""}</span><br>
            <span style="color:#666;">Cost: ${hoveredTalent["TP Cost"] || ""}</span>
        `;
        // Position modal near cursor, but not off screen
        let modalWidth = 220;
        let modalHeight = 80;
        let pageX = e.clientX;
        let pageY = e.clientY;
        let x = pageX + 16;
        let y = pageY + 8;
        if (x + modalWidth > window.innerWidth) x = window.innerWidth - modalWidth - 8;
        if (y + modalHeight > window.innerHeight) y = window.innerHeight - modalHeight - 8;
        talentModal.style.left = x + 'px';
        talentModal.style.top = y + 'px';
    } else {
        talentModal.style.display = 'none';
    }

    drawScene()

});

// Utility function to lighten a hex color
function lightenColor(hex, percent) {
    // Remove '#' if present
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) {
        hex = hex.split('').map(x => x + x).join('');
    }
    const num = parseInt(hex, 16);
    let r = (num >> 16) + Math.round((255 - (num >> 16)) * percent);
    let g = ((num >> 8) & 0x00FF) + Math.round((255 - ((num >> 8) & 0x00FF)) * percent);
    let b = (num & 0x0000FF) + Math.round((255 - (num & 0x0000FF)) * percent);
    r = Math.min(255, r);
    g = Math.min(255, g);
    b = Math.min(255, b);
    return `rgb(${r},${g},${b})`;
}

function drawScene() {

    let maxX = 0;
    let maxY = 0;
    let minX = 0;
    let minY = 0;

    let talents = talentsData.talents;

    // dynamically figure out bounds for the grid from JSON
    talents.forEach(talent => {
        let talentX = talent["X"];
        let talentY = talent["Y"];
        maxX = Math.max(maxX, talentX);
        maxY = Math.max(maxY, talentY);
        minX = Math.min(minX, talentX);
        minY = Math.min(minY, talentY);

        talentDict[talentY + "," + talentX] = talent
    })

    let numCols = (maxX * 2) + 1;
    let numRows = (maxY * 2) + 1;

    const drawSize = squareSize - padding;

    for (let y = 0; y < numRows; y++) {
        for (let x = 0; x < numCols; x++) {

            const rectX = x * squareSize + padding / 2;
            const rectY = y * squareSize + padding / 2;

            let talent = realTalentDict[y + "," + x]
            let noFill = false;
            let noText = false;

            ctx.fillStyle = cellColor;

            // Determine base color for attribute type
            let baseColor = cellColor;
            if (talent["Attributes"] && talent["Attributes"][0] && talent["Attributes"][0]["Type"] && attributeTypeColor[talent["Attributes"][0]["Type"]]) {
                baseColor = attributeTypeColor[talent["Attributes"][0]["Type"]];
            }

            if (talent["Name"] == "PC") {
                baseColor = pcColor;
            }

            if (talent["Name"] == "BLANK") {
                noFill = true;
                noText = true;
            }

            // Set fillStyle based on state
            if (talent["Enabled"] == true) {
                ctx.fillStyle = enabledColor;
                baseColor = enabledColor;
            } else {
                ctx.fillStyle = baseColor;
            }

            // If hovered, lighten the base color
            if (talent["isHovered"] == true) {
                ctx.fillStyle = lightenColor(baseColor, 0.4);
            }

            if (!noFill) {
                ctx.fillRect(rectX, rectY, drawSize, drawSize);
            }

            if (!noText) {
                ctx.fillStyle = emptyCell;
                ctx.font = `${fontSize}px 'Pixelify Sans', Arial, sans-serif`;
                ctx.fillText(`${talent["Short Name"]}`, rectX, (rectY + fontSize + 12));
            }

            talent["localX"] = rectX
            talent["localY"] = rectY

            clickables[rectX + "," + rectY] = talent
        }
    }
}

let lastClicked = null;

canvas.addEventListener('click', (e) => {
    const canvasClickX = e.offsetX;
    const canvasClickY = e.offsetY;

    const currentTransform = ctx.getTransform();
    const inverseTransform = currentTransform.inverse();

    const userClickPoint = inverseTransform.transformPoint({
        x: canvasClickX,
        y: canvasClickY
    });

    const userClickX = userClickPoint.x;
    const userClickY = userClickPoint.y;

    console.log(`user clicked at ${userClickX},${userClickY}`)

    const drawSize = squareSize - padding;

    let clickedTalent = null;

    if (clickables) {
        for (const [key, talent] of Object.entries(clickables)) {
            const talentX = talent["localX"];
            const talentY = talent["localY"];

            const squareLeft = talentX;
            const squareTop = talentY;
            const squareRight = squareLeft + drawSize;
            const squareBottom = squareTop + drawSize;

            // Check if the userClickX and userClickY are within this square's bounds
            if (userClickX >= squareLeft && userClickX < squareRight &&
                userClickY >= squareTop && userClickY < squareBottom) {
                clickedTalent = talent;
                console.log("Clicked on cell:", talent);

                if (clickedTalent["Name"] == "BLANK" || clickedTalent["Name"] == "PC") {
                    break;
                }

                let selTalName = document.getElementById("talent-name")
                let selTalDetail = document.getElementById("talent-detail")
                let selTalCost = document.getElementById("talent-cost")
                let selTalEnabled = document.getElementById("talent-enabled")

                selTalName.textContent = clickedTalent["Name"]
                selTalDetail.textContent = clickedTalent["Detail"]
                selTalCost.textContent = "Cost: " + clickedTalent["TP Cost"]

                if (lastClicked == clickedTalent) {
                    let indexOf = calculateTalents.indexOf(lastClicked);
                    if (indexOf == -1) {
                        console.log("added talent to calc")
                        clickedTalent["Enabled"] = true
                        calculateTalents.push(lastClicked)
                    } else {
                        console.log("removed talent from calc")
                        clickedTalent["Enabled"] = false
                        calculateTalents.splice(indexOf, 1);
                    }
                }

                if (clickedTalent["Enabled"] == true) {
                    selTalEnabled.textContent = "Yes"
                } else {
                    selTalEnabled.textContent = "No"
                }

                lastClicked = clickedTalent

                break;
            }
        }
    }

    drawScene()
    calculateTotals()
});

let countedTalents = []

function calculateTotals() {
    /*
    <tr>
        <td>
            Armor
        </td>
        <td>
            +1
        </td>
    </tr>
     */

    let tableBody = document.getElementById("attribute-table-body")
    tableBody.innerHTML = ''

    let attributeTotals = {}
    let attributeIncTypes = {}
    let totalCost = 0;

    if (calculateTalents) {
        for (const [key, talent] of Object.entries(calculateTalents)) {

            let talentId = talent["X"] + "," + talent["Y"]

            let talentAttributeType = talent["Attributes"][0]["Type"]
            let talentAttributeValue = talent["Attributes"][0]["Value"]
            let talentAttributeIncType = talent["Attributes"][0]["Inc Type"]

            if (!attributeTotals[talentAttributeType]) {
                attributeTotals[talentAttributeType] = 0;
            }
            attributeTotals[talentAttributeType] += talentAttributeValue;
            totalCost += talent["TP Cost"]

            if (!attributeIncTypes[talentAttributeType]) {
                attributeIncTypes[talentAttributeType] = talentAttributeIncType;
            }
        }
    }

    for (const [type, total] of Object.entries(attributeTotals)) {
        let attributeRow = document.createElement("tr");
        let attributeNameCell = document.createElement("td");
        let attributeValueCell = document.createElement("td");

        let incType = getIncType(attributeIncTypes[type])

        attributeNameCell.textContent = attributeTypeDisplay[type];
        attributeValueCell.textContent = `${((total > 0 ? '+' : '') + total)}${incType}`;

        attributeRow.appendChild(attributeNameCell);
        attributeRow.appendChild(attributeValueCell);

        tableBody.appendChild(attributeRow);
    }

    let totalRow = document.createElement("tr")
    let totalName = document.createElement("th")
    let totalValue = document.createElement("td")
    totalRow.appendChild(totalName)
    totalRow.appendChild(totalValue)

    totalName.textContent = "Total Cost"
    totalValue.textContent = totalCost

    tableBody.appendChild(totalRow);


}

function getIncType(type) {
    if (type == "Percent") {
        return "%"
    } else {
        return ""
    }
}

function resetEnabledTalents() {
    // Reset enabled state for all talents
    for (const key in realTalentDict) {
        if (realTalentDict[key]) {
            realTalentDict[key]["Enabled"] = false;
            realTalentDict[key]["isHovered"] = false;
        }
    }
    for (const key in clickables) {
        if (clickables[key]) {
            clickables[key]["Enabled"] = false;
            clickables[key]["isHovered"] = false;
        }
    }
    calculateTalents.length = 0;
    lastClicked = null;
    lastHovered = null;
    drawScene();
    calculateTotals();
}

function centerCanvas() {
    ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform and clear any translation
    offsetX = 0;
    offsetY = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    drawScene();
}

function addAttributeToggleButtons() {
    const attributeKeys = Object.keys(attributeTypeDisplay);
    const bottomBtnContainer = document.createElement('div');
    bottomBtnContainer.style.display = "flex";
    bottomBtnContainer.style.gap = "8px";
    bottomBtnContainer.style.marginTop = "24px";
    bottomBtnContainer.style.justifyContent = "center";
    bottomBtnContainer.style.flexWrap = "wrap";

    attributeKeys.forEach(attrKey => {
        const btn = document.createElement('button');
        btn.textContent = attributeTypeDisplay[attrKey];
        btn.style.background = attributeTypeColor[attrKey] || "#eee";
        btn.style.color = "#222";
        btn.style.border = "1px solid #888";
        btn.style.padding = "6px 12px";
        btn.style.cursor = "pointer";
        btn.className = "attribute-toggle-btn";
        btn.onclick = () => toggleAttribute(attrKey);

        // Highlight talents on canvas when hovering the button
        btn.onmouseenter = () => highlightAttributeOnCanvas(attrKey, true);
        btn.onmouseleave = () => highlightAttributeOnCanvas(attrKey, false);

        bottomBtnContainer.appendChild(btn);
    });

    // Insert directly after the canvas
    const canvas = document.getElementById('myCanvas');
    canvas.parentNode.insertBefore(bottomBtnContainer, canvas.nextSibling);
}

function highlightAttributeOnCanvas(attrKey, highlight) {
    for (const key in realTalentDict) {
        const talent = realTalentDict[key];
        if (
            talent &&
            talent.Attributes &&
            talent.Attributes[0] &&
            talent.Attributes[0].Type === attrKey
        ) {
            talent.isHovered = highlight;
        }
    }
    drawScene();
}

function toggleAttribute(attrKey) {
    // Toggle all talents with this attribute type ON if any are off, otherwise turn all OFF
    let allEnabled = true;
    for (const key in realTalentDict) {
        const talent = realTalentDict[key];
        if (
            talent &&
            talent.Attributes &&
            talent.Attributes[0] &&
            talent.Attributes[0].Type === attrKey
        ) {
            if (!talent.Enabled) {
                allEnabled = false;
                break;
            }
        }
    }
    // If all are enabled, disable all; otherwise, enable all
    for (const key in realTalentDict) {
        const talent = realTalentDict[key];
        if (
            talent &&
            talent.Attributes &&
            talent.Attributes[0] &&
            talent.Attributes[0].Type === attrKey
        ) {
            if (allEnabled) {
                // Disable
                talent.Enabled = false;
                const idx = calculateTalents.indexOf(talent);
                if (idx !== -1) calculateTalents.splice(idx, 1);
            } else {
                // Enable
                if (!talent.Enabled) {
                    talent.Enabled = true;
                    if (!calculateTalents.includes(talent)) {
                        calculateTalents.push(talent);
                    }
                }
            }
        }
    }
    drawScene();
    calculateTotals();
}