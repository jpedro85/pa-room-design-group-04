import * as THREE from 'three';

let camera;

/**
 * Initializes and returns a new THREE.PerspectiveCamera object.
 *
 * @param {HTMLCanvasElement} canvas - The canvas element to derive the aspect ratio from.
 * @returns {THREE.PerspectiveCamera} The initialized perspective camera.
 */
export function initCamera(canvas) {
    const fov = 75;
    const aspect = canvas.width / canvas.height;
    const near = 0.1;
    const far = 5;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 4;
    return camera;
}

/**
 * Gets the camera object
 * @returns {THREE.PerspectiveCamera} The Perspective camera
 */
export function getCamera() {
    return camera;
}
