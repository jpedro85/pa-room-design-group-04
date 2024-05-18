import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';

let renderer;
let stats;

/**
 * Initializes the WebGL renderer with the given canvas.
 * Sets the clear color of the renderer to white.
 *
 * @param {HTMLCanvasElement} canvas - The canvas element to render on.
 * @returns {THREE.WebGLRenderer} The initialized WebGL renderer.
 */
export function initRenderer(canvas) {

    renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(800,800);
    renderer.setClearColor(0xffffff);
    
    stats = new Stats();
    document.body.appendChild(stats.dom);

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
        stats.update();
        requestAnimationFrame(animate);
    }
    animate();
}
