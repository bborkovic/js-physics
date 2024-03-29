var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 
var canvas_bg = document.getElementById('canvas_bg');
var context_bg = canvas_bg.getContext('2d');

var center = new Vector2D(canvas.width/2,canvas.height/2);
var car;
var mass = 90; // car mass
var g = 10;
var Cs = 1;
var angle = 0;
var omega;
var t0,dt;
var acc, force;

window.onload = init; 

function init() {			
	// create a circular track, e.g. a roundabout
	context_bg.fillStyle = '#cccccc';
	context_bg.beginPath();
	context_bg.arc(canvas.width/2, canvas.height/2, 100, 0, 2*Math.PI, true);
	context_bg.closePath();
	context_bg.fill();	
	context_bg.fillStyle = '#ffffff';
	context_bg.beginPath();
	context_bg.arc(canvas.width/2, canvas.height/2, 50, 0, 2*Math.PI, true);	
	context_bg.closePath();
	context_bg.fill();		
	// create a car
	car = new Box(10,20,'#0000ff',mass);
	car.pos2D = new Vector2D(center.x+75,center.y);
	car.velo2D = new Vector2D(0,-10);
	car.angVelo = -car.velo2D.length()/(car.pos2D.subtract(center).length());
	omega = car.angVelo;
	car.draw(context);	
	// make the car move
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
	moveObject(car);
	calcForce();
	updateAccel();
	updateVelo(car);
}

function moveObject(obj){
	obj.pos2D = obj.pos2D.addScaled(obj.velo2D,dt);	
	angle += omega*dt;
	context.clearRect(0, 0, canvas.width, canvas.height);
	rotateObject(obj);	
}
function rotateObject(obj){
	context.save();
	context.translate(obj.x,obj.y);
	context.rotate(angle);
	context.translate(-obj.x,-obj.y);
	obj.draw(context);
	context.restore();	
}
function calcForce(){
	var dist = car.pos2D.subtract(center);
	var velo = car.velo2D.length();
	var centripetalForce = dist.unit().multiply(-mass*velo*velo/dist.length());
	var radialFriction = dist.unit().multiply(-Cs*mass*g);
	if(radialFriction.length() > centripetalForce.length()) { 
		force = centripetalForce;
	}
	else{
		force = radialFriction;
	}
}	
function updateAccel(){
	acc = force.multiply(1/mass);
}	
function updateVelo(obj){
	obj.velo2D = obj.velo2D.addScaled(acc,dt);				
}
