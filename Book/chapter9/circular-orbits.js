var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 
var canvas_bg = document.getElementById('canvas_bg');
var context_bg = canvas_bg.getContext('2d');

var planet;
var sun;
var m = 1; // planet's mass
var M = 1000000; // sun's mass
var G = 1;
var t0,dt;
var acc, force;

window.onload = init; 

function init() {			
	// create a stationary sun
	sun = new Ball(70,'#ff9900',M,0,true);
	sun.pos2D = new Vector2D(400,300);	
	sun.draw(context_bg);
	// create a moving planet			
	planet = new Ball(10,'#0000ff',m);
	planet.pos2D = new Vector2D(400,50);
	//planet.pos2D = new Vector2D(400,150);
	var r = planet.pos2D.subtract(sun.pos2D).length();
	var v = Math.sqrt(G*M*m/r);
	planet.velo2D = new Vector2D(v,0);		
	//planet.velo2D = new Vector2D(v/Math.sqrt(2),v/Math.sqrt(2));
	planet.draw(context);
	// make the planet orbit the sun
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
	moveObject(planet);
	calcForce();
	updateAccel();
	updateVelo(planet);
}
function moveObject(obj){
	obj.pos2D = obj.pos2D.addScaled(obj.velo2D,dt);	
	context.clearRect(0, 0, canvas.width, canvas.height);
	obj.draw(context);	
}
function calcForce(){
	force = Forces.gravity(G,M,m,planet.pos2D.subtract(sun.pos2D));	
}	
function updateAccel(){
	acc = force.multiply(1/m);
}	
function updateVelo(obj){
	obj.velo2D = obj.velo2D.addScaled(acc,dt);				
}
