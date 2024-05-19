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
 * The `init` function sets up a 3D scene with a torus mesh, shaders, textures, and post-processing
 * effects using Three.js.
 * @param {THREE.scene} scene - It looks like you have defined the `scene` parameter as a parameter of the `init`
 * function, but then you are also creating a new `THREE.Scene()` inside the function. This can lead to
 * confusion and potential issues.
 */
function init(scene,camera,renderer) {

    const container = document.getElementById( 'container' );

    clock = new THREE.Clock();

    const textureLoader = new THREE.TextureLoader();
    const cloudTexture = textureLoader.load( '/cloud.png' );
    const lavaTexture = textureLoader.load( '/lavatile.jpg' );

    lavaTexture.colorSpace = THREE.SRGBColorSpace;

    cloudTexture.wrapS = cloudTexture.wrapT = THREE.RepeatWrapping;
    lavaTexture.wrapS = lavaTexture.wrapT = THREE.RepeatWrapping;

    uniforms = {

        'fogDensity': { value: 0.15 },
        'fogColor': { value: new THREE.Vector3( 0, 0, 0 ) },
        'time': { value: 2.0 },
        'uvScale': { value: new THREE.Vector2( 1.0, 1.0 ) },
        'texture1': { value: cloudTexture },
        'texture2': { value: lavaTexture }
    };

    const size = 0.65;

    const material = new THREE.ShaderMaterial( {

        uniforms: uniforms,
        vertexShader: document.getElementById( 'vertexShader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
        side: THREE.DoubleSide

    } );

    //mesh = new THREE.Mesh( new THREE.TorusGeometry( size, 0.3, 30, 30 ), material );
    mesh = new THREE.Mesh( new THREE.PlaneGeometry(4,4), material );
    mesh.rotateX(degreesToRadians(90));
    mesh.position.y = -2;
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

// function onWindowResize() {

//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();

//     renderer.setSize( window.innerWidth, window.innerHeight );
//     composer.setSize( window.innerWidth, window.innerHeight );

// }


function animate() {

    requestAnimationFrame( animate );

    render();

}

function render() {

    const delta = 5 * clock.getDelta();

    uniforms[ 'time' ].value += 0.2 * delta;

    // mesh.rotation.y += 0.0125 * delta;
    // mesh.rotation.x += 0.05 * delta;

    //renderer.clear();
    composer.render( 0.01 );

}