
import { cameraPosition } from 'three/src/nodes/TSL.js';
import './style.css';
import * as THREE from 'three';
import { GridHelper, PointLight } from 'three.js';
import { OrbitControls } from 'three/examples/jsm/Addons.js';


/* 
 Instantiate the key elements required for three.js animation
 - scene contains all element
 - camera captures what is displayed to the user
 - renderer creates the the projected image from the camera
*/

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({canvas: document.querySelector('#bg'), alpha:true, antialias:true}); //render to the html page

//Render setup
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

//Texture preparation
const moonTexture = new THREE.TextureLoader().load('src/moon_texture.png');
const normalTexture = new THREE.TextureLoader().load('src/normal_texture.png');
const spaceTexture = new THREE.TextureLoader().load('src/space_texture.png');

//set background
scene.background = spaceTexture;

//add and configure torus geometry 
const geometry = new THREE.TorusGeometry(10,3,16,100);
const material = new THREE.MeshStandardMaterial({color:0xFFD700});
const torus = new THREE.Mesh(geometry, material);
scene.add(torus)


//add and configure moon geometry
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3,32,32),
  new THREE.MeshStandardMaterial({map: moonTexture, normalMap: normalTexture})
);
scene.add(moon);

//add 200 random stars to the space
Array(200).fill().forEach(addStar)

//lighting effects
const pointLight = new THREE.PointLight(0xffffff,5000)
pointLight.position.set(20,5,20)
const pointLight2 = new THREE.PointLight(0xffffff,5000)
pointLight2.position.set(-20,-5,-20)
scene.add(pointLight,pointLight2)



const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)

const lightHelper = new THREE.PointLightHelper(pointLight)
const gridHelper = new THREE.GridHelper(200,50)
scene.add(lightHelper, gridHelper, ambientLight)


//Camera coontrols via mouse - zooming and rotating camera view
const controls = new OrbitControls(camera, renderer.domElement);

//Begin the animation of the setup scene
animate();

////////////////////
//HELPER FUNCTIONS//
///////////////////

//recursive function to infinitely animate the scene
function animate(){
  requestAnimationFrame(animate);//tells browser to animate on infinite loop - refresh

  //Torus rotation animation
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.03;
  torus.rotation.z += 0.005;

  controls.update(); //listen for control inputs

  renderer.render(scene, camera);//render the scene 
}

//helper function to generate and render srars
function addStar(){
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({color: 0xffffff})
  const star = new THREE.Mesh(geometry, material);

  const[x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x,y,z);
  scene.add(star)
}
 










