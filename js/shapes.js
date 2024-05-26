import * as THREE from 'three';
import { getColorFlag, getObjectNameFromInput, hasIntersection, updateElementList } from './utils.js';
import { degreesToRadians } from './utils.js';

const MAX_PRIMITIVES = 10;

/**
 * @typedef {Object} SceneObject
 * @property {THREE.Mesh} element - The mesh element of the object.
 * @property {THREE.box3} box - The box3 of the element, is the minium box needed to keep all the object inside.
 * @property {string} name - The name of the object.
 * @property {boolean} colorFlag - Wether the object allows the texture to have color
 */

/**
 * An array to store the created objects (e.g., cubes).
 * @type {SceneObject[]}
 */
let objects = [];
let primitivesInScene = 0;

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
 *
 * @returns {SceneObject} The resulting sceneObject thats added to the objects List;
 */
export function addCube(scene, sizeProperties, initialRotationProperties, initialPositionProperties) {
    if (primitivesInScene == MAX_PRIMITIVES) {
        alert("Can't add more than 10 primitives to the scene (Squares and Pryramids)!")
        return;
    }

    const name = getObjectNameFromInput();
    const material = new THREE.MeshPhongMaterial({ emissive: "#000000", shininess: 150 });
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

    
    const sceneObject = {
        element: cube,
        box: new THREE.Box3().setFromObject(cube),
        name: name,
        colorFlag: getColorFlag(),
    }

    let error = hasIntersection( getIntersectedPlanes(sceneObject.box) );
    if( error )
    {
        alert(error);
        resetInitialObjectProperties();
        return;
    }
    if ( ! isValidPosition(initialPositionProperties.x,initialPositionProperties.y,initialPositionProperties.z))
    {
        alert("The initial position needs to be inside the room.");
        resetInitialObjectProperties();
        return;
    }
    
    scene.add(cube);
    
    addObjectToList(sceneObject);
    primitivesInScene++;
    return sceneObject;
}

/**
 * The function `isValidPosition` checks if the given coordinates (x, y, z) are within the range of -10
 * to 10.
 * @param x - The `x` parameter represents the position along the x-axis in a 3D coordinate system. The
 * function `isValidPosition` checks if the given position `(x, y, z)` is within the valid range of -10
 * to 10 along all three axes.
 * @param y - It looks like you have provided a function `isValidPosition` that checks if the given
 * coordinates (x, y, z) are within the range of -10 to 10 for each axis.
 * @param z - The function `isValidPosition` checks if a given position in 3D space is valid within the
 * range of -10 to 10 for each coordinate (x, y, z).
 * @returns The function `isValidPosition` returns a boolean value indicating whether the given
 * position (x, y, z) is within the valid range of -10 to 10 for each coordinate axis.
 */
export function isValidPosition(x,y,z)
{
    const validX = -10 <= x && x <= 10;
    const validY = -10 <= y && y <= 10;
    const validZ = -10 <= z && z <= 10;

    return validX && validY && validZ;
}

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
 *
 * @returns {SceneObject} The resulting sceneObject thats added to the objects List;
 */
export function addPyramid(scene, sizeProperties, initialRotationProperties, initialPositionProperties) {
    
    if (primitivesInScene == MAX_PRIMITIVES) {
        alert("Can't add more than 10 primitives to the scene (Squares and Pryramids)!")
        return;
    }

    const radius = sizeProperties.width >= sizeProperties.depth ? sizeProperties.width : sizeProperties.depth;

    const name = getObjectNameFromInput();
    const material = new THREE.MeshPhongMaterial({ emissive: "#000000", shininess: 150 });
    const geometry = new THREE.ConeGeometry(radius, sizeProperties.height, 4);
    const pyramid = new THREE.Mesh(geometry, material);

    pyramid.position.set(
        initialPositionProperties.x,
        initialPositionProperties.y,
        initialPositionProperties.z
    );
    
    pyramid.rotateX(initialRotationProperties.x);
    pyramid.rotateY(initialRotationProperties.y);
    pyramid.rotateZ(initialRotationProperties.z);

    const sceneObject = {
        element: pyramid,
        box: new THREE.Box3().setFromObject(pyramid),
        name: name,
        colorFlag: getColorFlag(),
    }
    
    let error = hasIntersection( getIntersectedPlanes(sceneObject.box) );
    if( error )
    {
        alert(error);
        resetInitialObjectProperties();
        return;
    }
    if ( ! isValidPosition(initialPositionProperties.x,initialPositionProperties.y,initialPositionProperties.z))
    {
        alert("The initial position needs to be inside the room.");
        resetInitialObjectProperties();
        return;
    }
    
    scene.add(pyramid);
    addObjectToList(sceneObject);
    return sceneObject;
}


/**
 * Add the objetElement to objects list that will be shown on the elements selection
 * @param {SceneObject} sceneObject - The object to be added to the List
 */
export function addObjectToList(sceneObject) {
    objects.push(sceneObject);
    updateElementList(objects);
    console.log('Object added:', sceneObject);
}

/**
 * Gets the objects list
 * @returns {SceneObject[]} object - The list of object inside the canvas
 */
export function getObjects() {
    return objects;
}


const planeTop = new THREE.Plane( new THREE.Vector3(0,-1,0) ,10)
const planeBottom = new THREE.Plane( new THREE.Vector3(0,-1,0) ,-10)

const planeLeft = new THREE.Plane( new THREE.Vector3(-1,0,0),-10)
const planeRight = new THREE.Plane( new THREE.Vector3(-1,0,0),10)

const planeFront = new THREE.Plane( new THREE.Vector3(0,0,-1),10)
const planeBack = new THREE.Plane( new THREE.Vector3(0,0,-1),-10)

/**
 * Get All planes.
 * @return {Object}
 * @param {Plane} sizeProperties.planeTop - The top limit plane yy.
 * @param {Plane} sizeProperties.planeBottom - The Bottom limit plane -yy.
 * @param {Plane} sizeProperties.planeLeft - The left limit plane -xx.
 * @param {Plane} sizeProperties.planeRight - The right limit plane xx.
 * @param {Plane} sizeProperties.planeFront - The front limit plane zz.
 * @param {Plane} sizeProperties.planeBack - The back limit plane -zz.
 */
export function getLimitPlanes()
{
    return { planeTop, planeBottom, planeLeft, planeRight, planeFront, planeBack }
}
/**
 * Returns a non empty dictionary if the given box intersects is 
 * 
 * @param   {THREE.box3} box - The box of the object. 
 *
 * @return  {dic} keys can be (top,bottom,back,front,left,right). this dic contains all the planes that the box intersects.
 */
export function getIntersectedPlanes(box)
{
    let dicIntersectedPlanes = {}

    if(box.intersectsPlane(planeTop)) 
        dicIntersectedPlanes["top"] = planeTop;

    if(box.intersectsPlane(planeBottom)) 
        dicIntersectedPlanes["bottom"] = planeBottom;

    if(box.intersectsPlane(planeBack)) 
        dicIntersectedPlanes["back"] = planeBack;

    if(box.intersectsPlane(planeFront)) 
        dicIntersectedPlanes["front"] = planeFront;

    if(box.intersectsPlane(planeLeft)) 
        dicIntersectedPlanes["left"] = planeLeft;

    if(box.intersectsPlane(planeRight)) 
        dicIntersectedPlanes["right"] = planeRight;

    return dicIntersectedPlanes
}

/**
 * [description]
 * @param {THREE.scene} scene - The scene to add the planes
 */
export function addPlanes(scene) 
{
    const material = new THREE.MeshPhongMaterial({ color: 0xffffff, emissive: "#1A1A1A", shininess: 100, side: THREE.DoubleSide });
    const material2 = new THREE.MeshPhongMaterial({ color: 0x800000, emissive: "#1A0000", shininess: 100, side: THREE.DoubleSide });
    const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x000000 }); // Black border

    let planeLeft = createPlane(edgeMaterial, material, 20, 20);
    planeLeft.rotateY(degreesToRadians(90));
    planeLeft.position.set(-10, 0, 0);
    scene.add(planeLeft);

    let planeBack = createPlane(edgeMaterial, material2, 20, 20);
    planeBack.position.set(0, 0, -10);
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
export function createPlane(edgeMaterial, material, height, width) {
    let planeGeometry = new THREE.PlaneGeometry(width, height);
    let planeMesh = new THREE.Mesh(planeGeometry, material);

    let edgesGeometry = new THREE.EdgesGeometry(planeGeometry);
    let border = new THREE.LineSegments(edgesGeometry, edgeMaterial);

    planeMesh.add(border);

    return planeMesh;
}

