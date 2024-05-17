import * as THREE from 'three';
import { updateElementList, getSelectedIndex, getObjectNameFromInput } from './utils.js';

let objects = [];

/**
 * Adds a cube to the scene.
 * @param {THREE.Scene} scene - The scene to add the cube to.
 */
export function addCube(scene) {
    const name = getObjectNameFromInput();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(new THREE.BoxGeometry(), material);
    scene.add(cube);

    const objectElement = {
        element: cube,
        name: name,
    }
    objects.push(objectElement);
    updateElementList(objects);
}

/**
 * Adds a pyramid to the scene.
 * @param {THREE.Scene} scene - The scene to add the pyramid to.
 */
export function addPyramid(scene) {
    const name = getObjectNameFromInput();
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const pyramid = new THREE.Mesh(new THREE.ConeGeometry(0.5, 1, 4), material);
    scene.add(pyramid);

    const objectElement = {
        element: pyramid,
        name: name,
    }
    objects.push(objectElement);
    updateElementList(objects);
}

/**
 * Adds a point light to the scene.
 * @param {THREE.Scene} scene - The scene to add the light to.
 */
export function addLight(scene) {
    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(5, 5, 5);
    scene.add(light);
}

/**
 * Removes the selected element from the scene.
 * @param {THREE.Scene} scene - The scene to remove the element from.
 */
export function removeElement(scene) {
    const selectedIndex = getSelectedIndex();
    if (selectedIndex >= 0) {
        scene.remove(objects[selectedIndex].element);
        objects.splice(selectedIndex, 1);
        updateElementList(objects);
    }
}

/**
 * Moves the selected element by the given x and z offsets.
 * @param {number} x - The x offset to move the element.
 * @param {number} z - The z offset to move the element.
 */
export function moveElement(x, y, z) {
    const selectedIndex = getSelectedIndex();
    if (selectedIndex >= 0) {
        objects[selectedIndex].element.position.x += x;
        objects[selectedIndex].element.position.y += y;
        objects[selectedIndex].element.position.z += z;
    }
}

/**
 * Handles keydown events to move the selected element.
 * Basically our movement handler
 * @param {KeyboardEvent} event - The keydown event.
 */
export function handleKeyDown(event) {
    const moves = {
        'ArrowUp': [0, 0, 0.1],
        'ArrowDown': [0, 0, -0.1],
        'ArrowLeft': [-0.1, 0, 0],
        'ArrowRight': [0.1, 0, 0],
        'PageUp': [0.1, 0, 0],
        'PageDown': [0.1, 0, 0],
    };
    if (moves[event.key]) moveElement(...moves[event.key]);
}

/**
 * Scales the selected element by the given factor.
 * @param {number} factor - The scaling factor.
 */
export function scaleElement(factor) {
    const selectedIndex = getSelectedIndex();
    if (selectedIndex >= 0) {
        objects[selectedIndex].scale.multiplyScalar(factor);
    }
}
