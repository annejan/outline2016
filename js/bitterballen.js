/**
 * Bitterballen
 *                deFEEST
 *        Outline 2016
 *
 *        Code:
 *          Ranzbak
 *          Anus
 *        Graphics:
 *          Maali
 *          Razbak
 *          Anus
 *        Music:
 *          TBA
 */

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

camera.position.z = -20;

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var controls = new THREE.OrbitControls( camera, renderer.domElement );
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.maxPolarAngle = Math.PI/2;
controls.addEventListener( 'change', render );

/**
 * TODO: AWESOME SHIT
 */

var loader = new THREE.ColladaLoader();

loader.load("bitterbal.dae", function (result) {
    scene.add(result.scene);
});


/**
 Boring shit
 */

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    render();
}

window.addEventListener( 'resize', onWindowResize, false );

function animate() {
    requestAnimationFrame( animate );
    controls.update();
}

function render() {
    renderer.render( scene, camera );
}

animate();

/**
 Actions
 */
function huisje(huisje) {
    group.remove(mesh);
    mesh = huisjes[huisje];
    group.add(mesh);
    render();
}

function move(axis, amount) {
    var offset = new THREE.Vector3();
    var quat = new THREE.Quaternion().setFromUnitVectors( camera.up, new THREE.Vector3( 0, 1, 0 ) );
    var quatInverse = quat.clone().inverse();
    var position = camera.position;
    var target = new THREE.Vector3();
    offset.copy( position ).sub( target );
    offset.applyQuaternion( quat );
    var theta = Math.atan2( offset.x, offset.z );
    var phi = Math.atan2( Math.sqrt( offset.x * offset.x + offset.z * offset.z ), offset.y );
    switch (axis) {
        case 'x':
            theta -= amount;
            break;
        case 'y':
            phi -= amount;
            break;
    }
    theta = Math.max( controls.minAzimuthAngle, Math.min( controls.maxAzimuthAngle, theta ) );
    phi = Math.max( controls.minPolarAngle, Math.min( controls.maxPolarAngle, phi ) );
    phi = Math.max( 0.000001, Math.min( Math.PI - 0.000001, phi ) );
    var radius = offset.length();
    radius = Math.max( controls.minDistance, Math.min( controls.maxDistance, radius ) );
    offset.x = radius * Math.sin( phi ) * Math.sin( theta );
    offset.y = radius * Math.cos( phi );
    offset.z = radius * Math.sin( phi ) * Math.cos( theta );
    offset.applyQuaternion( quatInverse );
    position.copy( target ).add( offset );
    camera.lookAt(target );
    render();
}

function zoom(amount) {
    camera.zoom += amount;
    camera.updateProjectionMatrix();
    render();
}

var timer = null;

function startCCW(){
    stop();
    timer = setInterval("move('x', 0.02);",30);
}

function startCW(){
    stop();
    timer = setInterval("move('x', -0.02);",30);
}

function startUp(){
    stop();
    timer = setInterval("move('y', 0.02);",30);
}

function startDown(){
    stop();
    timer = setInterval("move('y', -0.02);",30);
}

function startIn(){
    stop();
    timer = setInterval("zoom(0.02);",30);
}

function startOut(){
    stop();
    timer = setInterval("zoom(-0.02);",30);
}

function stop() {
    if (null != timer) {
        clearInterval(timer)
    }
}