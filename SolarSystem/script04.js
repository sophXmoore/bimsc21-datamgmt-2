import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.124.0/build/three.module.js";
import * as PubSub from "https://cdnjs.com/libraries/pubsub-js"
// create a three.js scene
var scene = new THREE.Scene();

// create a camera
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(50, 30, 50);
camera.lookAt(0, 0, 0);

// create the renderer
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// create a simple cube
var geometry = new THREE.BoxGeometry(20, 20, 20);
var material = new THREE.MeshLambertMaterial({ color: 0x10a315 });
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// add a light so we can see something
var light = new THREE.PointLight(0xFFFF00);
light.position.set(25, 25, 25);
scene.add(light);

const rotateX = () => {
  cube.rotation.x += Math.PI / 180;
};
rotateX.id = 'x';
rotateX.alive = true;

const rotateY = () => {
  cube.rotation.y += Math.PI / 180;
};
rotateY.id = 'y';
rotateY.alive = true;

const rotateZ = () => {
  cube.rotation.z += Math.PI / 180;
};
rotateZ.id = 'z';
rotateZ.alive = true;

let loops = [
rotateX];


const removeLoop = loop => {
  loops = loops.filter(item => item.id !== loop.id);
};
// declare a subscriber to remove loops
PubSub.subscribe('x.loops.remove', (msg, loop) => removeLoop(loop));
// declare a subscriber to add a loop
PubSub.subscribe('x.loops.push', (msg, loop) => loops.push(loop));
// declare a subscriber to add a loop that will be executed first
PubSub.subscribe('x.loops.unshift', (msg, loop) => loops.unshift(loop));

const cleanLoops = () => {
  loops.forEach(loop => {
    if (loop.alive !== undefined && loop.alive === false && loop.object) {
      scene.remove(loop.object);
    }
  });
  loops = loops.filter(loop => loop.alive === undefined || loop.alive === true);
};

const stats = new Stats();
document.body.appendChild(stats.dom);

let play = true;
PubSub.subscribe('x.toggle.play', () => {play = !play;});

let lastTimestamp = 0;
var mainLoop = timestamp => {
  requestAnimationFrame(mainLoop);
  let delta = timestamp - lastTimestamp;
  lastTimestamp = timestamp;

  if (play) {
    loops.forEach(loop => {
      loop.loop ? loop.loop(timestamp, delta) : loop(timestamp, delta);
    });

    renderer.render(scene, camera);
  }

  cleanLoops();

  stats.update();
};

mainLoop(0);

$("#x").change(() => {
  if ($('#x').is(':checked')) {
    PubSub.publish('x.loops.push', rotateX);
  } else {
    PubSub.publish('x.loops.remove', rotateX);
  }
});

$("#y").change(() => {
  if ($('#y').is(':checked')) {
    PubSub.publish('x.loops.push', rotateY);
  } else {
    PubSub.publish('x.loops.remove', rotateY);
  }
});

$("#z").change(() => {
  if ($('#z').is(':checked')) {
    PubSub.publish('x.loops.push', rotateZ);
  } else {
    PubSub.publish('x.loops.remove', rotateZ);
  }
});

$('#play').click(() => PubSub.publish('x.toggle.play'));