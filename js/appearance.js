import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { degreesToRadians, getSelectedElementIndex, updateElementList, resetChangeObjectProperties, fileToDataURL, scaleModelToFitCanvas, getObjectNameFromInput } from './utils.js';
import { addObjectToList, getObjects } from './shapes.js';

const MAX_MODELS = 5;

const allowedTextureTypes = ['image/jpeg', 'image/png'];
const allowedModelTypes = {
    'obj': OBJLoader,
};

export const animatedObjects = [];
export const initialStates = new Map();

let modelsInScene = 0;

/**
 * Applies the color to the last object added.
 * @param {string} color - The color to apply.
 * @param {THREE.Mesh} object - The object that going to have the color applied to
 */
export function applyColor(color, object) {
    const objects = getObjects();
    if (!color || objects.length === 0) return;
    object.material.color.set(color);
    console.log("Color applied:", color, "to object:", object);
}

/**
 * Adds the model to the scene
 * @param {File} modelFile - The model file thats going to be imported
 * @param {THREE.Scene} scene - The scene to add the object
 */
export function addModel(modelFile, scene) {
    if (modelsInScene == MAX_MODELS) {
        alert("Can't add more than 5 models to the scene!")
        return;
    }

    const fileNameParts = modelFile.name.split(".");
    const typeFromName = fileNameParts[fileNameParts.length - 1];

    if (!allowedModelTypes[typeFromName]) {
        alert('Invalid file type. Please select a valid model file (OBJ).');
        return;
    }

    const LoaderClass = allowedModelTypes[typeFromName];
    const loader = new LoaderClass();

    const reader = new FileReader();
    reader.onload = (event) => {
        const contents = event.target.result;
        const object = loader.parse(contents);
        addModelToScene(object, scene);
    };
    reader.readAsText(modelFile);
    modelsInScene++;
}

/**
 * Adds the imported model to scene
 * @param {THREE.Mesh} model - The model to replace the last object with.
 * @param {THREE.Scene} scene - The scene to replace the object.
 */
function addModelToScene(model, scene) {

    if (!model.material) {
        const material = new THREE.MeshPhongMaterial({ emissive: "#000000", shininess: 150 });
        model.material = material;
    }

    scaleModelToFitCanvas(model);

    scene.add(model);

    const sceneObject = {
        element: model,
        name: getObjectNameFromInput(),
        colorFlag: false,
    }
    addObjectToList(sceneObject)
    console.log("Model applied:", model);
}

/**
 * Adds Object with Texture to the scene
 * @param {Object} modelFiles - The model file to apply.
 * @param {File} modelFiles.modelFile - The model file thats being imported.
 * @param {File} modelFiles.textureFile - The texture file thats going to be applied to the model.
 * @param {THREE.Scene} scene - The scene to add the object
 */
export async function addModelWithTexture(modelFiles, scene) {
    if (modelsInScene == MAX_MODELS) {
        alert("Can't add more than 5 models to the scene!")
        return;
    }

    const { modelFile, textureFile } = modelFiles;
    const fileNameParts = modelFile.name.split(".");
    const typeFromName = fileNameParts[fileNameParts.length - 1];

    if (!allowedModelTypes[typeFromName]) {
        alert('Invalid file type. Please select a valid model file (OBJ).');
        return;
    }

    const LoaderClass = allowedModelTypes[typeFromName];
    const loader = new LoaderClass();

    const reader = new FileReader();
    reader.onload = (event) => {
        const contents = event.target.result;
        const object = loader.parse(contents);
        addModelWithTextureToScene(object, textureFile, scene);
    };
    reader.readAsText(modelFile);
    modelsInScene++;
}

/**
 * Replaces the last SceneObject element in the scene with the given model.
 * @param {THREE.Mesh} model - The model to replace the last object with.
 * @param {File} texture - The texture to be applied on the object
 * @param {THREE.Scene} scene - The scene to replace the object.
 */
function addModelWithTextureToScene(model, texture, scene) {

    model.traverse(async (child) => {
        if (child.isMesh) {
            const textureURL = await fileToDataURL(texture);
            const loadedTexture = new THREE.TextureLoader().load(textureURL, () => {
                child.material.map = loadedTexture;
                child.material.needsUpdate = true;
            });
        }
    });

    scaleModelToFitCanvas(model);

    scene.add(model);

    const sceneObject = {
        element: model,
        name: getObjectNameFromInput(),
        // Doesn't work on the models
        colorFlag: false,
    }
    addObjectToList(sceneObject)
    console.log("Model ", model.name, " applied with Texture:", model);
}

/**
 * Applies the texture to the selected object.
 * @param {File} file - The texture file to apply.
 * @param {number} selectedElementIndex - The index of the selected element.
 */
export function applyTexture(file, selectedElementIndex) {
    const objects = getObjects();

    if (!allowedTextureTypes.includes(file.type)) {
        alert('Invalid file type. Please select an image file (jpeg, png, gif).');
        return;
    }

    const selectedObject = objects[selectedElementIndex].element;
    const colorFlag = objects[selectedElementIndex].colorFlag;

    selectedObject.traverse(async (child) => {
        if (child.isMesh) {
            const textureURL = await fileToDataURL(file);
            const loadedTexture = new THREE.TextureLoader().load(textureURL, () => {
                if (!colorFlag)
                    child.material.color = null;
                child.material.map = loadedTexture;
                child.material.needsUpdate = true;
            });
        }
    });
}

/**
 * Applies the texture to the desired object.
 * @param {File} file - The texture file to apply.
 * @param {import('./shapes.js').SceneObject} sceneObject - The sceneObject thats going to have the texture applied to
 *
 * @note This function is only used for the primitives initial procedure to add to the scene
 */
export function applyTextureToElement(file, sceneObject) {
    const { element, colorFlag } = sceneObject;
    if (!allowedTextureTypes.includes(file.type)) {
        alert('Invalid file type. Please select an image file (jpeg, png, gif).');
        return;
    }

    element.traverse(async (child) => {
        if (child.isMesh) {
            const textureURL = await fileToDataURL(file);
            const loadedTexture = new THREE.TextureLoader().load(textureURL, () => {
                if (!colorFlag)
                    child.material.color = null;
                child.material.map = loadedTexture;
                child.material.needsUpdate = true;
            });
        }
    });
}

/**
 * Applies the scale factor to the selected object.
 * @param {number} factor - The scale factor to apply.
 * @param {number} selectedIndex - The index of the selected element.
 */
function applyScale(factor, selectedIndex) {
    const objects = getObjects();
    objects[selectedIndex].element.scale.multiplyScalar(factor);
}

/**
 * Applies the scale factor to the selected object.
 * @param {number} factor - The scale factor to apply.
 * @param {number} selectedIndex - The index of the selected element.
 */
function applyRotation(selectedIndex, rotationDegreesX = 0, rotationDegreesY = 0, rotationDegreesZ = 0) {
    const objects = getObjects();
    const element = objects[selectedIndex].element
    element.rotateX(rotationDegreesX);
    element.rotateY(rotationDegreesY);
    element.rotateZ(rotationDegreesZ);
}

/**
 * Adds the selected object to the animated objects array and starts the rotation animation.
 */
export function addRotationAnimation() {
    const selectedElementIndex = getSelectedElementIndex();
    const objects = getObjects();

    // Check if there's a valid selected element
    if (selectedElementIndex < 0 || selectedElementIndex >= objects.length) {
        alert("Please select a valid object.");
        return;
    }

    const selectedObject = objects[selectedElementIndex].element;

    // Store initial state if not already stored
    if (!initialStates.has(selectedObject)) {
        initialStates.set(selectedObject, {
            position: selectedObject.position.clone(),
            rotation: selectedObject.rotation.clone()
        });
    }

    // Add the selected object to the animated objects array
    if (!animatedObjects.includes(selectedObject)) {
        animatedObjects.push(selectedObject);
    }
}

/**
 * Removes the selected object from the animated objects array.
 */
export function removeRotationAnimation() {
    const selectedElementIndex = getSelectedElementIndex();
    const objects = getObjects();

    // Check if there's a valid selected element
    if (selectedElementIndex < 0 || selectedElementIndex >= objects.length) {
        alert("Please select a valid object.");
        return;
    }

    const selectedObject = objects[selectedElementIndex].element;

    // Remove the selected object from the animated objects array
    const index = animatedObjects.indexOf(selectedObject);
    if (index > -1) {
        animatedObjects.splice(index, 1);
    }

    // Restore initial state
    if (initialStates.has(selectedObject)) {
        const initialState = initialStates.get(selectedObject);
        selectedObject.position.copy(initialState.position);
        selectedObject.rotation.copy(initialState.rotation);
        initialStates.delete(selectedObject);
    }
}

/**
 * Applies the changes to the selected element based on user inputs.
 */
export function applyChanges() {
    const fileInput = document.getElementById('textureInput');
    const file = fileInput.files[0];
    const selectedElementIndex = getSelectedElementIndex();
    const rotationX = parseFloat(document.getElementById("editRotationX").value);
    const rotationY = parseFloat(document.getElementById("editRotationY").value);
    const rotationZ = parseFloat(document.getElementById("editRotationZ").value);


    const scaleInput = document.getElementById("scale");
    const scaleValue = parseFloat(scaleInput.value);

    if (!(selectedElementIndex >= 0)) {
        alert("There is no valid element to apply changes. Please select a valid element.");
        return;
    }

    if (file) {
        applyTexture(file, selectedElementIndex);
    }
    if (scaleValue) {
        applyScale(scaleValue, selectedElementIndex);
    }
    if (rotationX || rotationY || rotationZ) {
        applyRotation(selectedElementIndex,
            degreesToRadians(rotationX),
            degreesToRadians(rotationY),
            degreesToRadians(rotationZ)
        );
    }

    resetChangeObjectProperties();
}

/**
 * Handles the change in appearance options by displaying the appropriate input elements.
 * Shows the color picker if 'color' is selected, otherwise shows the model input.
 */
export function handleLightTypeOptionChange() {
    const appearanceOptions = document.getElementById('lightTypeOption');
    const lightDirection = document.getElementById('lightDirection');
    const lightDirectionLabel = document.getElementById('lightDirectionLabel');

    if (appearanceOptions.value === 'Directional') {
        lightDirection.style.display = 'flex';
        lightDirectionLabel.style.display = 'block';
    } else if (appearanceOptions.value === 'Point') {
        lightDirection.style.display = 'none';
        lightDirectionLabel.style.display = 'none';
    }
}
