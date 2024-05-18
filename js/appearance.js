import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { getSelectedElementIndex, updateElementList } from './utils.js';
import { getObjects } from './shapes.js';

const allowedTextureTypes = ['image/jpeg', 'image/png'];
const allowedModelTypes = {
    'application/x-tgif': OBJLoader,
    'model/obj': OBJLoader,
    'text/plain': OBJLoader,
};

/**
 * Applies the color to the last object added.
 * @param {string} color - The color to apply.
 */
export function applyColor(color) {
    const objects = getObjects();
    if (!color || objects.length === 0) return;
    const lastObject = objects[objects.length - 1].element;
    lastObject.material.color.set(color);
    console.log("Color applied:", color, "to object:", lastObject);
}

/**
 * Applies the model to the last object added.
 * @param {File} modelFile - The model file to apply.
 */
export function applyModel(modelFile, scene) {
    const objects = getObjects();
    if (!modelFile || !allowedModelTypes[modelFile.type]) {
        alert('Invalid file type. Please select a valid model file (OBJ, GLTF).');
        return;
    }

    const LoaderClass = allowedModelTypes[modelFile.type];
    const loader = new LoaderClass();

    const reader = new FileReader();
    reader.onload = (event) => {
        const contents = event.target.result;
        const object = loader.parse(contents);
        replaceLastObjectWithModel(object, scene);
        console.log("Model applied:", object);
    };
    reader.readAsText(modelFile);
}

/**
 * Replaces the last object in the scene with the given model.
 * @param {THREE.Object3D} model - The model to replace the last object with.
 * @param {THREE.Scene} scene -
 */
function replaceLastObjectWithModel(model, scene) {
    const objects = getObjects();
    if (objects.length === 0) return;

    const lastObject = objects[objects.length - 1].element;
    scene.remove(lastObject);

    if (!model.material) {
        model.material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    }

    model.name = lastObject.name;

    // NOTE: Maybe have a function that scales the models to fit inside the canvas?
    // const maxDim = Math.max(1, 1, 1);
    // const scaleFactor = 1 / maxDim;
    // model.scale.set(scaleFactor, scaleFactor, scaleFactor);

    scene.add(model);

    objects[objects.length - 1].element = model;
    updateElementList(objects);
    console.log("Model applied:", model);
}

export function applyTexture(fileInput) {
    const file = fileInput.files[0];
    const selectedElementIndex = getSelectedElementIndex();
    const objects = getObjects();

    if (file && selectedElementIndex >= 0) {
        if (!allowedTextureTypes.includes(file.type)) {
            alert('Invalid file type. Please select an image file (jpeg, png, gif).');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(event) {
            const texture = new THREE.TextureLoader().load(event.target.result);
            objects[selectedElementIndex].element.material.map = texture;
            objects[selectedElementIndex].element.material.needsUpdate = true;
        };
        reader.readAsDataURL(file);
    }
}

/**
 * Handles the change in appearance options by displaying the appropriate input elements.
 * Shows the color picker if 'color' is selected, otherwise shows the model input.
 */
export function handleAppearanceOptionChange() {
    const appearanceOptions = document.getElementById('appearanceOptions');
    const colorPicker = document.getElementById('colorPicker');
    const modelInput = document.getElementById('modelInput');

    if (appearanceOptions.value === 'color') {
        colorPicker.style.display = 'block';
        modelInput.style.display = 'none';
    } else if (appearanceOptions.value === 'model') {
        colorPicker.style.display = 'none';
        modelInput.style.display = 'block';
    }
}
