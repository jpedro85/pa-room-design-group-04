import * as THREE from 'three';

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
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 4;
    return camera;
}
