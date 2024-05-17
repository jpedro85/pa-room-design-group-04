window.onload = () => init();
import * as THREE from "three"

const angle = 0.02;

const AxisEnum = {
    xAxis: 0,
    yAxis: 1,
    zAxis: 2,
};

document.getElementById('addCube').addEventListener('click', addCube);
document.getElementById('addPyramid').addEventListener('click', addPyramid);
document.getElementById('addLight').addEventListener('click', addLight);
document.getElementById('removeElement').addEventListener('click', removeElement);

document.getElementById('moveUp').addEventListener('click', () => moveElement(0, 0.1, 0));
document.getElementById('moveDown').addEventListener('click', () => moveElement(0, -0.1, 0));
document.getElementById('moveLeft').addEventListener('click', () => moveElement(-0.1, 0, 0));
document.getElementById('moveRight').addEventListener('click', () => moveElement(0.1, 0, 0));
document.getElementById('scaleUp').addEventListener('click', () => scaleElement(1.1));
document.getElementById('scaleDown').addEventListener('click', () => scaleElement(0.9));

let axis = AxisEnum.xAxis;

let canvas, renderer, cube, scene, camera;

function init() {

    canvas = document.getElementById('gl-canvas');

    renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setClearColor(0xffffff);

    scene = new THREE.Scene();

    makeCube();

    const fov = 75;
    const near = 0.1;
    const far = 5;
    const aspect = canvas.width / canvas.height;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far); // mimics the way the human eye sees
    camera.position.z = 4;

    render();
}

function makeCube() {

    const loader = new THREE.TextureLoader();
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ map: loader.load("texture.png") });
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    cube.rotateX
}

function render() {

    switch (axis) {
        case AxisEnum.xAxis:
            cube.rotateX(angle);
            break;
        case AxisEnum.yAxis:
            cube.rotateY(angle);
            break;
        case AxisEnum.zAxis:
            cube.rotateZ(angle);
            break;
        default:
            return -1
    }

    cube.scale.set(2, 2, 2);
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}
