var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 
var canvas_bg = document.getElementById('canvas_bg');
var context_bg = canvas_bg.getContext('2d');

var ball;
var displ;
var center = new Vector2D(0.5*canvas.width,0.5*canvas.height);
var m = 1;
var kSpring = 1;
var t0, dt;
var acc, force;
var animId;

window.onload = init; 

function init() {
	// create a ball
	ball = new Ball(15,'#0000cc',m,0,true);
	ball.pos2D = new Vector2D(100,50);	
	//ball.velo2D = new Vector2D(200,0);	
	ball.draw(context);
	// create an attractor		
	var attractor = new Ball(2,'#000000');
	attractor.pos2D = center;
	attractor.draw(context_bg);	
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
	moveObject(ball);
	calcForce();
	updateAccel();
	updateVelo(ball);
}

function moveObject(obj){
	obj.pos2D = obj.pos2D.addScaled(obj.velo2D,dt);	
	context.clearRect(0, 0, canvas.width, canvas.height);
	obj.draw(context);	
}
function calcForce(){
    displ = ball.pos2D.subtract(center);
	force = Forces.spring(kSpring,displ);		
}	
function updateAccel(){
	acc = force.multiply(1/m);
}	
function updateVelo(obj){
	obj.velo2D = obj.velo2D.addScaled(acc,dt);				
}
