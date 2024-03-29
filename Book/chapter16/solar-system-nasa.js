// rendering
var width = window.innerWidth, height = window.innerHeight;
var scene, camera, renderer;

// time-keeping variables
var dt = 1/24; // simulation time unit is 1 day; time-step is 1 hr
var numSteps = 8784; // 366 days; 366*24 
var animFreq = numSteps; // just once at the end of the simulation
var t = 0;

// gravitational constant
var G;

// sun variables 
var center;
var massSun;
var radiusSun = 30;

// velocity and position vectors for all planets
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
	compareNASA();
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
	masses[0] = Astro.MERCURY_MASS/scaleMass;			
	masses[1] = Astro.VENUS_MASS/scaleMass;			
	masses[2] = Astro.EARTH_MASS/scaleMass;			
	masses[3] = Astro.MARS_MASS/scaleMass;				
}
		
function setInitialConditions(){
	center = new Vector3D(0,0,0);

	s = new Array();						
	s[0] = new Vector3D(-5.673486551269988E+07, -2.905807776472880E+07,  2.831471548856726E+06); // mercury
	s[1] = new Vector3D(1.083622101258184E+08,  5.186812728386815E+06, -6.182877404899519E+06); // venus
	s[2] = new Vector3D(-2.501567084587771E+07,  1.449614303354543E+08, -4.572052182107447E+03); // earth
	s[3] = new Vector3D(-1.779441811545570E+08,  1.720857121437973E+08,  7.974975344806875E+06); // mars		
	for (var i=0; i<s.length; i++){
		s[i] = center.addScaled(s[i],1000/scaleDist); // distances in NASA data are in km
	}
			
	v = new Array();			
	v[0] = new Vector3D(1.216453506755825E+01, -4.123145442643666E+01, -4.484987038755303E+00); // mercury
	v[1] = new Vector3D(-1.818140449649583E+00,  3.482184715827766E+01,  5.820179514330701E-01); // venus
	v[2] = new Vector3D(-2.983875373861814E+01, -5.188096364047718E+00,  6.015483423878356E-04); // earth
	v[3] = new Vector3D(-1.592816222793181E+01, -1.535286664845714E+01,  6.941063066996438E-02); // mars			
	for (var j=0; j<v.length; j++){
		v[j].scaleBy(1000/scaleVelo); // velocities in NASA data are in km/s
	}
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
			if ((i+1)%animFreq==0){
				movePlanet(n);
			}
		}		
	}	
}		
function movePlanet(n){
	var planet = planets[n];
	planet.pos = s[n];
	positionObject(planet);		
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
		
function compareNASA(){
	var sN = new Array();						
	sN[0] = new Vector3D(-2.523059048874400E+07, -6.481318803647820E+07,  -2.980648745804020E+06); // mercury
	sN[1] = new Vector3D(-6.886329181483650E+07, -8.355673071416990E+07, 2.829402981411860E+06); // venus
	sN[2] = new Vector3D(-2.693099213397500E+07, 1.446125106986720E+08, -3.955716869788740E+03); // earth
	sN[3] = new Vector3D(1.615753000000000E+08, -1.296287000000000E+08, -6.683049000000000E+06); // mars		
	for (var i=0; i<sN.length; i++){
		sN[i] = center.addScaled(sN[i],1000/scaleDist); // distances in NASA data are in km
		var planet = planets[i];
		var p = planet.clone();
		scene.add(p);
		p.pos = sN[i];
		//p.pos = sN[i].multiply(2);		
		positionObject(p);		
	}
}	