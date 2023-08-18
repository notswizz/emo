const emojis = ['💧'];
const gridSize = 10;
let selectedEmoji = null;

const gridContainer = document.getElementById('gridContainer');
const inspectBtn = document.getElementById('inspectBtn');
const buyBtn = document.getElementById('buyBtn');
const selectedTileElement = document.getElementById('selectedTile');

function handleClick(event) {
    const emoji = event.target;

    if (isEmojiInspected(emoji.dataset.id) || isEmojiBought(emoji.dataset.id)) {
        return; // Prevent clicking on inspected or bought emojis
    }

    if (selectedEmoji) {
        selectedEmoji.style.backgroundColor = '';
    }

    selectedEmoji = emoji;
    selectedEmoji.style.backgroundColor = 'orange';
    updateSelectedTileText(selectedEmoji.dataset.id);
}

function updateSelectedTileText(tileId) {
    selectedTileElement.textContent = `${tileId}`;
}

function handleInspect() {
    if (selectedEmoji) {
        selectedEmoji.style.backgroundColor = 'red';
        saveInspectedEmoji(selectedEmoji.dataset.id);
        location.reload(); // Reload the page
    }
}

function handleBuy() {
    if (selectedEmoji) {
        selectedEmoji.style.backgroundColor = 'green';
        saveBoughtEmoji(selectedEmoji.dataset.id);
        location.reload(); // Reload the page
    }
}

function handleKeyDown(event) {
    if (!selectedEmoji) return;

    const currentRow = parseInt(selectedEmoji.dataset.row);
    const currentCol = parseInt(selectedEmoji.dataset.col);

    let newRow = currentRow;
    let newCol = currentCol;

    switch (event.key) {
        case 'w':
            newRow = Math.max(0, currentRow - 1);
            break;
        case 's':
            newRow = Math.min(gridSize - 1, currentRow + 1);
            break;
        case 'a':
            newCol = Math.max(0, currentCol - 1);
            break;
        case 'd':
            newCol = Math.min(gridSize - 1, currentCol + 1);
            break;
        default:
            return;
    }

    const nextEmoji = document.querySelector(`[data-row="${newRow}"][data-col="${newCol}"]`);

    if (nextEmoji && !(isEmojiInspected(nextEmoji.dataset.id) || isEmojiBought(nextEmoji.dataset.id))) {
        selectedEmoji.style.backgroundColor = '';
        selectedEmoji = nextEmoji;
        selectedEmoji.style.backgroundColor = 'orange';
        updateSelectedTileText(selectedEmoji.dataset.id);
    }
}

function saveInspectedEmoji(emojiId) {
    let inspectedEmojis = JSON.parse(localStorage.getItem('inspectedEmojis')) || [];
    if (!inspectedEmojis.includes(emojiId)) {
        inspectedEmojis.push(emojiId);
        localStorage.setItem('inspectedEmojis', JSON.stringify(inspectedEmojis));
    }
}

function saveBoughtEmoji(emojiId) {
    let boughtEmojis = JSON.parse(localStorage.getItem('boughtEmojis')) || [];
    if (!boughtEmojis.includes(emojiId)) {
        boughtEmojis.push(emojiId);
        localStorage.setItem('boughtEmojis', JSON.stringify(boughtEmojis));
    }
}

function isEmojiInspected(emojiId) {
    let inspectedEmojis = JSON.parse(localStorage.getItem('inspectedEmojis')) || [];
    return inspectedEmojis.includes(emojiId);
}

function isEmojiBought(emojiId) {
    let boughtEmojis = JSON.parse(localStorage.getItem('boughtEmojis')) || [];
    return boughtEmojis.includes(emojiId);
}

// Create grid
for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
        const gridItem = document.createElement('div');
        gridItem.classList.add('grid-item');
        gridItem.innerText = emojis[Math.floor(Math.random() * emojis.length)];
        gridItem.dataset.row = i;
        gridItem.dataset.col = j;
        gridItem.dataset.id = `${i}-${j}`;

        // Check if the emoji was inspected or bought and set the background color accordingly
        if (isEmojiInspected(gridItem.dataset.id)) {
            gridItem.style.backgroundColor = 'red';
        } else if (isEmojiBought(gridItem.dataset.id)) {
            gridItem.style.backgroundColor = 'green';
        }

        gridItem.addEventListener('click', handleClick);
        gridContainer.appendChild(gridItem);
    }
}

inspectBtn.addEventListener('click', handleInspect);
buyBtn.addEventListener('click', handleBuy);
window.addEventListener('keydown', handleKeyDown);