var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 

var jumper;
var fixedPoint;
var displ = new Vector2D(0,0);
var center = new Vector2D(0.5*canvas.width,50);
var mass = 90;
var g = 20;
var kDamping = 0.02;
var kSpring = 25;
var cordLength = 100;
var t0, dt;
var acc, force;
var animId;

window.onload = init; 

function init() {
	// create a bungee jumper
	jumper = new StickMan();
	jumper.mass = mass;
	jumper.pos2D = center;	
	//jumper.pos2D = new Vector2D(300,50);	
	jumper.draw(context);
	// create a fixedPoint		
	fixedPoint = new Ball(2,'#000000');
	fixedPoint.pos2D = center;
	fixedPoint.draw(context);	
	// make the ball move
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
	context.clearRect(0, 0, canvas.width, canvas.height);
	drawSpring(jumper);		
	moveObject(jumper);
	calcForce(jumper);
	updateAccel();
	updateVelo(jumper);
}

function drawSpring(obj){
	fixedPoint.draw(context);
	context.save();
	if (displ.length() > cordLength){				
		context.lineStyle = '#999999';
		context.lineWidth = 2;
	}else{
		context.lineStyle = '#cccccc';
		context.lineWidth = 1;
	}
	context.moveTo(center.x,center.y);
	context.lineTo(obj.x,obj.y);
	context.stroke();
	context.restore();
}

function moveObject(obj){
	obj.pos2D = obj.pos2D.addScaled(obj.velo2D,dt);	
	obj.draw(context);	
}
function calcForce(obj){
    displ = obj.pos2D.subtract(center);
	var gravity = Forces.constantGravity(mass,g);
	var damping = Forces.drag(kDamping,obj.velo2D);	
	var extension = displ.subtract(displ.unit().multiply(cordLength));
	var restoring;
    if (displ.length() > cordLength) {  
		restoring = Forces.spring(kSpring,extension);
	}else{
		restoring = new Vector2D(0,0);
	}
	force = Forces.add([gravity, damping, restoring]);	
}	
function updateAccel(){
	acc = force.multiply(1/mass);
}	
function updateVelo(obj){
	obj.velo2D = obj.velo2D.addScaled(acc,dt);				
}
