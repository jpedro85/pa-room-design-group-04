import * as THREE from 'three';

let renderer;

/**
 * Initializes the WebGL renderer with the given canvas.
 * Sets the clear color of the renderer to white.
 *
 * @param {HTMLCanvasElement} canvas - The canvas element to render on.
 * @returns {THREE.WebGLRenderer} The initialized WebGL renderer.
 */
export function initRenderer(canvas) {
    renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setClearColor(0xffffff);
    renderer.setSize(window.innerWidth, window.innerHeight);
    return renderer;
}

/**
 * Starts the rendering loop for the scene using the given renderer and camera.
 * Continuously renders the scene at the browser's refresh rate.
 *
 * @param {THREE.WebGLRenderer} renderer - The WebGL renderer.
 * @param {THREE.Scene} scene - The scene to be rendered.
 * @param {THREE.Camera} camera - The camera to render the scene from.
 */
export function render(renderer, scene, camera) {
    /**
     * The animation loop that renders the scene.
     * Uses `requestAnimationFrame` to call itself continuously.
     */
    function animate() {
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }
    animate();
}
