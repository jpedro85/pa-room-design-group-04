import * as THREE from 'three';
import { addCube, addPyramid } from './shapes.js';
import { applyColor, applyModel, applyModelWithTexture, applyTexture } from './appearance.js';
import { degreesToRadians, resetInitialObjectProperties } from './utils.js';

/**
 * Applies the chosen appearance to the selected element in the scene.
 * Adds the selected primitive (cube or pyramid) to the scene and applies color or model appearance.
 *
 * @param {THREE.Scene} scene - The scene to apply the appearance to.
 */
export function applyAppearance(scene) {
    const primitiveOption = document.getElementById('primitive');
    const colorPicker = document.getElementById('colorPicker');
    const modelInput = document.getElementById('modelInput');
    const textureInput = document.getElementById('initialTexture');

    const sizeProperties = {
        width: parseFloat(document.getElementById('width').value),
        height: parseFloat(document.getElementById('height').value),
        depth: parseFloat(document.getElementById('depth').value),
    };

    const initialRotationProperties = {
        x: degreesToRadians(parseFloat(document.getElementById('InitialRotationX').value)),
        y: degreesToRadians(parseFloat(document.getElementById('InitialRotationY').value)),
        z: degreesToRadians(parseFloat(document.getElementById('InitialRotationZ').value))
    };

    const initialPositionProperties = {
        x: parseFloat(document.getElementById('InitialPositionX').value),
        y: parseFloat(document.getElementById('InitialPositionY').value),
        z: parseFloat(document.getElementById('InitialPositionZ').value)
    };

    let objectCreated = false;

    switch (primitiveOption.value) {
        case 'cube':
            addCube(scene, sizeProperties, initialRotationProperties, initialPositionProperties);
            objectCreated = true;
            break;
        case 'pyramid':
            addPyramid(scene, sizeProperties, initialRotationProperties, initialPositionProperties);
            objectCreated = true;
            break;
        default:
            alert('Invalid Primitive chosen');
    }

    if (!objectCreated) {
        alert("No object was created.");
        return;
    }

    // Checks if theres is a model to import and if the user has chosen to apply a texture
    if (modelInput.files.length > 0 && textureInput.files.length > 0) {
        const modelFiles = {
            modelFile: modelInput.files[0],
            textureFile: textureInput.files[0],
        }
        applyModelWithTexture(modelFiles, scene);
        return;
    }
    // Check wether the user chose only to import a model
    else if (modelInput.files.length > 0) {
        applyModel(modelInput.files[0], scene);
        return;
    }

    if (textureInput.files.length > 0) {
        applyTexture(textureInput.files[0])
    } else {
        applyColor(colorPicker.value);
    }

    resetInitialObjectProperties();
}
