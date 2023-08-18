// Import the functions you need from the Firebase SDK
import { initializeApp } from "firebase/app";
import { getFirestore, doc, updateDoc, getDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyC8U0HVMHjLxYe4rvJA3o8o7oxKL8PL4z8",
    authDomain: "emoji-e7746.firebaseapp.com",
    projectId: "emoji-e7746",
    storageBucket: "emoji-e7746.appspot.com",
    messagingSenderId: "209213502061",
    appId: "1:209213502061:web:6ad8eab6216dd70ccf4564"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);



const emojis = ['💧'];
const gridSize = 10;
let selectedEmoji = null;

const gridContainer = document.getElementById('gridContainer');
const inspectBtn = document.getElementById('inspectBtn');
const buyBtn = document.getElementById('buyBtn');
const selectedTileElement = document.getElementById('selectedTile');

// Function to update emoji's bought status in Firestore
async function markEmojiAsBought(emojiId) {
    const emojiRef = doc(db, "emojis", emojiId);
    await updateDoc(emojiRef, { bought: true });
}

// Function to update emoji's inspected status in Firestore
async function markEmojiAsInspected(emojiId) {
    const emojiRef = doc(db, "emojis", emojiId);
    await updateDoc(emojiRef, { inspected: true });
}

// Create grid
for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
        const gridItem = document.createElement('div');
        gridItem.classList.add('grid-item');
        gridItem.innerText = emojis[Math.floor(Math.random() * emojis.length)];
        gridItem.dataset.row = i;
        gridItem.dataset.col = j;
        const emojiId = `${i}-${j}`;
        gridItem.dataset.id = emojiId;

        // Check if the emoji was inspected or bought and set the background color accordingly
        const emojiRef = doc(db, "emojis", emojiId);
        const emojiSnapshot = await getDoc(emojiRef);

        if (emojiSnapshot.exists()) {
            const emojiData = emojiSnapshot.data();
            if (emojiData.bought) {
                gridItem.style.backgroundColor = 'green';
            } else if (emojiData.inspected) {
                gridItem.style.backgroundColor = 'red';
            }
        }

        gridItem.addEventListener('click', handleClick);
        gridContainer.appendChild(gridItem);
    }
}
        

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

inspectBtn.addEventListener('click', async () => {
    if (selectedEmoji) {
        selectedEmoji.style.backgroundColor = 'red';
        await markEmojiAsInspected(selectedEmoji.dataset.id);
        location.reload(); // Reload the page
    }
});

buyBtn.addEventListener('click', async () => {
    if (selectedEmoji) {
        selectedEmoji.style.backgroundColor = 'green';
        await markEmojiAsBought(selectedEmoji.dataset.id);
        location.reload(); // Reload the page
    }
});
