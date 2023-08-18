import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bmwakvshdrvwvrtwmyzc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtd2FrdnNoZHJ2d3ZydHdteXpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTIzNzIwMjksImV4cCI6MjAwNzk0ODAyOX0.DrhLWSMvVPkVkl9MWlMewNkDcox6gu4_tWzP6BrC8pA';
const supabase = createClient(supabaseUrl, supabaseKey);

const emojis = ['💧'];
const gridSize = 10;

async function fetchEmojis() {
    try {
        const { data: emojisData, error } = await supabase
            .from('emojis')
            .select('*');

        if (error) {
            console.error('Error fetching emojis:', error);
            return;
        }

        createGrid(emojisData);
    } catch (error) {
        console.error('Error fetching emojis:', error);
    }
}

function createGrid(emojisData) {
    const gridContainer = document.getElementById('gridContainer');

    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const emojiData = emojisData.find(data => data.row === i && data.col === j);
            const gridItem = document.createElement('div');
            gridItem.classList.add('grid-item');
            gridItem.innerText = emojiData ? emojiData.emoji : emojis[Math.floor(Math.random() * emojis.length)];

            gridContainer.appendChild(gridItem);
        }
    }
}

fetchEmojis();
