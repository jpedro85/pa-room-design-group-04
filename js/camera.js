import * as THREE from 'three';
import { getAxisVectors, getPressedKeys } from './utils';

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
    const far = 100;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 10;
    camera.lookAt( new THREE.Vector3(-2,-2,0) );
    return camera;
}

/**
 * Gets the camera object
 * @returns {THREE.PerspectiveCamera} The Perspective camera
 */
export function getCamera() {
    return camera;
}


/**
 * Gets the camera's direction vectors (Up, Right, and Forward).
 * @returns {Object} An object containing the Up, Right, and Forward vectors.
 */
export function getCameraVectors() {
    if (!camera) {
        throw new Error('Camera has not been initialized.');
    }

    const position = getCameraPosition();
    let target = new THREE.Vector3(0,0,0);
    camera.getWorldDirection(target)

    const targetPosition = position.clone().add( target );
    const { vectorX, vectorY, vectorZ } =  getAxisVectors();

    const forward = targetPosition.clone().sub(position).normalize();
    const right = new THREE.Vector3().crossVectors(forward, vectorY).normalize(); 
    const up = new THREE.Vector3().crossVectors(right, forward).normalize(); 
8  
    return { up, right, forward };
}

/**
 * The function `cameraUpdateDirection` updates the camera's direction based on mouse movement within a
 * canvas element.
 * @param event - The `event` parameter in the `cameraUpdateDirection` function is typically an event
 * object that represents an event that occurs in the browser, such as a mouse movement event. This
 * parameter is used to track the user's interaction with the camera controls.
 * @param canvas - The `canvas` parameter in the `cameraUpdateDirection` function is typically a
 * reference to the HTML `<canvas>` element on which the camera is rendering. It is used to get the
 * mouse position relative to the canvas for camera movement calculations.
 */
export function cameraUpdateDirection(event,canvas)
{
    if (camera) {
       
        const MousePosition = getMousePosition(event,canvas);

        const { up, right, forward } = getCameraVectors();
        const position = getCameraPosition();

        const newTargetForwardPosition = position.add( forward.clone().multiplyScalar(10) );
        const newTargetRightPosition = newTargetForwardPosition.add( right.clone().multiplyScalar( MousePosition.x * 0.01) );
        const newTargetFinalPosition = newTargetRightPosition.add( up.clone().multiplyScalar( MousePosition.y * 0.01) );

        camera.lookAt(newTargetFinalPosition);
    }
}

/**
 * The function `getMousePosition` calculates the relative position of the mouse within a canvas
 * element.
 * @param canvas - The `canvas` parameter in the `getMousePosition` function is the HTML canvas element
 * on which you want to track the mouse position. The function calculates the mouse position relative
 * to the center of the canvas and returns an object with `x` and `y` coordinates.
 * @returns The function `getMousePosition` returns an object with the x and y coordinates of the mouse
 * position relative to the center of the canvas.
 */
function getMousePosition(event,canvas)
{
    const MousePosition =
    {
        x : event.movementX,
        y : -event.movementY
    };
    return MousePosition;
}

/**
 * The function `getCameraPosition` returns a `THREE.Vector3` object representing the position of the
 * camera in a 3D scene.
 * @returns A new `THREE.Vector3` object with the x, y, and z coordinates of the camera's position.
 */
function getCameraPosition()
{
   return new THREE.Vector3(camera.position.x,camera.position.y,camera.position.z);
}

/**
 * The function `enterCanvas` sets up an event listener for mouse movement on a canvas element and
 * requests pointer lock for the canvas.
 * @param event - The `event` parameter is typically an object that represents an event that has
 * occurred, such as a mouse click, key press, or other user interaction with the webpage. In this
 * case, it is being used to handle mouse movement events within a canvas element.
 * @param canvas - The `canvas` parameter is a reference to the HTML canvas element on which the event
 * listener and pointer lock request will be applied.
 */
export async function enterCanvas(event,canvas)
{
    document.getElementById("PressEsc").style="display: block;";
    document.getElementById("ClickToEnter").style="display: none;";
    canvas.onmousemove = (event) => { cameraUpdateDirection(event,canvas) };
    await canvas.requestPointerLock({  unadjustedMovement: true,});
} 

/**
 * The function `exitCanvas` checks if the pointer is locked to a specific canvas element and removes
 * an event listener for mouse movement if it is not.
 * @param event - The `event` parameter typically represents the event that triggered the function,
 * such as a mouse click or key press. In this case, it seems like the `exitCanvas` function is
 * designed to handle exiting a canvas element, possibly related to pointer lock functionality.
 * @param canvas - The `canvas` parameter in the `exitCanvas` function is a reference to the HTML
 * canvas element that you want to check for pointer lock when exiting.
 */
export function exitCanvas(event,canvas)
{
    if ( document.pointerLockElement !== canvas) 
    {
        document.exitPointerLock();
        canvas.removeEventListener('mousemove', cameraUpdateDirection, false);
        canvas.onmousemove = null
        document.getElementById("PressEsc").style="display: none;";
        document.getElementById("ClickToEnter").style="display: block;";
    }
} 