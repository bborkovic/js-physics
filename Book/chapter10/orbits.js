var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 
var canvas_bg = document.getElementById('canvas_bg');
var context_bg = canvas_bg.getContext('2d');

var M = 1000000; // sun's mass
var G = 1;
var sun;

var planets;
var t0;
var dt;
var force;
var acc;
var numPlanets = 3;

window.onload = init; 

function init() {
	// create a stationary sun
	sun = new Ball(70,'#ff9900',M,0,true);
	sun.pos2D = new Vector2D(400,300);	
	sun.draw(context_bg);
	// create planets
	planets = new Array();
	var radius = new Array(10,6,12);
	var mass = new Array(10,3,15);
	var color = new Array('#0000ff','#ff0000','#00ff00');
	var pos = new Array(new Vector2D(400,50),new Vector2D(500,300),new Vector2D(200,300));
	var velo = new Array(new Vector2D(65,0),new Vector2D(0,100),new Vector2D(0,-70));
	for (var i=0; i<numPlanets; i++){	
		var planet = new Ball(radius[i],color[i],mass[i],0,true);	
		planet.pos2D = pos[i];
		planet.velo2D = velo[i];
		planet.draw(context);
		planets.push(planet);
	}  
	t0 = new Date().getTime(); 
	animFrame();
}
function animFrame(){
	requestAnimationFrame(animFrame,canvas);
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
	context.clearRect(0, 0, canvas.width, canvas.height);
	for (var i=0; i<numPlanets; i++){
		var planet = planets[i];	
		moveObject(planet);
		calcForce(planet);
		updateAccel(planet.mass);
		updateVelo(planet);				
	}
}
function moveObject(obj){
	obj.pos2D = obj.pos2D.addScaled(obj.velo2D,dt);	
	obj.draw(context);	
}
function updateAccel(mass){
	acc = force.multiply(1/mass);
}	
function updateVelo(obj){
	obj.velo2D = obj.velo2D.addScaled(acc,dt);				
}
function calcForce(planet){	
	force = Forces.gravity(G,M,planet.mass,planet.pos2D.subtract(sun.pos2D));		
}

