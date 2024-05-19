import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { degreesToRadians, getSelectedElementIndex, updateElementList, resetChangeObjectProperties } from './utils.js';
import { getObjects } from './shapes.js';

const allowedTextureTypes = ['image/jpeg', 'image/png'];
const allowedModelTypes = {
    'gltf': GLTFLoader,
    'obj': OBJLoader,
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
 * @param {THREE.Scene} scene - The scene to add the object
 */
export function applyModel(modelFile, scene) {
   
    const fileNameParts = modelFile.name.split(".");
    const typeFromName = fileNameParts[fileNameParts.length-1]; 
    console.log(typeFromName)
    if ( !allowedModelTypes[typeFromName] ) {
        alert('Invalid file type. Please select a valid model file (OBJ).');
        return;
    }

    const LoaderClass = allowedModelTypes[typeFromName];
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
 * @param {THREE.Scene} scene - The scene to replace the object.
 */
function replaceLastObjectWithModel(model, scene) {
    const objects = getObjects();
    if (objects.length === 0) return;

    const lastObject = objects[objects.length - 1].element;
    scene.remove(lastObject);

    if (!model.material) {
        model.material = new THREE.MeshBasicMaterial({ color: "#fff" });
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

    const reader = new FileReader();
    reader.onload = function(event) {
        const texture = new THREE.TextureLoader().load(event.target.result);
        selectedObject.material.map = texture;
        selectedObject.material.needsUpdate = true;
    };

    reader.readAsDataURL(file);
    console.log("Texture applied: ", objects[selectedElementIndex]);
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
function applyRotation( selectedIndex, rotationDegreesX=0, rotationDegreesY=0, rotationDegreesZ=0) {
    const objects = getObjects();
    const element =  objects[selectedIndex].element
    element.rotateX(rotationDegreesX);
    element.rotateY(rotationDegreesY);
    element.rotateZ(rotationDegreesZ);
}


/**
 * Applies the changes to the selected element based on user inputs.
 */
export function applyChanges() {
    const fileInput = document.getElementById('textureInput');
    const file = fileInput.files[0];
    const selectedElementIndex = getSelectedElementIndex();
    const rotationX = parseFloat( document.getElementById("editRotationX").value );
    const rotationY = parseFloat( document.getElementById("editRotationY").value );
    const rotationZ = parseFloat( document.getElementById("editRotationZ").value );


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
       // scaleInput.value = 1;
    }
    if( rotationX || rotationY || rotationZ )
    {
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
