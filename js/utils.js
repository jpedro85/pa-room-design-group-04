import { getObjects } from './shapes.js';

/**
 * Updates the element list in the select dropdown with the given objects.
 * Clears the existing options and populates the dropdown with the current objects.
 *
 * @param {Array} objects - The array of objects to list in the dropdown.
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
 * @returns The input string, if there is no input doesn't return anything
 */
export function getObjectNameFromInput() {
    const input = document.getElementById("obj-name");
    if (input.value) {
        const value = input.value;
        input.value = "";
        return value;
    }
}

export function removeElement(scene) {
    const selectedIndex = getSelectedElementIndex();
    if (selectedIndex >= 0) {
        scene.remove(objects[selectedIndex].element);
        objects.splice(selectedIndex, 1);
        updateElementList(objects);
    }
}

export function scaleElement(factor) {
    const selectedIndex = getSelectedElementIndex();
    const objects = getObjects();
    if (selectedIndex >= 0) {
        objects[selectedIndex].element.scale.multiplyScalar(factor);
    }
}

/**
 * Converts a value in degrees to radians.
 *
 * @param   {[type]}  degrees Angle in degrees.
 * @return  {[type]} Angle in radians.
 */
export function degreesToRadians( degrees )
{
    return degrees * Math.PI / 180;
}

/**
 * Resets all the input from the change Object partition in UI to the default values.
 *
 * @return  {void} 
 */
export function resetChangeObjectProperties()
{
    document.getElementById("editRotationX").value = 0;
    document.getElementById("editRotationY").value = 0;
    document.getElementById("editRotationZ").value = 0;
    document.getElementById("scale").value = 1;
}

/**
 * Resets all the input from the add Object partition in UI to the default values.
 *
 * @return  {void} 
 */
export function resetInitialObjectProperties()
{
    document.getElementById("width").value = 1;
    document.getElementById("depth").value = 1;
    document.getElementById("height").value = 1;

    document.getElementById("InitialRotationX").value = 0;
    document.getElementById("InitialRotationY").value = 0;
    document.getElementById("InitialRotationZ").value = 0;

    document.getElementById("InitialPositionX").value = 0;
    document.getElementById("InitialPositionY").value = 0;
    document.getElementById("InitialPositionZ").value = 0;
}