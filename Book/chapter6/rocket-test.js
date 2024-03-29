var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 
var canvas_bg = document.getElementById('canvas_bg');
var context_bg = canvas_bg.getContext('2d');

var rocket;		
var massPlanet;		
var centerPlanet;		
var radiusPlanetSquared;
var G = 0.1;
var dmdt = 0.5;
var dmdtSide= 0.1;		
var fuelMass = 3.5;
var fuelSideMass = 3.5;		
var fuelUsed = 0;
var fuelSideUsed = 0;		
var ve = new Vector2D(0,200);
var veSide = new Vector2D(-100,0);		
var applySideThrust = false;
var showExhaust = true;
var orientation = 1;
var animId;
var t0,dt;

window.onload = init; 

function init() {
	// create 100 stars randomly positioned
	for (var i=0; i<100; i++){
		var star = new Ball(1,'#ffff00');
		star.pos2D = new Vector2D(Math.random()*canvas_bg.width,Math.random()*canvas_bg.height);
		star.draw(context_bg);
	}			
	// create a stationary planet planet			
	planet = new Ball(100,'#0033ff',1000000);
	planet.pos2D = new Vector2D(400,400);		
	planet.draw(context_bg);
	massPlanet = planet.mass;			
	centerPlanet = planet.pos2D;			
	radiusPlanetSquared = planet.radius*planet.radius;		
	// create a rocket			
	rocket = new Rocket(12,12,'#cccccc',10);
	rocket.pos2D = new Vector2D(400,300);		
	rocket.draw(context,showExhaust);	
	// set up event listeners
	window.addEventListener('keydown',startSideThrust,false);		
	window.addEventListener('keyup',stopSideThrust,false);	
	// launch the rocket
	t0 = new Date().getTime(); 
	animFrame();
};

function animFrame(){
	animId = requestAnimationFrame(animFrame,canvas);
	onTimer(); 
}
function onTimer(){
	var t1 = new Date().getTime(); 
	dt = 0.001*(t1-t0); 
	t0 = t1;
	if (dt>0.2) {dt=0;};	
	move();
}
function move(){			
	moveObject();
	calcForce();
	updateAccel();
	updateVelo();
	updateMass();
	monitor();	
}

function moveObject(){
	rocket.pos2D = rocket.pos2D.addScaled(rocket.velo2D,dt);	
	context.clearRect(0, 0, canvas.width, canvas.height);
	rocket.draw(context,showExhaust);	
}
function calcForce(){
	var gravity = Forces.gravity(G,massPlanet,rocket.mass,rocket.pos2D.subtract(centerPlanet));	
	var thrust = new Vector2D(0,0);
	var thrustSide = new Vector2D(0,0);			
	if (fuelUsed < fuelMass){
		thrust = ve.multiply(-dmdt);
	}
	if (fuelSideUsed < fuelSideMass && applySideThrust){
		thrustSide = veSide.multiply(-dmdtSide*orientation);		
	}			
	force = Forces.add([gravity, thrust, thrustSide]);	
}	
function updateAccel(){
	acc = force.multiply(1/rocket.mass);
}	
function updateVelo(){
	rocket.velo2D = rocket.velo2D.addScaled(acc,dt);				
}
function updateMass(){
	if (fuelUsed < fuelMass){
		fuelUsed += dmdt*dt;
		rocket.mass += -dmdt*dt;							
	}
	if (fuelSideUsed < fuelSideMass && applySideThrust){
		fuelSideUsed += dmdtSide*dt;
		rocket.mass += -dmdtSide*dt;
	}				
}	
function monitor(){	
	if (showExhaust && fuelUsed >= fuelMass){
		showExhaust = false; 
	}
	if (rocket.pos2D.subtract(centerPlanet).lengthSquared() < radiusPlanetSquared){
		stop(); 
	}
}
function startSideThrust(evt){ 
	if (evt.keyCode==39){ // right arrow
		applySideThrust = true;
		orientation = 1;
	}
	if (evt.keyCode==37){ // left arrow
		applySideThrust = true;
		orientation = -1;
	}			
}
function stopSideThrust(evt){ 
	applySideThrust = false;
}
function stop(){
	cancelAnimationFrame(animId);
}
