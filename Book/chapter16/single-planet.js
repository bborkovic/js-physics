var width = window.innerWidth, height = window.innerHeight;
var dt = 0.05;
var numSteps = 2500;
var animFreq = 40;
var t = 0;	
var v = new Vector3D(5,0,14);			
var s = new Vector3D(0,250,0);	
var center = new Vector3D(0,0,0);
var G = 10;
var massSun = 5000;
var scene, camera, renderer;
var sun, planet;

window.onload = init;	
	
function init(){	
	setupObjects();
	simulate();
	renderer.render(scene, camera);	
}
function setupObjects(){
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(width, height);
	document.body.appendChild(renderer.domElement);

	scene = new THREE.Scene();

	var angle = 45, aspect = width/height, near = 0.1, far = 10000;
	camera = new THREE.PerspectiveCamera(angle, aspect, near, far);
	camera.position.set(0,0,1000);	
	scene.add(camera);
	
	var light = new THREE.DirectionalLight();
	light.position.set(-10,0,20);
	scene.add(light);

	var radius = 80, segments = 20, rings = 20;
	var sphereGeometry = new THREE.SphereGeometry(radius,segments,rings);
	var sphereMaterial = new THREE.MeshLambertMaterial({color: 0xffff00});
	sun = new THREE.Mesh(sphereGeometry,sphereMaterial);
	scene.add(sun);
	sun.mass = massSun;
	sun.pos = center;		
	positionObject(sun);

	var sphereGeometry = new THREE.SphereGeometry(radius/10,segments,rings);
	var sphereMaterial = new THREE.MeshLambertMaterial({color: 0x0099ff});	
	planet = new THREE.Mesh(sphereGeometry,sphereMaterial);
	scene.add(planet);
	planet.mass = 1;
	planet.pos = s;		
	positionObject(planet);
}
function positionObject(obj){
	obj.position.set(obj.pos.x,obj.pos.y,obj.pos.z);
}
function simulate(){
	for (var i=0; i<numSteps; i++){
		t += dt; 				
		RK4();
		if (i%animFreq==0){
			clonePlanet(planet);
		}		
	}	
}		
function clonePlanet(){
	var p = planet.clone();
	scene.add(p);
	p.pos = s;
	positionObject(p);				
}
function getAcc(ppos,pvel){
	var r = ppos.subtract(center);
	return r.multiply(-G*massSun/(r.lengthSquared()*r.length()));
}
function RK4(){			
	// step 1
	var pos1 = s;
	var vel1 = v;
	var acc1 = getAcc(pos1,vel1); 
	// step 2
	var pos2 = pos1.addScaled(vel1,dt/2); 
	var vel2 = vel1.addScaled(acc1,dt/2);
	var acc2 = getAcc(pos2,vel2); 
	// step 3
	var pos3 = pos1.addScaled(vel2,dt/2); 
	var vel3 = vel1.addScaled(acc2,dt/2);
	var acc3 = getAcc(pos3,vel3); 
	// step 4
	var pos4 = pos1.addScaled(vel3,dt); 
	var vel4 = vel1.addScaled(acc3,dt);
	var acc4 = getAcc(pos4,vel4); 
	// sum vel and acc
	var velsum = vel1.addScaled(vel2,2).addScaled(vel3,2).addScaled(vel4,1);
	var accsum = acc1.addScaled(acc2,2).addScaled(acc3,2).addScaled(acc4,1);
	// update pos and velo
	s = pos1.addScaled(velsum,dt/6);
	v = vel1.addScaled(accsum,dt/6);			
	//acc = accsum.multiply(1/6);
}
		