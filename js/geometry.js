import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { updateElementList, getSelectedElementIndex, getObjectNameFromInput } from './utils.js';
import { moveCamera, cameraMoves } from './camera.js';

const allowedTextureTypes = ['image/jpeg', 'image/png'];
const allowedModelTypes = {
    'application/x-tgif': OBJLoader,
    'model/obj': OBJLoader,
    'text/plain': OBJLoader,
};
// Keybinds for the element movement
// Key - [x,y,z]
const moves = {
    'ArrowUp': [0, 0, 0.1],
    'ArrowDown': [0, 0, -0.1],
    'ArrowLeft': [-0.1, 0, 0],
    'ArrowRight': [0.1, 0, 0],
    'PageUp': [0, 0.1, 0],
    'PageDown': [0, -0.1, 0],
};

let objects = [];


/**
 * Adds a cube to the scene with the specified size properties.
 * @param {THREE.Scene} scene - The scene to add the cube to.
 * @param {Object} sizeProperties - The size properties for the cube.
 * @param {number} sizeProperties.width - The width of the cube.
 * @param {number} sizeProperties.height - The height of the cube.
 * @param {number} sizeProperties.depth - The depth of the cube.
 */
function addCube(scene, sizeProperties) {
    const name = getObjectNameFromInput();
    const material = new THREE.MeshBasicMaterial();
    const geometry = new THREE.BoxGeometry(sizeProperties.width, sizeProperties.height, sizeProperties.depth);
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    const objectElement = {
        element: cube,
        name: name,
    }
    objects.push(objectElement);
    updateElementList(objects);
    console.log("Cube added:", objectElement);
}

/**
 * Adds a pyramid to the scene with the specified size properties.
 * @param {THREE.Scene} scene - The scene to add the pyramid to.
 * @param {Object} sizeProperties - The size properties for the pyramid.
 * @param {number} sizeProperties.width - The width of the pyramid.
 * @param {number} sizeProperties.height - The height of the pyramid.
 * @param {number} sizeProperties.depth - The depth of the pyramid.
 */
function addPyramid(scene, sizeProperties) {
    const name = getObjectNameFromInput();
    const material = new THREE.MeshBasicMaterial();
    const geometry = new THREE.ConeGeometry(0.5, 1, 4);
    const pyramid = new THREE.Mesh(geometry, material);
    scene.add(pyramid);

    const objectElement = {
        element: pyramid,
        name: name,
    }
    objects.push(objectElement);
    updateElementList(objects);
    console.log("Pyramid added:", objectElement);
}

/**
 * Applies the color to the last object added.
 * @param {string} color - The color to apply.
 */
function applyColor(color) {
    if (!color) return;
    if (objects.length === 0) return;
    const lastObject = objects[objects.length - 1].element;
    lastObject.material.color.set(color);
    console.log("Color applied:", color, "to object:", lastObject);
}

/**
 * Applies the model to the last object added.
 * @param {File} modelFile - The model file to apply.
 */
function applyModel(modelFile, scene) {
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
    }

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
    const selectedIndex = getSelectedElementIndex();
    if (selectedIndex >= 0) {
        scene.remove(objects[selectedIndex].element);
        objects.splice(selectedIndex, 1);
        updateElementList(objects);
    }
}

export function applyTexture() {
    const fileInput = document.getElementById('textureInput');
    const file = fileInput.files[0];

    const selectedElementIndex = getSelectedElementIndex();
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
 * Moves the selected element by the given x and z offsets.
 * @param {number} x - The x offset to move the element.
 * @param {number} y - The y offset to move the element.
 * @param {number} z - The z offset to move the element.
 */
function moveElement(x, y, z) {
    const selectedIndex = getSelectedElementIndex();
    if (selectedIndex >= 0) {
        objects[selectedIndex].element.position.x += x;
        objects[selectedIndex].element.position.y += y;
        objects[selectedIndex].element.position.z += z;
    }
}


/**
 * Handles keydown events to move the selected element or the camera.
 * @param {KeyboardEvent} event - The keydown event.
 */
export function movementHandler(event) {
    if (moves[event.key]) {
        moveElement(...moves[event.key]);
    }
    else if (cameraMoves[event.key]) {
        moveCamera(event.key);
    }
}


/**
 * Scales the selected element by the given factor.
 * @param {number} factor - The scaling factor.
 */
export function scaleElement(factor) {
    const selectedIndex = getSelectedElementIndex();
    if (selectedIndex >= 0) {
        objects[selectedIndex].element.scale.multiplyScalar(factor);
    }
}
