import { removeRotationAnimation, addRotationAnimation, applyChanges, handleLightTypeOptionChange } from './appearance.js';
import { applyAppearance } from './geometry.js';
import { movementHandler } from './movement.js';
import { colorFlagHandler, removeElement } from './utils.js';
import { addLight } from './light.js';
import { enterCanvas, exitCanvas } from './camera.js'
import { addKey, removeKey } from './utils.js';

/**
 * Sets up event listeners for the application's UI elements.
 * Binds click events to buttons for adding and removing geometrical objects and lights,
 * scaling elements, and keydown events for moving elements.
 *
 * @param {THREE.Scene} scene - The scene to interact with.
 */
export function setupEventListeners(scene, canvas) {
    document.getElementById('colorFlag').addEventListener('change', () => colorFlagHandler());
    document.getElementById('lightTypeOption').addEventListener('change', () => handleLightTypeOptionChange());
    document.getElementById('addPrimitive').addEventListener('click', () => applyAppearance(scene));
    document.getElementById('applyChanges').addEventListener('click', () => applyChanges());
    document.getElementById('removeElement').addEventListener('click', () => removeElement(scene));
    document.getElementById('addLight').addEventListener('click', () => addLight(scene));
    document.getElementById('addAnimation').addEventListener('click', () => addRotationAnimation())
    document.getElementById('removeAnimation').addEventListener('click', () => removeRotationAnimation())

    document.addEventListener('keydown', (event) => { addKey(event); movementHandler(event) });
    document.addEventListener('keyup', removeKey);

    document.addEventListener("pointerlockchange", (event) => exitCanvas(event, canvas))
    canvas.addEventListener('click', (event) => { enterCanvas(event, canvas); });
}
