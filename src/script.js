import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bmwakvshdrvwvrtwmyzc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtd2FrdnNoZHJ2d3ZydHdteXpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTIzNzIwMjksImV4cCI6MjAwNzk0ODAyOX0.DrhLWSMvVPkVkl9MWlMewNkDcox6gu4_tWzP6BrC8pA';
const supabase = createClient(supabaseUrl, supabaseKey);

const emojis = ['💧'];
const gridSize = 10;
let selectedEmoji = null;

const gridContainer = document.getElementById('gridContainer');
const inspectBtn = document.getElementById('inspectBtn');
const buyBtn = document.getElementById('buyBtn');
const selectedTileElement = document.getElementById('selectedTile');

async function fetchEmojis() {
  try {
    const { data: emojisData, error } = await supabase
      .from('emojis')
      .select('*');

    if (error) {
      console.error('Error fetching emojis:', error);
      return;
    }

    // Create grid based on fetched emoji data
    createGrid(emojisData);
  } catch (error) {
    console.error('Error fetching emojis:', error);
  }
}

function createGrid(emojisData) {
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const emojiData = emojisData.find(data => data.row === i && data.col === j);
      const gridItem = document.createElement('div');
      gridItem.classList.add('grid-item');
      gridItem.innerText = emojiData ? emojiData.emoji : emojis[Math.floor(Math.random() * emojis.length)];
      gridItem.dataset.row = i;
      gridItem.dataset.col = j;
      gridItem.dataset.id = emojiData ? emojiData.id : `${i}-${j}`;

      // Check if the emoji was inspected or bought and set the background color accordingly
      if (emojiData && emojiData.inspected) {
        gridItem.style.backgroundColor = 'red';
      } else if (emojiData && emojiData.bought) {
        gridItem.style.backgroundColor = 'green';
      }

      gridItem.addEventListener('click', handleClick);
      gridContainer.appendChild(gridItem);
    }
  }
}

async function updateEmojiState(emojiId, newState) {
  try {
    await supabase
      .from('emojis')
      .update({ [newState]: true })
      .eq('id', emojiId);
  } catch (error) {
    console.error('Error updating emoji state:', error);
  }
}

function handleClick(event) {
  const emoji = event.target;

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

inspectBtn.addEventListener('click', async () => {
  if (selectedEmoji) {
    selectedEmoji.style.backgroundColor = 'red';
    await updateEmojiState(selectedEmoji.dataset.id, 'inspected');
  }
});

buyBtn.addEventListener('click', async () => {
  if (selectedEmoji) {
    selectedEmoji.style.backgroundColor = 'green';
    await updateEmojiState(selectedEmoji.dataset.id, 'bought');
  }
});

window.addEventListener('keydown', handleKeyDown);

// Fetch emojis when the page loads
fetchEmojis();
