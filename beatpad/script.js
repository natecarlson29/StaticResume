const allSounds = [
    'sounds/closed hat1.mp3',
    'sounds/closed hat2.wav',
    'sounds/bass drum1.wav',
    'sounds/bass drum2.wav',
    'sounds/snare1.wav',
    'sounds/clap1.wav',
    'sounds/lazer1.wav',
    'sounds/kick1.wav'
];

let activeSounds = [...allSounds]; // Initialize activeSounds with allSounds
let pendingDeletions = new Set();
let editMode = false; // Track the edit mode state
let draggedIndex = null; // Track the index of the dragged button

// Dictionary to store preloaded audio buffers
const preloadedAudioBuffers = {};
let audioContext;

// Function to create AudioContext and preload audio files
async function initializeAudio() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();

    for (const sound of allSounds) {
        const response = await fetch(sound);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        preloadedAudioBuffers[sound] = audioBuffer;
    }
}

// Ensure AudioContext is created and resumed on user interaction
document.addEventListener('click', async () => {
    if (!audioContext) {
        await initializeAudio();
    } else if (audioContext.state === 'suspended') {
        await audioContext.resume();
    }
}, { once: true });

function createSoundButtons() {
    const container = document.getElementById('button-container');
    container.innerHTML = '';

    if (activeSounds.length > 16) {
        showNotification("You can only have a maximum of 16 buttons at a time");
        activeSounds = activeSounds.slice(0, 16); // Limit to 16 buttons
    }

    const numButtons = activeSounds.length;
    const numRowsCols = Math.ceil(Math.sqrt(numButtons)); // Calculate the number of rows and columns

    container.style.gridTemplateColumns = `repeat(${numRowsCols}, 1fr)`;
    container.style.gridTemplateRows = `repeat(${numRowsCols}, 1fr)`;

    activeSounds.forEach((sound, index) => {
        const button = document.createElement('div');
        button.classList.add('btn');
        button.textContent = sound.split('/').pop(); // Display filename only

        button.draggable = editMode; // Make the button draggable only in edit mode
        if (editMode) {
            button.ondragstart = (event) => handleDragStart(event, index);
            button.ondragover = (event) => handleDragOver(event, index);
            button.ondrop = (event) => handleDrop(event, index);
        } else {
            button.ondragstart = null;
            button.ondragover = null;
            button.ondrop = null;
        }
        button.onclick = () => playSound(sound); // Add click event to play sound
        container.appendChild(button);
    });
    updateAvailableSounds();
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.textContent = message;
    document.body.appendChild(notification);

    // Force a reflow to ensure the fade-in transition works
    notification.offsetHeight;
    notification.style.opacity = 1;

    setTimeout(() => {
        notification.style.opacity = 0;
        notification.addEventListener('transitionend', () => {
            notification.remove();
        });
    }, 3000); // Display for 3 seconds before fading out
}

function playSound(sound) {
    const audioBuffer = preloadedAudioBuffers[sound];
    if (audioBuffer) {
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.start(0);
    }
}

function handleDragStart(event, index) {
    draggedIndex = index; // Store the index of the dragged button
    event.dataTransfer.setData('text/plain', index); // Pass the index of the dragged button
}

function handleDragOver(event, index) {
    if (editMode) {
        event.preventDefault(); // Allow the drop action only in edit mode
    }
}

function handleDrop(event, index) {
    if (editMode) {
        event.preventDefault();
        const targetId = event.target.id;
        const draggedSound = activeSounds[draggedIndex];

        if (targetId === 'trash') {
            // Remove the sound if dropped in the trash zone
            activeSounds.splice(draggedIndex, 1);
        } else {
            // Reorder the sounds if dropped on another button
            activeSounds.splice(draggedIndex, 1); // Remove the dragged sound
            activeSounds.splice(index, 0, draggedSound); // Insert the dragged sound at the new index
        }
        createSoundButtons(); // Recreate the buttons
    }
}

document.getElementById('edit-switch').addEventListener('change', () => {
    editMode = !editMode; // Toggle edit mode
    createSoundButtons(); // Recreate the buttons with the new edit mode state

    // Toggle the visibility of the #add-sounds div
    const addSoundsDiv = document.getElementById('add-sounds');
    if (editMode) {
        addSoundsDiv.style.display = 'block';
    } else {
        addSoundsDiv.style.display = 'none';
    }
});

function updateAvailableSounds() {
    const list = document.getElementById('all-sounds-list');
    list.innerHTML = '';
    allSounds.forEach((sound) => {
        const listItem = document.createElement('li');
        listItem.textContent = sound.split('/').pop(); // Display filename only
        listItem.onclick = () => addSound(sound);
        list.appendChild(listItem);
    });
}

function addSound(sound) {
    activeSounds.push(sound);
    createSoundButtons();
}

// Remove drag-over class when not dragging
document.getElementById('add-sounds').addEventListener('dragleave', () => {
    document.getElementById('add-sounds').classList.remove('drag-over');
});

// Initialize sound buttons
createSoundButtons();
