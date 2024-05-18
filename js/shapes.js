import * as THREE from 'three';
import { getObjectNameFromInput, updateElementList } from './utils.js';

let objects = [];

/**
 * Adds a cube to the scene with the specified size properties.
 * @param {THREE.Scene} scene - The scene to add the cube to.
 * @param {Object} sizeProperties - The size properties for the cube.
 * @param {number} sizeProperties.width - The width of the cube.
 * @param {number} sizeProperties.height - The height of the cube.
 * @param {number} sizeProperties.depth - The depth of the cube.
 */
export function addCube(scene, sizeProperties) {
    const name = getObjectNameFromInput();
    const material = new THREE.MeshBasicMaterial();
    const geometry = new THREE.BoxGeometry(sizeProperties.width, sizeProperties.height, sizeProperties.depth);
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    addObjectToList(cube, name);
}

// TODO: Check how we can make a retangular pyramid using the custom size
/**
 * Adds a pyramid to the scene with the specified size properties.
 * @param {THREE.Scene} scene - The scene to add the pyramid to.
 * @param {Object} sizeProperties - The size properties for the pyramid.
 * @param {number} sizeProperties.width - The width of the pyramid.
 * @param {number} sizeProperties.height - The height of the pyramid.
 * @param {number} sizeProperties.depth - The depth of the pyramid.
 */
export function addPyramid(scene, sizeProperties) {
    const name = getObjectNameFromInput();
    const material = new THREE.MeshBasicMaterial();
    const geometry = new THREE.ConeGeometry(0.5, 1, 4);
    const pyramid = new THREE.Mesh(geometry, material);
    scene.add(pyramid);
    addObjectToList(pyramid, name);
}

/**
 * Add the objetElement to objects list that will be shown on the elements selection
 * @param {string} name - The name if exist for the object otherwise will be Elment Index
 * @param {THREE.Mesh} element - The 3D object created by Three.js
 */
function addObjectToList(element, name) {
    const objectElement = { element, name };
    objects.push(objectElement);
    updateElementList(objects);
    console.log("Object added:", objectElement);
}

/**
 * Gets the objects list
 * @returns {Object} object - The list of object inside the canvas
 */
export function getObjects() {
    return objects;
}
