import * as THREE from 'three';
import { addCube, addPyramid } from './shapes.js';
import { applyColor, addModel, addModelWithTexture, applyTextureToElement } from './appearance.js';
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

    // Checks if theres is a model to import and if the user has chosen to apply a texture
    if (modelInput.files.length > 0 && textureInput.files.length > 0) {
        const modelFiles = {
            modelFile: modelInput.files[0],
            textureFile: textureInput.files[0],
        }
        addModelWithTexture(modelFiles, scene);
        resetInitialObjectProperties();
        return;
    }
    // Check wether the user chose only to import a model
    else if (modelInput.files.length > 0) {
        const modelFile = modelInput.files[0];
        addModel(modelFile, scene);
        resetInitialObjectProperties();
        return;
    }

    let sceneObject;
    switch (primitiveOption.value) {
        case 'cube':
            sceneObject = addCube(scene, sizeProperties, initialRotationProperties, initialPositionProperties);
            break;
        case 'pyramid':
            sceneObject = addPyramid(scene, sizeProperties, initialRotationProperties, initialPositionProperties);
            break;
        default:
            alert('Invalid Primitive chosen');
    }

    if (!sceneObject) {
        return;
    }

    // Primitives Texture
    applyColor(colorPicker.value, sceneObject.element);
    if (textureInput.files.length > 0) {
        applyTextureToElement(textureInput.files[0], sceneObject)
    }

    resetInitialObjectProperties();
}
