import * as THREE from 'three';

const CAMERA_SPEED = 0.1;
export const cameraMoves = {
    w: { axis: 'z', direction: -1 },
    W: { axis: 'z', direction: -1 },
    s: { axis: 'z', direction: 1 },
    S: { axis: 'z', direction: 1 },
    a: { axis: 'x', direction: -1 },
    A: { axis: 'x', direction: -1 },
    d: { axis: 'x', direction: 1 },
    D: { axis: 'x', direction: 1 },
    q: { axis: 'y', direction: 1 },
    Q: { axis: 'y', direction: 1 },
    r: { axis: 'y', direction: -1 },
    R: { axis: 'y', direction: -1 }
};

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
 * Moves the camera based on the key pressed.
 * @param {string} key - The key pressed.
 */
export function moveCamera(key) {
   const move = cameraMoves[key];
    if (move) {
        camera.position[move.axis] += move.direction * CAMERA_SPEED;
    }
}
