// rendering
var width = window.innerWidth, height = window.innerHeight;
var scene, camera, renderer;

// time-keeping variables
var dt = 1/24; // simulation time unit is 1 day; time-step is 1 hr
var numSteps = 8760; // 1 year; 365*24 
var animFreq = 168; // once per week; 24*7
var t = 0;

// gravitational constant
var G;

// sun variables 
var center;
var massSun;
var radiusSun = 30;

// arrays to hold velocity and position vectors for all planets
var v;	
var s;

// visual objects
var sun;				
var planets;
var numPlanets = 4;		
		
// planets' properties
var colors;				
var radiuses;		
var masses;
var distances;		
var velos;					
		
// scaling factors
var scaleTime;
var scaleDist;
var scaleMass;
var scaleVelo;

window.onload = init;	
	
function init(){
	setupScaling();
	setupPlanetData();
	setInitialConditions();
	setupObjects();	
	simulate();
	renderer.render(scene, camera);	
}

function setupScaling(){
	scaleMass = Astro.EARTH_MASS;			
	scaleTime = Astro.EARTH_DAY;
	scaleDist = 1e9; // 1 million km or 1 billion meters
	scaleVelo = scaleDist/scaleTime; // million km per day

	massSun = Astro.SUN_MASS/scaleMass;

	G = Phys.GRAVITATIONAL_CONSTANT;
	G *= scaleMass*scaleTime*scaleTime/(scaleDist*scaleDist*scaleDist);	
}
		
function setupPlanetData(){
	radiuses = [1.9, 4.7, 5, 2.7];
	colors = [0xffffcc, 0xffcc00, 0x0099ff, 0xff6600];
			
	masses = new Array();
	distances = new Array();
	velos = new Array();
			
	masses[0] = Astro.MERCURY_MASS/scaleMass;			
	masses[1] = Astro.VENUS_MASS/scaleMass;			
	masses[2] = Astro.EARTH_MASS/scaleMass;			
	masses[3] = Astro.MARS_MASS/scaleMass;		
			
	distances[0] = Astro.MERCURY_ORBITAL_RADIUS/scaleDist;			
	distances[1] = Astro.VENUS_ORBITAL_RADIUS/scaleDist;			
	distances[2] = Astro.EARTH_ORBITAL_RADIUS/scaleDist;			
	distances[3] = Astro.MARS_ORBITAL_RADIUS/scaleDist;			
			
	velos[0] = Astro.MERCURY_ORBITAL_VELOCITY/scaleVelo;			
	velos[1] = Astro.VENUS_ORBITAL_VELOCITY/scaleVelo;			
	velos[2] = Astro.EARTH_ORBITAL_VELOCITY/scaleVelo;			
	velos[3] = Astro.MARS_ORBITAL_VELOCITY/scaleVelo;		
}
		
function setInitialConditions(){
	center = new Vector3D(0,0,0);

	s = new Array();						
	s[0] = new Vector3D(distances[0],0,0);
	s[1] = new Vector3D(distances[1],0,0);		
	s[2] = new Vector3D(distances[2],0,0);			
	s[3] = new Vector3D(distances[3],0,0);			
			
	v = new Array();			
	v[0] = new Vector3D(0,velos[0],0);
	v[1] = new Vector3D(0,velos[1],0);
	v[2] = new Vector3D(0,velos[2],0);
	v[3] = new Vector3D(0,velos[3],0);
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

	var sphereGeometry = new THREE.SphereGeometry(radiusSun,10,10);
	var sphereMaterial = new THREE.MeshLambertMaterial({color: 0xffff00});
	sun = new THREE.Mesh(sphereGeometry,sphereMaterial);
	scene.add(sun);
	sun.mass = massSun;
	sun.pos = center;		
	positionObject(sun);

	planets = new Array();
	
	for (var n=0; n<numPlanets; n++){	
		sphereGeometry = new THREE.SphereGeometry(radiuses[n],10,10);
		sphereMaterial = new THREE.MeshLambertMaterial({color: colors[n]});
		var planet = new THREE.Mesh(sphereGeometry,sphereMaterial);
		planets.push(planet);
		scene.add(planet);
		planet.mass = masses[n];
		planet.pos = s[n];
		planet.velo = v[n];		
		positionObject(planet);	
	}
}
function positionObject(obj){
	obj.position.set(obj.pos.x,obj.pos.y,obj.pos.z);
}

function simulate(){
	for (var i=0; i<numSteps; i++){
		t += dt; 				
		for (var n=0; n<numPlanets; n++){
			RK4(n);
			if (i%animFreq==0){
				clonePlanet(n);
			}
		}		
	}		
}
function clonePlanet(n){
	var planet = planets[n];
	var p = planet.clone();
	scene.add(p);
	p.pos = s[n];
	positionObject(p);		
}

function getAcc(ppos,pvel,pn){
	var massPlanet = planets[pn].mass;
	var r = ppos.subtract(center);
	// force exerted by sun
	var force = Forces3D.gravity(G,massSun,massPlanet,r);
	// forces exerted by other planets
	for (var n=0; n<numPlanets; n++){
		if (n!=pn){ // exclude the current planet itself!
			r = ppos.subtract(s[n]);
			var gravity = Forces3D.gravity(G,masses[n],massPlanet,r);;
			force = Forces3D.add([force, gravity]);
		}
	}
	// acceleration
	return force.multiply(1/massPlanet);
}

function RK4(n){			
	// step 1
	var pos1 = s[n];
	var vel1 = v[n];
	var acc1 = getAcc(pos1,vel1,n); 
	// step 2
	var pos2 = pos1.addScaled(vel1,dt/2); 
	var vel2 = vel1.addScaled(acc1,dt/2);
	var acc2 = getAcc(pos2,vel2,n); 
	// step 3
	var pos3 = pos1.addScaled(vel2,dt/2); 
	var vel3 = vel1.addScaled(acc2,dt/2);
	var acc3 = getAcc(pos3,vel3,n); 
	// step 4
	var pos4 = pos1.addScaled(vel3,dt); 
	var vel4 = vel1.addScaled(acc3,dt);
	var acc4 = getAcc(pos4,vel4,n); 
	// sum vel and acc
	var velsum = vel1.addScaled(vel2,2).addScaled(vel3,2).addScaled(vel4,1);
	var accsum = acc1.addScaled(acc2,2).addScaled(acc3,2).addScaled(acc4,1);
	// update pos and velo
	s[n] = pos1.addScaled(velsum,dt/6);
	v[n] = vel1.addScaled(accsum,dt/6);			
}
		