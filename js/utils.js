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
        option.textContent = `Element ${index + 1}`;
        select.appendChild(option);
    });
}

/**
 * Gets the index of the currently selected element from the dropdown.
 *
 * @returns {number} The selected index, adjusted to be zero-based. Returns -1 if no element is selected.
 */
export function getSelectedIndex() {
    const select = document.getElementById('selectElement');
    return select.selectedIndex - 1;
}
