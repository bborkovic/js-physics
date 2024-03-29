var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 

var ball;
var t;
var t0;
var dt;
var animId;
var force;
var acc;	
var g = 10;
var k = 0.1;
var animTime = 10; // duration of animation

window.onload = init; 

function init() {
	ball = new Ball(15,'#0000ff',1,0,true);
	ball.pos2D = new Vector2D(50,400);
	ball.velo2D = new Vector2D(60,-60);
	ball.draw(context);
	t0 = new Date().getTime(); 
	t = 0;
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
	t += dt;
	if (t < animTime){
		move();
	}else{
		stop();
	}
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
	var drag = Forces.linearDrag(k,ball.velo2D);
	//force = gravity;
	//force = drag
	force = Forces.add([gravity, drag]);	
}	
function updateAccel(){
	acc = force.multiply(1/ball.mass);
}	
function updateVelo(){
	ball.velo2D = ball.velo2D.addScaled(acc,dt);				
}

