// Import libraries
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.124.0/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.124.0/examples/jsm/controls/OrbitControls.js";
import { Rhino3dmLoader } from "https://cdn.jsdelivr.net/npm/three@0.124.0/examples/jsm/loaders/3DMLoader.js";

let scene, camera, raycaster, renderer, cubeMap;
const mouse = new THREE.Vector2()
window.addEventListener( 'click', onClick, false);
raycaster = new THREE.Raycaster()

const model = ["Sun.3dm", "P1.3dm", "P2.3dm", "P3.3dm", "P4.3dm", "P5.3dm", "Ring.3dm", "Moon.3dm"];

var sunTexture = new THREE.TextureLoader().load('SunTexture.jpg')
const material = new THREE.MeshBasicMaterial({
    map:sunTexture
})

var ringText = new THREE.TextureLoader().load('RingsTexture.jpg')
const ringMat = new THREE.MeshBasicMaterial({
    map:ringText
})

  //color: "#ffc700",
  //emissive: "#ffc700",
  //emissiveIntensity: 0.7,

  /*
var ringMat = new THREE.MeshLambertMaterial({
    color: "#66ffcc",
    emissive: "#66ffcc",
    emissiveIntensity: 0.2,
});
*/

var moonMat = new THREE.MeshLambertMaterial({
    color: "#c2c2d6",
});

var Sun = new THREE.Object3D()
var P1 = new THREE.Object3D()
var P2 = new THREE.Object3D()
var P3 = new THREE.Object3D()
var P4 = new THREE.Object3D()
var P5 = new THREE.Object3D()
var Ring = new THREE.Object3D()
var Moon = new THREE.Object3D()

init();

function init() {
  THREE.Object3D.DefaultUp = new THREE.Vector3(0, 0, 1);

  // create a scene and a camera
  scene = new THREE.Scene();
  //scene.background = new THREE.Color("#3b1111");
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    8000
  );
    camera.position.x = 3000
    camera.position.y = 1500
    camera.position.z = 1000

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
  

  loader.load(model[0], function (object) {
    object.traverse(function (child) {
      if (child.isMesh) {
        child.material = material;
      }
    }, false);
    object.castShadow = false;
    scene.add(object);
    Sun = object;
  });

  loader.load(model[1], function (object) {
    object.castShadow = true;
    scene.add(object);
    P1 = object
  });

  loader.load(model[2], function (object) {
    object.castShadow = true;
    object.recieveShadow = true
    scene.add(object);
    P2 = object
  });

  loader.load(model[3], function (object) {
    object.castShadow = true;
    object.recieveShadow = true
    scene.add(object);
    P3 = object
  });

  loader.load(model[4], function (object) {
    object.castShadow = true;
    object.recieveShadow = true
    scene.add(object)
    P4 = object
  });

  loader.load(model[5], function (object) {
    object.castShadow = true;
    object.recieveShadow = true
    scene.add(object);
    P5 = object
  });

  loader.load(model[6], function (object) {
    object.traverse(function (child) {
        if (child.isMesh) {
          child.material = ringMat;
        }
      }, false); 
    scene.add(object);
    Ring = object
    
  });

  loader.load(model[7], function (object) {
    object.traverse(function (child) {
        if (child.isMesh) {
          child.material = moonMat;
        }
      }, false); 
    Moon = object
    P3.add(Moon);
    
  });
  scene.updateMatrixWorld();

  // create the renderer and add it to the html
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  //renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.body.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);

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
            child.material.color.set('white')
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

let speed = 0;
let counter = 1;

document.getElementById("play").addEventListener("click", function() {
    if (speed == 1){
        return
    }
    else{
        speed = 1/(counter);
        animate();
        counter += 1;
    }
});

document.getElementById("pause").addEventListener("click", function() {
    speed = 0;
    animate();

});

function animate() {
        requestAnimationFrame(animate);
        Sun.rotation.z += 0.02/2*speed
        P1.rotation.z += 0.015/2*speed
        P2.rotation.z += 0.025/2*speed
        P3.rotation.z += 0.01*speed
        Moon.rotation.x += 0.01*speed
        P4.rotation.z += 0.03/2*speed
        Ring.rotation.z += 0.03/2*speed
        P5.rotation.z += 0.035/2*speed
        renderer.render(scene, camera);
}

animate();

