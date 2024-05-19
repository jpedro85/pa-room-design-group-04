import * as THREE from 'three';

/**
 *  Creates an ambient light with the color
 *
 * @param {THREE.Scene} scene - The scene to add the light.
 * @param {THREE.color} color - The color of the light.
 * @param {Number} color - The intensity of the light.
 * 
 * @returns {THREE.AmbientLight} The created light.
 */
export function addAmbientLight( scene, color, intensity )
{
    const ambientLight = new THREE.AmbientLight( color , intensity);
    scene.add(ambientLight);
    return ambientLight;
}

/**
 * Adds a directional light with the chosen color, position and direction;
 *
 * @param {THREE.Scene} scene - The scene to apply the appearance to.
 */
export function addLight(scene) {

    const lightColor = document.getElementById('lightColor');

    const position = new THREE.Vector3(
        parseFloat(document.getElementById('lightPositionX').value),
        parseFloat(document.getElementById('lightPositionY').value),
        parseFloat(document.getElementById('lightPositionZ').value)
    )

    const LightType = document.getElementById('lightTypeOption').value;
    switch(LightType){
        case "Directional":
            addDirectionLight(scene,position,lightColor.value);
            break;
        case "Point":
            addPointLight(scene, position, lightColor.value);
            break;
        default:
            alert("Invalid Light type");
    }
}

/**
 * Adds a Direction Light to the scene with the color at the specified position.
 *
 * @param   {THREE.scene}  scene - The scene to add the light.
 * @param   {THREE.Vector3}  position - The position of the light.
 * @param   {THREE.color}  color - The Color of the light.
 *
 * @return  {void}
 */
function addDirectionLight(scene, position, color)
{
    const vectorDirectionX = parseFloat(document.getElementById('lightDirectionX').value);
    const vectorDirectionY = parseFloat(document.getElementById('lightDirectionY').value);
    const vectorDirectionZ = parseFloat(document.getElementById('lightDirectionZ').value);
    
    const light = new THREE.DirectionalLight( color, 4);

    light.position.set(position.x, position.y, position.z);
    light.target.position.set(
    /* position.x + */ vectorDirectionX,
        /*position.y +*/  vectorDirectionY,
    /* position.z +*/  vectorDirectionZ,
    );

    scene.add(light);
    scene.add( light.target );
}

/**
 * Adds a Point Light to the scene with the color at the specified position.
 *
 * @param   {THREE.scene}  scene     The scene to add the light.
 * @param   {THREE.Vector3}  position  The position of the light.
 * @param   {THREE.color}  color     The Color of the light.
 *
 * @return  {void}
 */
function addPointLight(scene, position, color)
{ 
    const light = new THREE.PointLight( color, 4);
    light.position.set(position.x, position.y, position.z);
    scene.add(light);
}