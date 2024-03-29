var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 

var particles;
var m = 1; 
var g = 10; 
var k = 0.005;
var vx = 150;
var vy = -100;
var numSparks = 10; // number of sparks per explosion
var minLife = 2; // minimum lifetime of sparks in seconds
var maxLife = 4; // maximum lifetime of sparks in seconds
var duration = 6; // maximum duration of fireworks in seconds
var fps = 30; // controls rate of creation of particles
var t0, t, dt;
var acc, force;
var posEmitter;

window.onload = init; 

function init() {
	particles = new Array();
	posEmitter = new Vector2D(0.5*canvas.width,200);
	createNewParticles(posEmitter,255,255,0);	
	t0 = new Date().getTime();
	t = 0;
	animFrame();
}			
function animFrame(){
	setTimeout(function() {
        animId = requestAnimationFrame(animFrame,canvas);
		onTimer();
    }, 1000/fps);	
}
function onTimer(){
	var t1 = new Date().getTime(); 
	dt = 0.001*(t1-t0); 
	t0 = t1;
	if (dt>0.2) {dt=0;};
	t += dt;	
	move();
}
function move(){	
	context.clearRect(0, 0, canvas.width, canvas.height);	
//	createNewParticles(posEmitter);	
	for (var i=0; i<particles.length; i++){
		var particle = particles[i];	
		modifyObject(particle,i);	
		moveObject(particle);
		calcForce(particle);
		updateAccel();
		updateVelo(particle);				
	}	
}
function createNewParticles(ppos,r,g,b){
	for (var i=0; i<numSparks; i++){
		var newParticle = new Spark(2,r,g,b,1,m);
		setProperties(newParticle,ppos);	
		particles.push(newParticle);
	}
}	
function setProperties(obj,ppos){
	obj.pos2D = ppos;
	obj.velo2D = new Vector2D((Math.random()-0.5)*vx,(Math.random()-0.5)*vy);		
	obj.lifetime = minLife + (maxLife-minLife)*Math.random();	
	obj.age = 0;	
}	
function modifyObject(obj,i){		
	obj.alpha += -0.01;	
	obj.age += dt;
	if (obj.age > obj.lifetime){
		if (t < duration){
			explode(obj);
		}
		removeObject(i);
	}
}
function explode(obj){
	createNewParticles(obj.pos2D,0,255,0);
}	
function removeObject(num){
	particles.splice(num,1);	
}
function moveObject(obj){
	obj.pos2D = obj.pos2D.addScaled(obj.velo2D,dt);	
	obj.draw(context);	
}
function calcForce(obj){
	var gravity = Forces.constantGravity(m,g);	
	var drag = Forces.drag(k,obj.velo2D);
	force = Forces.add([gravity, drag]);				
}	
function updateAccel(){
	acc = force.multiply(1/m);
}	
function updateVelo(obj){
	obj.velo2D = obj.velo2D.addScaled(acc,dt);				
}