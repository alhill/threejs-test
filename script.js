if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var containers;
var camera, scene, renderer, controls, raycaster, mouse;
var objects = [];
var movimientolibre = false;

init();
animate();

function init() {
    container = document.getElementById( 'container' );

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
    camera.position.set( 7, 5, 7 );

    scene = new THREE.Scene();
    
    var reja = new THREE.MeshBasicMaterial({opacity: 1, wireframe: true}) ;
    var liso = new THREE.MeshStandardMaterial();

    var loader = new THREE.ColladaLoader();
    loader.options.convertUpAxis = true;
    var moltres = "";
    loader.load( './moltres.dae', function ( collada ) {

        moltres = collada.scene;
        moltres.scale.set( 0.1, 0.1, 0.1 );
        moltres.position.set( 0, 0, -2 );
        setMaterial(moltres, new THREE.MeshBasicMaterial( reja )); 
        scene.add( moltres );
        objects.push( moltres );

    } );
    
    var articuno = "";
    loader.load( './articuno.dae', function ( collada ) {

        articuno = collada.scene;
        articuno.scale.set( 0.1, 0.1, 0.1 );
        articuno.position.set( 2, 0, 1 );
        setMaterial(articuno, new THREE.MeshBasicMaterial( reja )); 
        scene.add( articuno );
        objects.push( articuno );

    } );
    
    var zapdos = "";
    loader.load( './zapdos.dae', function ( collada ) {

        zapdos = collada.scene;
        zapdos.scale.set( 0.15, 0.15, 0.15 );
        zapdos.position.set( -2, 0, 1 );
        setMaterial(zapdos, new THREE.MeshBasicMaterial( reja )); 
        scene.add( zapdos );
        objects.push( zapdos );

    } );

    var gridHelper = new THREE.GridHelper( 10, 20 );
    scene.add( gridHelper );

    var ambientLight = new THREE.AmbientLight( 0xcccccc );
    scene.add( ambientLight );

    var directionalLight = new THREE.DirectionalLight( 0xffffff );
    directionalLight.position.set( 0, 1, -1 ).normalize();
    scene.add( directionalLight );

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    controls = new THREE.OrbitControls( camera, renderer.domElement );

    window.addEventListener( 'resize', onWindowResize, false );
    
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    document.addEventListener( 'mousedown', onDocumentMouseDown, false );
    document.addEventListener( 'touchstart', onDocumentTouchStart, false );
    
    /* document.getElementById("rojo").addEventListener("click", function(){
        objects.forEach((e) => setMaterial( e, reja ));
    });

    document.getElementById("verde").addEventListener("click", function(){
        objects.forEach((e) => setMaterial( e, liso ));
    }); */
    
    document.getElementById("unboton").addEventListener("click", function(){
        console.log( camera.rotation.x );
        console.log( camera.rotation.y );
        console.log( camera.rotation.z );
    });
    
    document.getElementById("auto").addEventListener("click", function(){
        if(movimientolibre){ movimientolibre = false; }
        else{ movimientolibre = true; }
    });
    
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function onDocumentTouchStart( event ) {

    event.preventDefault();
    event.clientX = event.touches[0].clientX;
    event.clientY = event.touches[0].clientY;
    onDocumentMouseDown( event );

}

function onDocumentMouseDown( event ) {

    event.preventDefault();

    mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;

    raycaster.setFromCamera( mouse, camera );

    var intersects = raycaster.intersectObjects( objects, true );

    var rojo = new THREE.Color( 0xff0000 );
    var verde = new THREE.Color( 0x00ff00 );
    var azul = new THREE.Color( 0x0000ff );
    
    if ( intersects.length > 0 ) {
        if ( intersects[ 0 ].object.material.color.equals(rojo) ){
            intersects[ 0 ].object.material.color = verde;
        }
        else if ( intersects[ 0 ].object.material.color.equals(verde) ){
            intersects[ 0 ].object.material.color = azul;
        }
        else if ( intersects[ 0 ].object.material.color.equals(azul) ){
            intersects[ 0 ].object.material.color = rojo;
        } 
        else{
            intersects[ 0 ].object.material.color = rojo; 
        }
    }
}

var theta = 0;
function animate() {
    requestAnimationFrame( animate );
    
    if (!movimientolibre){
        theta += 0.1;
        camera.position.x = 7 + 5 * Math.sin( THREE.Math.degToRad( theta ) );
        camera.position.y = 5 + 5 * Math.sin( THREE.Math.degToRad( theta ) );
        camera.position.z = 7 + 10 * Math.cos( THREE.Math.degToRad( theta ) );    
        camera.lookAt(scene.position);
    }
    
    

    
    render();
}

function render() {
    renderer.render( scene, camera );
}

var setMaterial = function(node, material) {
  node.material = material;
  if (node.children) {
    for (var i = 0; i < node.children.length; i++) {
      setMaterial(node.children[i], material);
    }
  }
}

