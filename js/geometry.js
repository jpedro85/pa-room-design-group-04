import * as THREE from 'three';
import { addCube, addPyramid } from './shapes.js';
import { applyColor, applyModel } from './appearance.js';

/**
 * Applies the chosen appearance to the selected element in the scene.
 * Adds the selected primitive (cube or pyramid) to the scene and applies color or model appearance.
 *
 * @param {THREE.Scene} scene - The scene to apply the appearance to.
 */
export function applyAppearance(scene) {
    const primitiveOption = document.getElementById('primitive');
    const appearanceOptions = document.getElementById('appearanceOptions');
    const colorPicker = document.getElementById('colorPicker');
    const modelInput = document.getElementById('modelInput');

    const sizeProperties = {
        width: parseFloat(document.getElementById('width').value),
        height: parseFloat(document.getElementById('height').value),
        depth: parseFloat(document.getElementById('depth').value),
    };

    let objectCreated = false;

    switch (primitiveOption.value) {
        case 'cube':
            addCube(scene, sizeProperties);
            objectCreated = true;
            break;
        case 'pyramid':
            addPyramid(scene, sizeProperties);
            objectCreated = true;
            break;
        default:
            alert('Invalid Primitive chosen');
    }

    if (!objectCreated) {
        alert("No object was created.");
        return;
    }

    switch (appearanceOptions.value) {
        case 'color':
            applyColor(colorPicker.value);
            break;
        case 'model':
            if (modelInput.files.length > 0) {
                applyModel(modelInput.files[0], scene);
            } else {
                alert('No model file selected.');
            }
            break;
    }
}

