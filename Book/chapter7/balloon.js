var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 
var canvas_bg = document.getElementById('canvas_bg');
var context_bg = canvas_bg.getContext('2d');

var balloon;
var force;
var acc;
var m = 1; // mass of balloon
var g = 10; // acceleration due to gravity
var rho = 1.2; // air density
var rhoP = 1.1;	// balloon density (initial value)	
var k = 0.01; // drag constant
var changeDensity = false; // Boolean parameter
var increment = 0; // amount by which to change density
var t0,dt;

window.onload = init; 

function init() {
	// create the background	
	var gLevel = 450;
	context_bg.fillStyle = '#669900';
	context_bg.fillRect(0,gLevel,canvas_bg.width,canvas_bg.height-gLevel);
	gradient = context_bg.createLinearGradient(0,0,0,gLevel);
	gradient.addColorStop(0,'#ffffff');
	gradient.addColorStop(1,'#3333ff');
	context_bg.fillStyle = gradient;	
	context_bg.fillRect(0,0,canvas_bg.width,gLevel);	
	// create a balloon
	balloon = new Ball(20,'#993300',m,0,true);
	balloon.pos2D = new Vector2D(0.5*canvas.width,gLevel);	
	balloon.velo2D = new Vector2D(0,0);	
	balloon.draw(context);
	// set up event listeners
	window.addEventListener('keydown',startChangeDensity,false);		
	window.addEventListener('keyup',stopChangeDensity,false);		
	// make the balloon move
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
	moveObject(balloon);
	changeBalloonDensity();
	calcForce();
	updateAccel();
	updateVelo(balloon);
}

function moveObject(obj){
	obj.pos2D = obj.pos2D.addScaled(obj.velo2D,dt);	
	context.clearRect(0, 0, canvas.width, canvas.height);
	obj.draw(context);	
}
function calcForce(){
	var gravity = Forces.constantGravity(m,g);
	var V = m/rhoP; // volume of air displaced		
	var upthrust = Forces.upthrust(rho,V,g);
	var drag = Forces.drag(k,balloon.velo2D);
	force = Forces.add([gravity, upthrust, drag]);		
	//force = Forces.add([gravity, upthrust]);			
}	
function updateAccel(){
	acc = force.multiply(1/m);
}	
function updateVelo(obj){
	obj.velo2D = obj.velo2D.addScaled(acc,dt);				
}
function startChangeDensity(evt){ 
	if (evt.keyCode==38){ // up arrow
		changeDensity = true;
		increment = 0.001;
	}
	if (evt.keyCode==40){ // down arrow
		changeDensity = true;
		increment = -0.001;
	}			
}
function stopChangeDensity(evt){ 
	changeDensity = false;
}
function changeBalloonDensity(){
	if (changeDensity){
		rhoP += increment;
	}
	console.log(rhoP/rho);
}
