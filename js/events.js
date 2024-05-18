import { addLight, removeElement, applyTexture, movementHandler, applyAppearance } from './geometry.js';
import { handleAppearanceOptionChange } from './utils.js';

/**
 * Sets up event listeners for the application's UI elements.
 * Binds click events to buttons for adding and removing geometrical objects and lights,
 * scaling elements, and keydown events for moving elements.
 *
 * @param {THREE.Scene} scene - The scene to interact with.
 */
export function setupEventListeners(scene) {
    document.getElementById('appearanceOptions').addEventListener('change', () => handleAppearanceOptionChange());
    document.getElementById('addPrimitive').addEventListener('click', () => applyAppearance(scene));
    document.getElementById('applyTexture').addEventListener('click', () => applyTexture());
    document.getElementById('removeElement').addEventListener('click', () => removeElement(scene));
    document.getElementById('addLight').addEventListener('click', () => addLight(scene));

    document.addEventListener('keydown', (event) => movementHandler(event));
}
