var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 
var canvas_fg = document.getElementById('canvas_fg');
var context_fg = canvas_fg.getContext('2d'); 

var ball;
var t0;
var dt;
var animId;
var force;
var acc;	
var g = 50;
var k = 0.01;
var rho = 1.5;
var V = 1;
var yLevel = 300;
var vfac = -0.8;

window.onload = init; 

function init() {
	// create a ball
	ball = new Ball(40,'#0000ff',1,0,true);
	ball.pos2D = new Vector2D(50,50);
	ball.velo2D = new Vector2D(40,-20);
	//ball.velo2D = new Vector2D(20,-60);	
	ball.draw(context);
	// create water
	context_fg.fillStyle = "rgba(0,255,255,0.5)";
	context_fg.fillRect(0,yLevel,canvas.width,canvas.height);
	// set up event listeners
	addEventListener('mousedown',onDown,false);
	addEventListener('mouseup',onUp,false);	
	// initialise time and animate
	initAnim();
};

function onDown(evt) {
	ball.velo2D = new Vector2D(0,0);
	ball.pos2D = new Vector2D(evt.clientX,evt.clientY);	
	moveObject();
	stop();
} 

function onUp(evt) {
	ball.velo2D = new Vector2D(evt.clientX-ball.x,evt.clientY-ball.y);
	initAnim();
} 

function initAnim(){
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
	moveObject();
	calcForce();
	updateAccel();
	updateVelo();
}
function stop(){
	cancelAnimationFrame(animId);
}

function moveObject(){
	ball.pos2D = ball.pos2D.addScaled(ball.velo2D,dt);	
	context.clearRect(0, 0, canvas.width, canvas.height);
	ball.draw(context);	
}
function calcForce(){
	//force = new Vector2D(0,ball.mass*g-k*ball.vy);
	var gravity = Forces.constantGravity(ball.mass,g);
	var rball = ball.radius;
	var xball = ball.x;				
	var yball = ball.y;			
	var dr = (yball-yLevel)/rball;
	var ratio; // volume fraction of object that is submerged
	if (dr <= -1){ // object completely out of water
		ratio = 0;
	}else if (dr < 1){ // object partially in water 			
		//ratio = 0.5 + 0.5*dr; // for cuboid
		ratio = 0.5 + 0.25*dr*(3-dr*dr); // for sphere
	}else{ // object completely in water
		ratio = 1;
	}
	var upthrust = new Vector2D(0,-rho*V*ratio*g);
	var drag = ball.velo2D.multiply(-ratio*k*ball.velo2D.length());
	force = Forces.add([gravity, upthrust, drag]);	
	//force = Forces.add([gravity, upthrust]);	
	if (xball < rball){
		ball.xpos = rball;
		ball.vx *= vfac;				
	}
	if (xball > canvas.width - rball){
		ball.xpos = canvas.width - rball;
		ball.vx *= vfac;				
	}			
}	
function updateAccel(){
	acc = force.multiply(1/ball.mass);
}	
function updateVelo(){
	ball.velo2D = ball.velo2D.addScaled(acc,dt);				
}

