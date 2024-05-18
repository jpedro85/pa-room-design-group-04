import { applyChanges, handleAppearanceOptionChange } from './appearance.js';
import { applyAppearance } from './geometry.js';
import { movementHandler } from './movement.js';
import { addLight, removeElement } from './utils.js';

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
    document.getElementById('applyChanges').addEventListener('click', () => applyChanges());
    document.getElementById('removeElement').addEventListener('click', () => removeElement(scene));
    document.getElementById('addLight').addEventListener('click', () => addLight(scene));

    document.addEventListener('keydown', (event) => movementHandler(event));

}
