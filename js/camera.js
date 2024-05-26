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
 * @param event - The `keydown` event. 
 * @param canvas - The `canvas` where the camera is being draw.
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
 * The function `getMousePosition` calculates the relative movement of the mouse within a canvas
 * element.
 * @param canvas - The `canvas` .
 * @returns The function `getMousePosition` returns an object with the x and y coordinates of the mouse
 * relative movement.
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
 * @param canvas - The `canvas` parameter is a reference to the HTML canvas element on which the event
 * listener and pointer lock request will be applied.
 */
export async function enterCanvas(canvas)
{
    try {

        document.getElementById("PressEsc").style="display: block;";
        document.getElementById("ClickToEnter").style="display: none;";
        canvas.onmousemove = (event) => { cameraUpdateDirection(event,canvas) };
        await canvas.requestPointerLock({  unadjustedMovement: true,});

    } catch (error) {
        exitCanvas(canvas,true)
        console.log("Trying to lock mouse pointer. try again.")
    }
} 


/**
 * The function `exitCanvas` checks if the pointer is locked to a canvas element and exits pointer lock
 * if specified or if the pointer is not locked to the canvas.
 * @param canvas - The `canvas` parameter is a reference to the HTML canvas element that is being used
 * for pointer lock functionality in the code snippet.
 * @param [exit=false] - The `exit` parameter in the `exitCanvas` function is a boolean parameter with
 * a default value of `false`. This parameter is used to determine whether the function should override the canvas has pointer 
 * and exit the canvas or not.
 */
export function exitCanvas(canvas,exit=false)
{
    if ( document.pointerLockElement !== canvas || exit===true) 
    {
        canvas.onmousemove = null
        document.getElementById("PressEsc").style="display: none;";
        document.getElementById("ClickToEnter").style="display: block;";
        document.exitPointerLock();
    }
} 