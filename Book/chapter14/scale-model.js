var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 
var canvas_bg = document.getElementById('canvas_bg');
var context_bg = canvas_bg.getContext('2d');

var ball;
var wall;
var g = 400;
var mass = 1; // ball mass
var radius = 4; // ball radius
var width = 200; // building width
var height = 200; // building height
var buildingTop = 100; // top of building
var ground = height + buildingTop; // ground location
var acc, force;	
var t0, dt;
var animId;

window.onload = init; 

function init() {
	// create a ball
	ball = new Ball(radius,'#000000',mass);
	ball.pos2D = new Vector2D(300,buildingTop-radius);	
	ball.draw(context);
	// create a building
	context_bg.fillStyle = '#000000';
	context_bg.fillRect(50,buildingTop,width,height);
	// create ground	
	context_bg.strokeStyle = '#000000';
	context_bg.lineWidth = 2;
	context_bg.beginPath() ;
	context_bg.moveTo(0,ground);
	context_bg.lineTo(canvas.width,ground);
	context_bg.stroke();
	// make the ball move
	t0 = new Date().getTime(); 
	animFrame();
}
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
	moveObject(ball);
	checkCollision(ball);
	calcForce();
	updateAccel();
	updateVelo(ball);	
}
function moveObject(obj){
	obj.pos2D = obj.pos2D.addScaled(obj.velo2D,dt);	
	context.clearRect(0, 0, canvas.width, canvas.height);
	obj.draw(context);	
}	
function checkCollision(obj){
	if (obj.y > ground - radius){
		stop();
	}	
}
function calcForce(){
	force = Forces.constantGravity(mass,g);		
}	
function updateAccel(){
	acc = force.multiply(1/mass);
}	
function updateVelo(obj){
	obj.velo2D = obj.velo2D.addScaled(acc,dt);	
}
function stop(){
	cancelAnimationFrame(animId);
}
