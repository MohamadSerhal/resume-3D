import './style.css'

// We use the three.js library to create the 3D portfolio
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

// Scene is the container that holds all objects, cameras, light ...
const scene = new THREE.Scene();   

// This is the camera, it will mimic what a person will see in a 3D world from their perspective
// It will take as arguments the field of view (here 75), the aspect ratio depending on the users screen,
// near (here 0.1) and far (here 1000), the last 2 represent the view frustrum.
// The view frustum is the region of space in the modeled world that may appear on the screen; 
// it is the field of view of a perspective virtual camera system.
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000 );   

// The renderer that will render the elements, it will use the canvas DOM element with id: bg
const renderer = new THREE.WebGLRenderer({
  canvas : document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio); 
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);  // move camera back on the Z axis to be able to see everything from further away
camera.position.setY(30);
camera.position.setX(17);


renderer.render(scene, camera);

// Adding Earth
const earthTexture = new THREE.TextureLoader().load('earth.jpg');
const earthNormalTexture = new THREE.TextureLoader().load('earthNormal.png');
const earth = new THREE.Mesh(
  new THREE.SphereGeometry(12, 52, 52),
  new THREE.MeshStandardMaterial( {map: earthTexture, normalMap: earthNormalTexture} )
);
earth.position.setX(0);
earth.position.setY(0);
earth.position.setZ(0);
scene.add(earth);


// Adding Mars
const marsTexture = new THREE.TextureLoader().load('mars.jpg');
const marsNormalTexture = new THREE.TextureLoader().load('marsNormal.jpg');
const mars = new THREE.Mesh(
  new THREE.SphereGeometry(7, 32, 32),
  new THREE.MeshStandardMaterial( {map: marsTexture, normalMap: marsNormalTexture} )
);
mars.position.setX(100);
mars.position.setY(0);
mars.position.setZ(-80);
scene.add(mars);

// Adding Venus
const venusTexture = new THREE.TextureLoader().load('venus.jpg');
const venus = new THREE.Mesh(
  new THREE.SphereGeometry(10, 32, 32),
  new THREE.MeshStandardMaterial( {map: venusTexture} )
);
venus.position.setX(-100);
venus.position.setY(0);
venus.position.setZ(-30);
scene.add(venus);


// Adding Lighting
const light =  new THREE.PointLight(0xffffff);
light.position.set(20, 20, 20);

/* const lightHelp = new THREE.PointLightHelper(light);
const gridHelp = new THREE.GridHelper(200, 50);  , lightHelp, gridHelp */

const ambiantLight = new THREE.AmbientLight(0xffffff);  
scene.add(light, ambiantLight);

// Creating movable camera
const orbitControls = new OrbitControls(camera, renderer.domElement);

// Adding stars at random locations
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial( {color: 0xffffff} );
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3).fill().map( () => THREE.MathUtils.randFloat(-100,100) );  
  star.position.set(x, y, z);
  scene.add(star);
}

Array(250).fill().forEach(addStar);

const spaceBackground = new THREE.TextureLoader().load('space.jpg');
scene.background = spaceBackground;


// Adding the moon:
const moonTexture = new THREE.TextureLoader().load('moon.jpg');
const moonNormalMap = new THREE.TextureLoader().load('moonNormal.jpg');
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial( {map: moonTexture, normalMap: moonNormalMap} )
);
moon.position.setX(-10);
moon.position.setZ(30);
scene.add(moon);




// Allowing the user to scroll through the page allowing to move the camera 
function scroll () {
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.002;
  camera.rotation.y = t * -0.0002;
}

document.body.onscroll = scroll;
scroll();

// Animate the Torus shape
var t2 = 0;
function animate(){
  requestAnimationFrame(animate);
  moon.rotation.y = moon.rotation.y + 0.005
  earth.rotation.y = earth.rotation.y + 0.0025
  mars.rotation.y = mars.rotation.y - 0.005;
  venus.rotation.y = venus.rotation.y + 0.005

  if (t2===Number.MAX_SAFE_INTEGER) t2 = 0;
  t2 = t2 + 0.01;
  moon.position.x = 20*Math.cos(t2) + 0;
  moon.position.z = 20*Math.sin(t2) + 0;

  orbitControls.update();

  renderer.render(scene, camera);
}

animate()

