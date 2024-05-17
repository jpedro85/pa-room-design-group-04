import { addCube, addPyramid, addLight, removeElement, scaleElement, handleKeyDown } from './geometry.js';

/**
 * Sets up event listeners for the application's UI elements.
 * Binds click events to buttons for adding and removing geometrical objects and lights,
 * scaling elements, and keydown events for moving elements.
 *
 * @param {THREE.Scene} scene - The scene to interact with.
 */
export function setupEventListeners(scene) {
    document.getElementById('addCube').addEventListener('click', () => addCube(scene));
    document.getElementById('addPyramid').addEventListener('click', () => addPyramid(scene));
    document.getElementById('addLight').addEventListener('click', () => addLight(scene));
    document.getElementById('removeElement').addEventListener('click', () => removeElement(scene));

    document.addEventListener('keydown', handleKeyDown);
}
