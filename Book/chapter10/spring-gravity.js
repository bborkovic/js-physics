var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 
var canvas_bg = document.getElementById('canvas_bg');
var context_bg = canvas_bg.getContext('2d');

var vmax = 100;
var m = 1; // particles' mass
var M = 1; // center's mass
var G = 1;
var k = -G*M*m;
var n = 1;
var center;
var particles;
var t0;
var dt;
var force;
var acc;
var numParticles = 50;

window.onload = init; 

function init() {
	// create a stationary center
	center = new Ball(20,'#ff0000',M,0,true);
	center.pos2D = new Vector2D(400,300);	
	center.draw(context_bg);
	// create particles
	particles = new Array();
	for (var i=0; i<numParticles; i++){	
		var particle = new Ball(4,'#000000',m,0,false);	
		particle.pos2D = new Vector2D(Math.random()*canvas.width,Math.random()*canvas.height);
		particle.velo2D = new Vector2D((Math.random()-0.5)*vmax,(Math.random()-0.5)*vmax);
		particle.draw(context);
		particles.push(particle);
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
	for (var i=0; i<numParticles; i++){
		var particle = particles[i];	
		moveObject(particle);
		calcForce(particle);
		updateAccel(particle.mass);
		updateVelo(particle);				
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
function calcForce(particle){		
	var r = particle.pos2D.subtract(center.pos2D);	
	force = Forces.central(k,n,r);	
}

