import * as THREE from 'three' // On import la librairie Three

// Canvas
const canvas = document.querySelector('canvas.webgl') // si un tag Canvas a la class webgl

// Scene
const scene = new THREE.Scene();

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: '#ff0000' });
const mesh = new THREE.Mesh(geometry, material); // On envoie la gemoetry et le material dans le mesh

scene.add(mesh);

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3

scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})

renderer.setSize(sizes.width, sizes.height)

renderer.render(scene, camera)