// Import libraries
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124.0/build/three.module.js'
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.124.0/examples/jsm/controls/OrbitControls.js'
import { Rhino3dmLoader } from 'https://cdn.jsdelivr.net/npm/three@0.124.0/examples/jsm/loaders/3DMLoader.js'
import { HDRCubeTextureLoader } from 'https://cdn.jsdelivr.net/npm/three@0.124.0/examples/jsm/loaders/HDRCubeTextureLoader.js';

// declare variables to store scene, camera, and renderer
let scene, camera, renderer

// set up the loader
const loader = new Rhino3dmLoader()
loader.setLibraryPath( 'https://cdn.jsdelivr.net/npm/rhino3dm@0.13.0/' )

// call functions
init()

// load multiple models
// create an array of model names
const models = ['Sun.3dm', 'P1.3dm', 'P2.3dm', 'P3.3dm' ]

for ( let i = 0; i < models.length; i ++ ) {

    load( models[ i ] )

}

// hide spinner
document.getElementById('loader').remove()
animate()

// function to setup the scene, camera, renderer, and load 3d model
function init () {

    // Rhino models are z-up, so set this as the default
    THREE.Object3D.DefaultUp = new THREE.Vector3( 0, 0, 1 )

    // create a scene and a camera
    scene = new THREE.Scene()
    scene.background = new THREE.Color(1,1,1)
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 3000 )
    camera.position.x = 0
    camera.position.z = 2000

    // create the renderer and add it to the html
    renderer = new THREE.WebGLRenderer( { antialias: true } )
    renderer.setSize( window.innerWidth, window.innerHeight )
    document.body.appendChild( renderer.domElement )

    // add some controls to orbit the camera
    const controls = new OrbitControls( camera, renderer.domElement )

    // add point light
    const light = new THREE.PointLight( 0xFFC700, 3, 0 );
    light.position.set( 0, 0, 0 );
    scene.add( light )

    //Add ambient light
    const ambientLight = new THREE.AmbientLight( 0x404040, 4 ); // soft white light
    scene.add( ambientLight ); 

    let cubeMap, material
    
    //create a material
    material = new THREE.MeshStandardMaterial( {
         color: 0xFF0000,
         metalness: 1.0,
         roughness: 1.0
    } )

    cubeMap = new THREE.CubeTextureLoader()
    .setPath('')
    .load( [ 'px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg' ] )

    scene.background = cubeMap


}

function load ( model ) {

    loader.load( model, function ( object ) {

        object.traverse( function (child) { 
            if (child.isMesh) {
                child.material = material
            }
        }, false)

        scene.add( object )

    } )

}

// function to continuously render the scene
function animate() {

    requestAnimationFrame( animate )
    renderer.render( scene, camera )

}



