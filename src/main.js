import './style.css';
import * as THREE from 'three';
import { FlakesTexture, OrbitControls, RGBELoader } from 'three/examples/jsm/Addons.js';

/* 
  Key Setup Objects for Three.js: 

   - scene contains all elements
   - camera captures what is displayed to the user
   - renderer creates the projected image from the camera
*/

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#bg'), alpha: true, antialias: true }); // Render to the HTML page

//camera adjustments
camera.position.setZ(30);

// Render setup
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Enable shadow maps
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Softer shadows

// For reflective effects
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.25;

// Texture preparation
const moonTexture = new THREE.TextureLoader().load('./src/images/moon_texture.png');
const normalTexture = new THREE.TextureLoader().load('./src/images/normal_texture.png');

let torusTexture = new THREE.CanvasTexture(new FlakesTexture());
torusTexture.wrapS = THREE.RepeatWrapping;
torusTexture.repeat.x = 100;
torusTexture.repeat.y = 60;

const torusMaterial = {
  clearcoat: 1.0,
  clearcoatRoughness: 0,
  metalness: 1,
  roughness: 0.5,
  color: 0xD4AF37,
  normalMap: torusTexture,
  normalScale: new THREE.Vector2(0.15, 0.15),
};

// Add and configure torus geometry
let geometry = new THREE.TorusGeometry(10, 3, 16, 100);
let material = new THREE.MeshPhysicalMaterial(torusMaterial);
let torus = new THREE.Mesh(geometry, material);
torus.castShadow = true; // Enable shadow casting for the torus
scene.add(torus);

// Add and configure moon geometry
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({ map: moonTexture, normalMap: normalTexture })
);
moon.receiveShadow = true; // Enable shadow receiving for the moon
scene.add(moon);

// Add 200 random stars to the space
Array(200).fill().forEach(addStar);

// Lighting effects
const pointLight = new THREE.PointLight(0xffffff, 300);
pointLight.position.set(0, 5, 20);
pointLight.castShadow = true; // Enable shadow casting for the light
pointLight.shadow.mapSize.width = 1024; // Higher value for better shadow quality
pointLight.shadow.mapSize.height = 1024;
pointLight.shadow.camera.near = 0.5;
pointLight.shadow.camera.far = 500;

const pointLight2 = new THREE.PointLight(0xffffff, 300);
pointLight2.position.set(0, -5, -20);
pointLight2.castShadow = true; // Enable shadow casting for the second light
pointLight2.shadow.mapSize.width = 1024;
pointLight2.shadow.mapSize.height = 1024;
pointLight2.shadow.camera.near = 0.5;
pointLight2.shadow.camera.far = 500;

scene.add(pointLight, pointLight2);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);


// Camera controls via mouse - zooming and rotating camera view
const controls = new OrbitControls(camera, renderer.domElement);

// Begin the animation of the setup scene
animate();

////////////////////
// HELPER FUNCTIONS/
///////////////////

// Recursive function to infinitely animate the scene
function animate() {
  requestAnimationFrame(animate); // Tells the browser to animate on infinite loop - refresh

  // Torus rotation animation
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.03;
  torus.rotation.z += 0.005;

  controls.update(); // Listen for control inputs

  renderer.render(scene, camera); // Render the scene
}

// Helper function to generate and render stars
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}











