var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 
var canvas_bg = document.getElementById('canvas_bg');
var context_bg = canvas_bg.getContext('2d');

var G = 1;
var attractors;
var orbiters;
var t;
var t0;
var dt;
var force;
var acc;
var numOrbiters = 3;
var numAttractors = 2;

window.onload = init; 

function init() {
	// create attractors
	attractors = new Array();
	var radiusA = new Array(20,20);
	var massA = new Array(1000000,1000000);
	var colorA = new Array('#ff9900','#ff9900');
	var posA = new Array(new Vector2D(300,300),new Vector2D(500,300));	
	for (var i=0; i<numAttractors; i++){	
		var attractor = new Ball(radiusA[i],colorA[i],massA[i],0,true);	
		attractor.pos2D = posA[i];
		attractor.draw(context_bg);
		attractors.push(attractor);
	}	
	// create orbiters
	orbiters = new Array();
	var radius = new Array(8,8,8);
	var mass = new Array(1,1,1);
	var color = new Array('#0000ff','#ff0000','#00ff00');
	var pos = new Array(new Vector2D(400,300),new Vector2D(400,400),new Vector2D(300,400));
	var velo = new Array(new Vector2D(0,60),new Vector2D(10,60),new Vector2D(90,0));
	for (var i=0; i<numOrbiters; i++){	
		var orbiter = new Ball(radius[i],color[i],mass[i],0,true);	
		//var orbiter = new Ball(8,'#0000ff',1,0,true);	
		orbiter.pos2D = pos[i];
		orbiter.velo2D = velo[i];
		//orbiter.pos2D = new Vector2D(400,300);
		//orbiter.velo2D = new Vector2D(0,60);
		orbiter.draw(context);
		orbiters.push(orbiter);
	}  
	t0 = new Date().getTime(); 
	animFrame();
};

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
	for (var i=0; i<numOrbiters; i++){
		var orbiter = orbiters[i];	
		moveObject(orbiter);
		calcForce(orbiter);
		updateAccel(orbiter.mass);
		updateVelo(orbiter);				
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
function calcForce(orbiter){	
	var gravity;
	force = Forces.zeroForce();
	for (var i=0; i<numAttractors; i++){
		var attractor = attractors[i];	
		gravity = Forces.gravity(G,attractor.mass,orbiter.mass,orbiter.pos2D.subtract(attractor.pos2D));
		force = Forces.add([force, gravity]);		
	}			
}

