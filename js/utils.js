import * as THREE from "three";
import { getObjects } from "./shapes.js";
import { Vector3 } from 'three';

let ColorFlag = false;

/**
 * Updates the ColorFlag value depending on the state of the checkBox colorFlag
 */
export function colorFlagHandler() {
    ColorFlag = !ColorFlag;
}

/**
 * Gets the Value of the ColorFlag
 *
 * @returns {boolean} ColorFlag - Value of the ColorFlag
 */
export function getColorFlag() {
    return ColorFlag;
}

/**
 * Updates the element list in the select dropdown with the given objects.
 * Clears the existing options and populates the dropdown with the current objects.
 *
 * @param {import("./shapes.js").SceneObject[]} objects - The array of objects to list in the dropdown.
 */
export function updateElementList(objects) {
    const select = document.getElementById('selectElement');

    select.innerHTML = '<option value="" disabled selected>Select Element</option>';

    objects.forEach((_, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = _.name ?? `Element ${index}`;
        select.appendChild(option);
    });
}

/**
 * Gets the index of the currently selected element from the dropdown.
 *
 * @returns {number} The selected index, adjusted to be zero-based. Returns -1 if no element is selected.
 */
export function getSelectedElementIndex() {
    const select = document.getElementById('selectElement');
    return select.selectedIndex - 1;
}

/**
 * Gets the object name from the input
 *
 * @returns {string} The input string, if there is no input doesn't return anything
 */
export function getObjectNameFromInput() {
    const input = document.getElementById("obj-name");
    if (input.value) {
        const value = input.value;
        input.value = "";
        return value;
    }
}

/**
 * Removes a specified object from the scene
 */
export function removeElement(scene) {
    const objects = getObjects();
    const selectedIndex = getSelectedElementIndex();
    if (selectedIndex >= 0) {
        scene.remove(objects[selectedIndex].element);
        objects.splice(selectedIndex, 1);
        updateElementList(objects);
    }
}

/**
 * Converts a File object to a data URL.
 * @param {File} file - The file to convert.
 * @returns {Promise<string>} - A promise that resolves to the data URL.
 */
export function fileToDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

/**
 * Converts a value in degrees to radians.
 *
 * @param   {number}  degrees Angle in degrees.
 * @return  {number} Angle in radians.
 */
export function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
}

/**
 * Resets all the input from Change Objects properties section to the default values.
 */
export function resetChangeObjectProperties() {
    document.getElementById("editRotationX").value = 0;
    document.getElementById("editRotationY").value = 0;
    document.getElementById("editRotationZ").value = 0;
    document.getElementById("scale").value = 1;
}

/**
 * Resets all the input from the add Object section in UI to the default values.
 */
export function resetInitialObjectProperties() {
    document.getElementById("width").value = 1;
    document.getElementById("depth").value = 1;
    document.getElementById("height").value = 1;

    document.getElementById("InitialRotationX").value = 0;
    document.getElementById("InitialRotationY").value = 0;
    document.getElementById("InitialRotationZ").value = 0;

    document.getElementById("InitialPositionX").value = 0;
    document.getElementById("InitialPositionY").value = 0;
    document.getElementById("InitialPositionZ").value = 0;

    document.getElementById("modelInput").value = "";
    document.getElementById("initialTexture").value = "";
}

/**
 * Scales the model to fit within the canvas having an aspect ratio of 1.5/modelSize.
 * @param {THREE.Mesh} model - The model to scale.
 */
export function scaleModelToFitCanvas(model) {
    const box = new THREE.Box3().setFromObject(model);
    const size = new THREE.Vector3();
    box.getSize(size);

    const maxDim = Math.max(size.x, size.y, size.z);
    const scaleFactor = 1.5 / maxDim;

    model.scale.set(scaleFactor, scaleFactor, scaleFactor);
}

const vectorY = new Vector3(0,1,0).normalize();
const vectorX = new Vector3(1,0,0).normalize();
const vectorZ = new Vector3(0,0,1).normalize();

/**
 * The function getAxisVectors() returns three axis vectors: vectorX, vectorY, and vectorZ.
 * @returns The function `getAxisVectors()` is returning three variables: `vectorX`, `vectorY`, and
 * `vectorZ`.
 */
export function getAxisVectors()
{
    return { vectorX, vectorY, vectorZ };
}

let keysPressed = {};

/**
 * The function `clearPressedKeys` clears the `keysPressed` object in JavaScript.
 */
export function clearPressedKeys()
{
    keysPressed = {};
}

/**
 * The function `addKey` adds the pressed key to the `keysPressed` object.
 * @param event - The `event` parameter is an object that contains information about the event that
 * occurred, such as a key press event in this case.
 */
export function addKey(event) 
{
    keysPressed[event.key] = true;
}

/**
 * The function `addKey` adds the pressed key to the `keysPressed` object.
 * @param event - The `event` parameter is an object that contains information about the event that
 * occurred, such as a key press event in this case.
 */
export function removeKey(event) 
{
    delete keysPressed[event.key];
}

/**
 * The function `getPressedKeys` returns the keys that are currently pressed.
 * @returns The function `getPressedKeys` is returning the value of the variable `keysPressed`.
 */
export function getPressedKeys()
{
    return keysPressed;
}


/**
 * Creates an error message based on a starting string and a dictionary of keys.
 * 
 * @param {string} startsWith The starting string of the error message.
 * @param {Object.<string, any>} dictionary The dictionary of keys.
 * @returns {string} The error message.
 */
export function createErrorWithDictionaryKey(startsWith,dictionary)
{
    let error = startsWith
    for (let key in dictionary) 
    {
        if (dictionary.hasOwnProperty(key)) 
        {
            error += " " + key +",";
        }
    }

    return error.substring( 0 , error.length - 1); 
}

/**
 * Scales a box3 by a factor.
 *
 * @param   {THREE.Box3} box  The box to scale.
 * @param   {[type]}  factor  The factor of scale.
 *
 */
export function box3Scale(box,factor)
{
    box.min.multiplyScalar(factor);
    box.max.multiplyScalar(factor);
}

/**
 * Translates the box by the given x,y,z values. 
 *
 * @param   {THREE.Box3} box The box to translate.
 * @param   {number} x  The x units to translate.
 * @param   {number} y  The y units to translate.
 * @param   {number} z  The z units to translate.
 *
 */
export function box3Translate(box,x,y,z)
{
    // const vectorTranslateX = new Vector3(0,0,0).add(new Vector3(x,0,0));
    // const vectorTranslateXY = vectorTranslateX.add(new THREE.Vector3(0,y,0));
    // const vectorTranslateXYZ = vectorTranslateX.add(new THREE.Vector3(0,0,z));

    box.min.x += x;
    box.max.y += y;
    box.min.z += z;

    box.max.x += x;
    box.min.y += y;
    box.max.z += z;
}

/**
 * The function `showIntersectionError` checks if there are intersected planes and displays an error
 * message if so.
 * @param intersectedPlanes This dictionary contain the intersection planes or empty.
 * 
 * @return {string} error, empty if no error.
 */
export function hasIntersection( intersectedPlanes )
{
    if( Object.keys(intersectedPlanes).length != 0 )
    {   
        let error = createErrorWithDictionaryKey( 
                    "The transformation can not be applied because it causes intersection with:" ,
                    intersectedPlanes
                )

        return error;
    }
    return "";
}