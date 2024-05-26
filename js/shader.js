import * as THREE from 'three';

import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { BloomPass } from 'three/addons/postprocessing/BloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { degreesToRadians } from './utils';

let composer, clock;

let uniforms, mesh;

export function shaderObjectExampleStart(scene, camera, renderer)
{
    init(scene,camera,renderer);
    animate();
}


/**
 * The function initializes a scene with textures, shaders, and passes for rendering.
 * @param scene - The `scene`to add the shader.
 * @param camera - The `camera` of the scene.
 * @param renderer - The `renderer`.
 */
function init(scene,camera,renderer) {

    clock = new THREE.Clock();

    const textureLoader = new THREE.TextureLoader();
    const cloudTexture = textureLoader.load( '/cloud.png' );
    const lavaTexture = textureLoader.load( '/lavatile.jpg' );

    lavaTexture.colorSpace = THREE.SRGBColorSpace;

    cloudTexture.wrapS = cloudTexture.wrapT = THREE.RepeatWrapping;
    lavaTexture.wrapS = lavaTexture.wrapT = THREE.RepeatWrapping;

    uniforms = {

        'fogDensity': { value: 0.02 },
        'fogColor': { value: new THREE.Vector3( 0, 0, 0 ) },
        'time': { value: 2.0 },
        'uvScale': { value: new THREE.Vector2( 1.0, 1.0 ) },
        'texture1': { value: cloudTexture },
        'texture2': { value: lavaTexture }
    };

    const material = new THREE.ShaderMaterial( {
        uniforms: uniforms,
        vertexShader: document.getElementById( 'vertexShader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
        side: THREE.DoubleSide

    } );

    mesh = new THREE.Mesh( new THREE.PlaneGeometry(20,20), material );
    mesh.rotateX(degreesToRadians(90));
    mesh.position.y = -10;
    scene.add( mesh );


    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.autoClear = false;


    const renderModel = new RenderPass( scene, camera );
    const effectBloom = new BloomPass( 1.25 );
    const outputPass = new OutputPass();

    composer = new EffectComposer( renderer );

    composer.addPass( renderModel );
    composer.addPass( effectBloom );
    composer.addPass( outputPass );

}

/**
 * The function `animate` uses `requestAnimationFrame` to continuously call the `render` function for
 * smooth animations.
 */
function animate() {

    requestAnimationFrame( animate );

    render();

}

/**
 * The function `render` updates the time value of a shader uniform and renders a scene using a
 * composer with a specified delta value.
 */
function render() {

    const delta = 5 * clock.getDelta();

    uniforms[ 'time' ].value += 0.2 * delta;

    composer.render( 0.01 );
}
