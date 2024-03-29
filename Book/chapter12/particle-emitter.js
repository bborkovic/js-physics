var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 

var particles;
var maxParticles = 120;
var m = 1; 
var g = 20; 
var k = 0.003;
var vx = 60;
var vy = -80;
var i = 0; // only needed for fountain effect
var fps = 30; // controls rate of creation of particles
var t0,dt;
var acc, force;
var posEmitter;

window.onload = init; 

function init() {
	particles = new Array();
	posEmitter = new Vector2D(0.5*canvas.width,0.5*canvas.height);
	addEventListener('mousemove',onMouseMove,false);	
	t0 = new Date().getTime();
	animFrame();
}	
function onMouseMove(evt){
	posEmitter = new Vector2D(evt.clientX,evt.clientY);	
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
	move();
}
function move(){	
	context.clearRect(0, 0, canvas.width, canvas.height);	
	if (particles.length < maxParticles){
		createNewParticles(posEmitter);
	}else{		
		recycleParticles(posEmitter);	
	}
	for (var i=0; i<particles.length; i++){
		var particle = particles[i];			
		moveObject(particle);
		calcForce(particle);
		updateAccel();
		updateVelo(particle);				
	}	
}
function createNewParticles(ppos){
	var newParticle = new Ball(2);
	setPosVelo(newParticle,ppos);	
	particles.push(newParticle);
}
function recycleParticles(ppos){
	var firstParticle = particles[0];	
	firstParticle.color = '#ff0000';
	setPosVelo(firstParticle,ppos);			
	particles.shift();
	particles.push(firstParticle);
}
function setPosVelo(obj,pos){
	obj.pos2D = pos;
	obj.velo2D = new Vector2D((Math.random()-0.5)*vx,(Math.random()+0.5)*vy);		
/*	
	var n = i%7;
	var angle = -(60+10*n)*Math.PI/180;
	var mag = 100;
	obj.velo2D = Vector2D.vector2D(mag,angle);
	i++;		
*/			
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