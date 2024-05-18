import { getSelectedElementIndex } from './utils.js';
import { getObjects } from './shapes.js';
import { getCamera } from './camera.js';


const CAMERA_SPEED = 0.1;
const moves = {
    'ArrowUp': [0, 0, 0.1],
    'ArrowDown': [0, 0, -0.1],
    'ArrowLeft': [-0.1, 0, 0],
    'ArrowRight': [0.1, 0, 0],
    'PageUp': [0, 0.1, 0],
    'PageDown': [0, -0.1, 0],
};
const cameraMoves = {
    w: { axis: 'z', direction: -1 },
    W: { axis: 'z', direction: -1 },
    s: { axis: 'z', direction: 1 },
    S: { axis: 'z', direction: 1 },
    a: { axis: 'x', direction: -1 },
    A: { axis: 'x', direction: -1 },
    d: { axis: 'x', direction: 1 },
    D: { axis: 'x', direction: 1 },
    q: { axis: 'y', direction: 1 },
    Q: { axis: 'y', direction: 1 },
    r: { axis: 'y', direction: -1 },
    R: { axis: 'y', direction: -1 }
};

let isTyping = false;

/**
 * Moves the selected element by the given x and z offsets.
 * @param {number} x - The x offset to move the element.
 * @param {number} y - The y offset to move the element.
 * @param {number} z - The z offset to move the element.
 */
function moveElement(x, y, z) {
    const selectedIndex = getSelectedElementIndex();
    const objects = getObjects();
    if (selectedIndex >= 0) {
        objects[selectedIndex].element.position.x += x;
        objects[selectedIndex].element.position.y += y;
        objects[selectedIndex].element.position.z += z;
    }
}

/**
 * Handles keydown events to move the selected element or the camera.
 * @param {KeyboardEvent} event - The keydown event.
 */
export function movementHandler(event) {
    // Ignore movement if typing in an input field
    if (isTyping) return;

    if (moves[event.key]) {
        moveElement(...moves[event.key]);
    }
    else if (cameraMoves[event.key]) {
        moveCamera(event.key);
    }
}

/**
 * Moves the camera based on the key pressed.
 * @param {string} key - The key pressed.
 */
export function moveCamera(key) {
    const move = cameraMoves[key];
    const camera = getCamera();
    if (move) {
        camera.position[move.axis] += move.direction * CAMERA_SPEED;
    }
}

document.querySelectorAll('input').forEach(inputElement => {
    inputElement.addEventListener('focus', () => {
        isTyping = true;
    });
    inputElement.addEventListener('blur', () => {
        isTyping = false;
    });
});
