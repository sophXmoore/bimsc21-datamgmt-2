// Import libraries
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.124.0/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.124.0/examples/jsm/controls/OrbitControls.js";
import { Rhino3dmLoader } from "https://cdn.jsdelivr.net/npm/three@0.124.0/examples/jsm/loaders/3DMLoader.js";

let scene, camera, raycaster, renderer, cubeMap;
const mouse = new THREE.Vector2()
window.addEventListener( 'click', onClick, false);
raycaster = new THREE.Raycaster()

/*
// create a scene and a camera
const scene = new THREE.Scene()
//scene.background = new THREE.Color(1,1,1)
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 8000 )
//const camera = new THREE.OrthographicCamera(-5000, 5000, 5000, 5000, 100, 5000 )
camera.position.z = 1000
camera.position.x = 3000
camera.position.y = 1500
*/

const model = ["Sun.3dm", "P1.3dm", "P2.3dm", "P3.3dm", "P4.3dm", "P5.3dm"];

var material = new THREE.MeshLambertMaterial({
  color: "#ffc700",
  emissive: "#ffc700",
  emissiveIntensity: 0.7,
});

var P1 = new THREE.Object3D()
var P2 = new THREE.Object3D()
var P3 = new THREE.Object3D()
var P4 = new THREE.Object3D()
var P5 = new THREE.Object3D()

init();
animate();

function init() {
  THREE.Object3D.DefaultUp = new THREE.Vector3(0, 0, 1);

  // create a scene and a camera
  scene = new THREE.Scene();
  //scene.background = new THREE.Color("#3b1111");
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    5500
  );
    camera.position.x = 3000
    camera.position.y = 1500
    camera.position.z = 1000

  // create the renderer and add it to the html
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.body.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);

  //Add Point Light
  const light = new THREE.PointLight(0xffc700, 2, 0);
  light.position.set(0, 0, 0);
  light.castShadow = true
  scene.add(light);

  //Add ambient light
  const ambientLight = new THREE.AmbientLight(0x404040, 2); // soft white light
  scene.add(ambientLight);

  //Add Cube Map
  cubeMap = new THREE.CubeTextureLoader()
    .setPath("textures/cubeMap/")
    .load(["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"]);
  scene.background = cubeMap;

  const loader = new Rhino3dmLoader();
  loader.setLibraryPath("https://cdn.jsdelivr.net/npm/rhino3dm@0.13.0/");
  
  var Sun;
  loader.load(model[0], function (object) {
    object.traverse(function (child) {
      if (child.isMesh) {
        child.material = material;
      }
    }, false);

    scene.add(object);
  });

  loader.load(model[1], function (object) {
    scene.add(object);
    P1 = object
  });

  loader.load(model[2], function (object) {
    scene.add(object);
    P2 = object
  });

  loader.load(model[3], function (object) {
    scene.add(object);
    P3 = object
  });

  loader.load(model[4], function (object) {
    scene.add(object);
    P4 = object
  });

  loader.load(model[5], function (object) {
    scene.add(object);
    P5 = object
  });
}


function onClick( event ) {
    console.log( `click! (${event.clientX}, ${event.clientY})`)


	// calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1
    
    raycaster.setFromCamera( mouse, camera )

	// calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects( scene.children, true )

    let container = document.getElementById( 'container' )
    if (container) container.remove()

    // reset object colours after clicking
    scene.traverse((child, i) => {
        if (child.isMesh) {
            child.material.color.set( 'white' )
        }
    });

    if (intersects.length > 0) {

        // get closest object
        const object = intersects[0].object
        console.log(object) // debug

        object.material.color.set( 'red' )

        // get user strings
        let data, count
        if (object.userData.attributes !== undefined) {
            data = object.userData.attributes.userStrings
        } else {
            // breps store user strings differently...
            data = object.parent.userData.attributes.userStrings
        }

        // do nothing if no user strings
        if ( data === undefined ) return

        console.log( data )
        
        // create container div with table inside
        container = document.createElement( 'div' )
        container.id = 'container'
        
        const table = document.createElement( 'table' )
        container.appendChild( table )

        for ( let i = 0; i < data.length; i ++ ) {

            const row = document.createElement( 'tr' )
            row.innerHTML = `<td>${data[ i ][ 0 ]}</td><td>${data[ i ][ 1 ]}</td>`
            table.appendChild( row )
        }

        document.body.appendChild( container )
    }

}

function animate() {
  requestAnimationFrame(animate);
  P1.rotation.z += 0.015
  P2.rotation.z += 0.02
  P3.rotation.z += 0.01
  P4.rotation.z += 0.03
  P5.rotation.z += 0.035
  renderer.render(scene, camera);
}

