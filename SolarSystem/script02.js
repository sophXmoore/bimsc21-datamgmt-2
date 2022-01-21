// Import Libraries
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124.0/build/three.module.js'
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.124.0/examples/jsm/controls/OrbitControls.js'
import { Rhino3dmLoader } from 'https://cdn.jsdelivr.net/npm/three@0.124.0/examples/jsm/loaders/3DMLoader.js'

// create a scene and a camera
const scene = new THREE.Scene()
//scene.background = new THREE.Color(1,1,1)
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 3000 )
camera.position.z = 3000

// create the renderer and add it to the html
const renderer = new THREE.WebGLRenderer()
renderer.setSize( window.innerWidth, window.innerHeight )
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild( renderer.domElement )

//Add Controls
const controls = new OrbitControls( camera, renderer.domElement );

// add point light
const light = new THREE.PointLight( 0xFFC700, 2, 0 );
light.position.set( 0, 0, 0 );
scene.add( light )

//Add ambient light
const ambientLight = new THREE.AmbientLight( 0x404040, 2 ); // soft white light
scene.add( ambientLight ); 

let cubeMap, material1

// load cube map

cubeMap = new THREE.CubeTextureLoader()
    .setPath('textures/cubeMap/')
    .load( [ 'px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png' ] )
scene.background = cubeMap


// create a material
material1 = new THREE.MeshStandardMaterial( {
     color: 0xff0000,
     emissive: 0xffffff,
     emissiveMap: 0xffffff,
     emissiveIntensity: 5
} )

// load the model
const model = ['Sun.3dm', 'P1.3dm', 'P2.3dm', 'P3.3dm', 'P4.3dm', 'P5.3dm']

const loader = new Rhino3dmLoader()
loader.setLibraryPath( 'https://cdn.jsdelivr.net/npm/rhino3dm@0.13.0/' )

var Sun
    
    loader.load( model[0], function (object) {
    object.material = material1
    scene.add(object)
    Sun = object
}) 

var P1
    
    loader.load( model[1], function (object) {
    object.material = material1
    scene.add(object)
    P1 = object
})

var P2
    
    loader.load( model[2], function (object) {
    object.material = material1
    scene.add(object)
    P2 = object
})

var P3
    
    loader.load( model[3], function (object) {
    object.material = material1
    scene.add(object)
    P3 = object
})

var P4
    
    loader.load( model[4], function (object) {
    object.material = material1
    scene.add(object)
    P4 = object
})

var P5
    
    loader.load( model[5], function (object) {
    object.material = material1
    scene.add(object)
    P5 = object
})

function animate() {

    requestAnimationFrame( animate )
    //P1.rotation.z += 0.015
    //P2.rotation.z += 0.02
    //P3.rotation.z += 0.01
    //P4.rotation.z += 0.03
    //P5.rotation.z += 0.035  
    renderer.render( scene, camera )

}

animate()