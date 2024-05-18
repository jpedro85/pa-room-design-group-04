import { initRenderer, render } from './renderer.js';
import { initScene } from './scene.js';
import { initCamera } from './camera.js';
import { setupEventListeners } from './events.js';
import { addAmbientLight } from './light.js';

/**
 * Initializes the application once the window is loaded.
 * Sets up the renderer, camera, scene, and event listeners, then starts the rendering loop.
 */
window.onload = () => init();

/**
 * Initializes the WebGL application.
 * Retrieves the canvas element, initializes the renderer, camera, and scene,
 * sets up event listeners, and starts the rendering process.
 */
function init() {
    const canvas = document.getElementById('gl-canvas');
    const renderer = initRenderer(canvas);
    const camera = initCamera(canvas);
    const scene = initScene();
    const ambientLight = addAmbientLight(scene,"#ffffff",10);

    setupEventListeners(scene, renderer, camera);

    render(renderer, scene, camera);
}
