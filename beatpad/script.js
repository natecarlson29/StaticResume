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


function createSoundButtons() {
    const container = document.getElementById('button-container');
    container.innerHTML = '';
    activeSounds.forEach((sound, index) => {
        const button = document.createElement('button');
        button.classList.add('pushable');

        const span = document.createElement('span');
        span.classList.add('front');
        span.textContent = sound.split('/').pop(); // Display filename only

        button.appendChild(span);
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

function playSound(sound) {
    const audio = new Audio(sound);
    audio.play();
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
