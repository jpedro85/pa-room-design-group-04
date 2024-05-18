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
    const positionX = parseFloat(document.getElementById('lightPositionX').value);
    const positionY = parseFloat(document.getElementById('lightPositionY').value);
    const positionZ = parseFloat(document.getElementById('lightPositionZ').value);

    const vectorDirectionX = parseFloat(document.getElementById('lightDirectionX').value);
    const vectorDirectionY = parseFloat(document.getElementById('lightDirectionY').value);
    const vectorDirectionZ = parseFloat(document.getElementById('lightDirectionZ').value);
    
    console.log(lightColor.value,positionX,positionY,positionZ);
    console.log(vectorDirectionX,vectorDirectionY,vectorDirectionZ);

    const light = new THREE.DirectionalLight( lightColor.value , 1);
    light.position.set(positionX, positionX, positionX);

    light.target.position.set(
       /* positionX + */ vectorDirectionX,
        /*positionY +*/  vectorDirectionY,
       /* positionZ +*/  vectorDirectionZ,
    );
    scene.add(light);
    scene.add( light.target );
}