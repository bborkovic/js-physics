var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 
var canvas_bg = document.getElementById('canvas_bg');
var context_bg = canvas_bg.getContext('2d');

var plane;
var m = 1; 
var g = 10; 
var kDrag = 0.01;
var kLift = 0.5;		
var magThrust = 5;
var groundLevel = 550; 
var t0,dt;

window.onload = init; 

function init() {
	makeBackground();
	makePlane();
	t0 = new Date().getTime();
	animFrame();
};

function makeBackground(){
	var horizon = 500; 
	// the runway	
	context_bg.fillStyle = '#999999';
	context_bg.fillRect(0,horizon,canvas_bg.width,canvas_bg.height-horizon);
	context_bg.strokeStyle = '#ffffff';
	context_bg.beginPath();
	context_bg.moveTo(0,550);
	context_bg.lineTo(canvas_bg.width,550);
	context_bg.closePath();	
	context_bg.stroke();	
	// the sky
	gradient = context_bg.createLinearGradient(0,0,0,horizon);
	gradient.addColorStop(0,'#ffffff');
	gradient.addColorStop(1,'#0066ff');
	context_bg.fillStyle = gradient;	
	context_bg.fillRect(0,0,canvas_bg.width,horizon);	
}
function makePlane(){
	plane = new Plane(50,8,'#333399',m);
	plane.pos2D = new Vector2D(50,groundLevel-plane.height);	
	plane.velo2D = new Vector2D(0,0);	
	plane.draw(context);
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
	moveObject(plane);
	calcForce();
	updateAccel();
	updateVelo(plane);
}

function moveObject(obj){
	obj.pos2D = obj.pos2D.addScaled(obj.velo2D,dt);	
	context.clearRect(0, 0, canvas.width, canvas.height);
	obj.draw(context);	
}
function calcForce(){
	var gravity = Forces.constantGravity(m,g);
	var velX = new Vector2D(plane.vx,0);
	var drag = Forces.drag(kDrag,velX);
	var lift = Forces.lift(kLift,velX);
	var thrust = new Vector2D(magThrust,0);
	var normal;
	if (plane.y >= groundLevel-plane.height){
		normal = gravity.multiply(-1);
	}else{
		normal = new Vector2D(0,0);
	}
	force = Forces.add([gravity, drag, lift, thrust, normal]);				
}	
function updateAccel(){
	acc = force.multiply(1/m);
}	
function updateVelo(obj){
	obj.velo2D = obj.velo2D.addScaled(acc,dt);				
}

