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


export function addLight(scene) {
    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(5, 5, 5);
    scene.add(light);
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
    if (selectedIndex >= 0) {
        objects[selectedIndex].element.scale.multiplyScalar(factor);
    }
}
