import * as THREE from 'three'
import GUI from 'lil-gui'
import gsap from'gsap'

/**
 * Debug
 */
const gui = new GUI()

const parameters = {
    materialColor: '#ffeded'
}

gui
    .addColor(parameters, 'materialColor').name('Color').onChange(() => {

        material.color.set(parameters.materialColor)
        particleMaterial.color.set(parameters.materialColor)
    })

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */

// Texture
const textureLoader = new THREE.TextureLoader()
const gradientTexture = textureLoader.load('textures/gradients/3.jpg')
gradientTexture.magFilter = THREE.NearestFilter // important pour l'effet Cell Shading
const particleTexture = textureLoader.load('/textures/particles/2.png')

// Materials
const material = new THREE.MeshToonMaterial({ 
    color: parameters.materialColor,
    gradientMap: gradientTexture
})

// Meshes
const objectsDistance = 4

const mesh1 = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4, 16, 60),
    material
)

const mesh2 = new THREE.Mesh(
    new THREE.ConeGeometry(1, 2, 32),
    material
)

const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
    material
)

mesh1.position.y = - objectsDistance * 0
mesh2.position.y = - objectsDistance * 1
mesh3.position.y = - objectsDistance * 2

mesh1.position.x = 2
mesh2.position.x = - 2
mesh3.position.x = 2

scene.add(mesh1, mesh2, mesh3)

const sectionMeshes = [mesh1, mesh2, mesh3]

/**
 * Particles
 */
const particlesCount = 300
const positions = new Float32Array(particlesCount * 3)
const colors = new Float32Array(particlesCount * 3)

for (let i = 0; i < particlesCount; i++) {

    positions[i * 3 + 0] = (Math.random() - 0.5) * 10 // X
    positions[i * 3 + 1] = objectsDistance * 0.4 - Math.random() * objectsDistance * sectionMeshes.length // Y
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10 // Z
    
    // Assign RGB 
    colors[i * 3 + 0] = Math.random()
    colors[i * 3 + 1] = Math.random()
    colors[i * 3 + 2] = Math.random()
}

const particlesGeometry = new THREE.BufferGeometry(1, 32, 32)
particlesGeometry.setAttribute(
    'position', 
    new THREE.BufferAttribute(positions, 3)
)

particlesGeometry.setAttribute(
    'color',
    new THREE.BufferAttribute(colors, 3)
)

// Material
const particlesMaterial = new THREE.PointsMaterial({
    size: 1,
    sizeAttenuation: true,
    color: new THREE.Color('#ff88cc'),
    transparent: true,
    map: particleTexture,
    depthWrite: false, 
    blending: THREE.AdditiveBlending,
    vertexColors: true,
});

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.position.set(1, 1, 0)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Group
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true // empeche de descendre la page en elastique
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Scroll
 */
let scrollY = window.scrollY
let currentSection = 0

window.addEventListener('scroll', () => {
    
    scrollY = window.scrollY

    const newSection = Math.round(scrollY / sizes.height) // chaque section sera arrondie, donc 0, 1, 2...

    if (newSection != currentSection) {

        currentSection = newSection // comme ca, la current section change, ce qui permet de retrigger le if, si on descend plus

        gsap.to(
            sectionMeshes[currentSection].rotation, {
                duration: 1.5,
                ease: 'power1.inOut',
                x: '+= 4',
                y: '+= 3',
                z: '+= 1.5'
            }
        )
    }
})

/**
 * Cursor
 */
const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove', (evt) => {
    
    cursor.x = evt.clientX / sizes.width - 0.5 // permet de mettre la valeur de clientX sur 1. de 0 a 1
    cursor.y = evt.clientY / sizes.height - 0.5
})

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime // est utile pour empecher les bugs sur les ecrans avec differentes frequences
    previousTime = elapsedTime

    // Animate Camera
    camera.position.y = - scrollY / sizes.height * objectsDistance // on doit mettre negatif pour que ca aille dans la bonne direction

    const parallaxX = cursor.x * 0.5
    const parallaxY = - cursor.y * 0.5
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime

    // Animate Meshes
    for (const mesh of sectionMeshes) {

        mesh.rotation.x += deltaTime * 0.2
        mesh.rotation.y += deltaTime * 0.12
    }

    particlesGeometry.attributes.position.needsUpdate = true

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()