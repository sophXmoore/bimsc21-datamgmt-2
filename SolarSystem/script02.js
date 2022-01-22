// Import Libraries
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.124.0/build/three.module.js'
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.124.0/examples/jsm/controls/OrbitControls.js'
import { Rhino3dmLoader } from 'https://cdn.jsdelivr.net/npm/three@0.124.0/examples/jsm/loaders/3DMLoader.js'

// create a scene and a camera
const scene = new THREE.Scene()
//scene.background = new THREE.Color(1,1,1)
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 8000 )
//const camera = new THREE.OrthographicCamera(-5000, 5000, 5000, 5000, 100, 5000 )
camera.position.z = 1000
camera.position.x = 3000
camera.position.y = 1500

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

let cubeMap, material1, raycaster

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

raycaster = new THREE.Raycaster()

console.log(scene)

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

    // reset object colours
    scene.traverse((child, i) => {
        if (child.isMesh) {
            child.material.color.set( 'white' )
        }
    });

    if (intersects.length > 0) {

        // get closest object
        const object = intersects[0].object
        console.log(object) // debug

        object.material.color.set( 'yellow' )

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

    requestAnimationFrame( animate )
    //P1.rotation.y += 0.015
    //P2.rotation.y += 0.02
    //P3.rotation.y += 0.01
    //P4.rotation.y += 0.03
    //P5.rotation.y += 0.035  
    renderer.render( scene, camera )

}

animate()