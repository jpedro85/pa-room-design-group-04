import * as THREE from 'three';
import { getObjectNameFromInput, updateElementList } from './utils.js';
import { degreesToRadians } from './utils.js';

let objects = [];

/**
 * Adds a cube to the scene with the specified size properties.
 * @param {THREE.Scene} scene - The scene to add the cube to.
 * @param {Object} sizeProperties - The size properties for the cube.
 * @param {number} sizeProperties.width - The width of the cube.
 * @param {number} sizeProperties.height - The height of the cube.
 * @param {number} sizeProperties.depth - The depth of the cube.
 * @param {Object} initialRotationProperties - The initial rotation properties for the cube.
 * @param {number} initialRotationProperties.x - The x rotation in radians.
 * @param {number} initialRotationProperties.y - The y rotation in radians.
 * @param {number} initialRotationProperties.z - The z rotation in radians.
 * @param {Object} initialPositionProperties - The initial Position properties for the cube.
 * @param {number} initialPositionProperties.x - The x Position.
 * @param {number} initialPositionProperties.y - The y Position.
 * @param {number} initialPositionProperties.z - The z Position.
 */
export function addCube(scene, sizeProperties, initialRotationProperties, initialPositionProperties ) {
	const name = getObjectNameFromInput();
	//const material = new THREE.MeshBasicMaterial();
	const material = new THREE.MeshPhongMaterial( { emissive:"#000000", shininess:150 } );
	const geometry = new THREE.BoxGeometry(sizeProperties.width, sizeProperties.height, sizeProperties.depth);
	const cube = new THREE.Mesh(geometry, material);

    cube.position.set(
        initialPositionProperties.x,
        initialPositionProperties.y,
        initialPositionProperties.z
    );
    
    cube.rotateX(initialRotationProperties.x);
    cube.rotateY(initialRotationProperties.y);
    cube.rotateZ(initialRotationProperties.z);

	scene.add(cube);
	addObjectToList(cube, name);
}

// TODO: Check how we can make a rectangular pyramid using the custom size
/**
 * Adds a pyramid to the scene with the specified size properties.
 * @param {THREE.Scene} scene - The scene to add the pyramid to.
 * @param {Object} sizeProperties - The size properties for the pyramid.
 * @param {number} sizeProperties.width - The width of the pyramid.
 * @param {number} sizeProperties.height - The height of the pyramid.
 * @param {number} sizeProperties.depth - The depth of the pyramid.
 * @param {Object} initialRotationProperties - The initial rotation properties for the pyramid.
 * @param {number} initialRotationProperties.x - The x rotation in radians.
 * @param {number} initialRotationProperties.y - The y rotation in radians.
 * @param {number} initialRotationProperties.z - The z rotation in radians.
 * @param {Object} initialPositionProperties - The initial Position properties for the pyramid.
 * @param {number} initialPositionProperties.x - The x Position.
 * @param {number} initialPositionProperties.y - The y Position.
 * @param {number} initialPositionProperties.z - The z Position.
 */
export function addPyramid(scene, sizeProperties , initialRotationProperties, initialPositionProperties ) {
	const radius = sizeProperties.width >= sizeProperties.depth ? sizeProperties.width : sizeProperties.depth;

	const name = getObjectNameFromInput();
	//const material = new THREE.MeshBasicMaterial();
	const material = new THREE.MeshPhongMaterial( { emissive:"#000000", shininess:150 } );
	const geometry = new THREE.ConeGeometry(radius, 1, 4);
	const pyramid = new THREE.Mesh(geometry, material);

    pyramid.position.set(
        initialPositionProperties.x,
        initialPositionProperties.y,
        initialPositionProperties.z
    );

    pyramid.rotateX(initialRotationProperties.x);
    pyramid.rotateY(initialRotationProperties.y);
    pyramid.rotateZ(initialRotationProperties.z);

	scene.add(pyramid);
	addObjectToList(pyramid, name);
}


/**
 * Add the objetElement to objects list that will be shown on the elements selection
 * @param {string} name - The name if exist for the object otherwise will be Elment Index
 * @param {THREE.Mesh} element - The 3D object created by Three.js
 */
function addObjectToList(element, name) {
	const objectElement = { element, name };
	objects.push(objectElement);
	updateElementList(objects);
	console.log('Object added:', objectElement);
}

/**
 * Gets the objects list
 * @returns {Object} object - The list of object inside the canvas
 */
export function getObjects() {
	return objects;
}


/**
 * [description]
 * @param {THREE.scene} scene - The scene to add the planes
 */
export function addPlanes(scene)
{
    //const material = new THREE.MeshBasicMaterial();
	const material = new THREE.MeshPhongMaterial( { color: 0x808080, emissive:"#1A1A1A", shininess:100 , side: THREE.DoubleSide} );
    //const material = new THREE.MeshBasicMaterial( {color: 0x808080, side: THREE.DoubleSide} );
    const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x000000 }); // Black border

    let planeLeft = createPlane(edgeMaterial,material,4,4);
    planeLeft.rotateY(degreesToRadians(90));
    planeLeft.position.set(-2, 0, 0);
    scene.add(planeLeft);

 
    let planeRight = createPlane(edgeMaterial,material,4,4);
    planeRight.rotateX(degreesToRadians(90));
    planeRight.position.set(0, -2, 0);
    scene.add(planeRight);

    let planeBack = createPlane(edgeMaterial,material,4,4);
    planeBack.position.set(0, 0, -2);
    scene.add(planeBack);

}

/**
 * Creates a plane
 *
 * @param   {THREE.material}  edgeMaterial  The material of the edges
 * @param   {THREE.material}  material  The material of the plane.
 * @param   {Number}  height    The height of the plane.
 * @param   {Number}  width     The width of the plane.
 *
 * @return  {THREE.Mesh} The Mesh of the created plane.
 */
export function createPlane( edgeMaterial , material, height, width)
{
    let planeGeometry = new THREE.PlaneGeometry( width, height );
    let planeMesh = new THREE.Mesh(planeGeometry, material);

    let edgesGeometry = new THREE.EdgesGeometry(planeGeometry);
    let border = new THREE.LineSegments(edgesGeometry, edgeMaterial);

    planeMesh.add(border);

    return planeMesh;
}
