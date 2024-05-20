import { getSelectedElementIndex , getPressedKeys } from './utils.js';
import { getObjects } from './shapes.js';
import { getCamera, getCameraVectors } from './camera.js';


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
    w: { axis: 'forward', direction: 1 },
    W: { axis: 'forward', direction: 1 },
    s: { axis: 'forward', direction: -1 },
    S: { axis: 'forward', direction: -1 },
    a: { axis: 'right', direction: -1 },
    A: { axis: 'right', direction: -1 },
    d: { axis: 'right', direction: 1 },
    D: { axis: 'right', direction: 1 },
    q: { axis: 'up', direction: 1 },
    Q: { axis: 'up', direction: 1 },
    r: { axis: 'up', direction: -1 },
    R: { axis: 'up', direction: -1 }
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

    for(let key in getPressedKeys())
    {     
        if (moves[key]) {
            moveElement(...moves[key]);
        }
        else if (cameraMoves[key]) {
            moveCamera(key);
        }
    } 
}

/**
 * Moves the camera based on the key pressed.
 * @param {string} key - The key pressed.
 */
export function moveCamera(key) {
    const move = cameraMoves[key];
    const camera = getCamera();
    const { up, right, forward } = getCameraVectors();
    const cameraRelativeDirections = { "up":up, "right":right, "forward":forward, }
    const vectorDirection = cameraRelativeDirections[move.axis];
    if (move) {
        camera.position.add( vectorDirection.multiplyScalar( CAMERA_SPEED * move.direction ) );
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
