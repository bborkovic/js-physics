var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 
var canvas_bg = document.getElementById('canvas_bg');
var context_bg = canvas_bg.getContext('2d');

var ball;
var displ;
var center = new Vector2D(0.5*canvas.width,50);
var m = 1;
var kSpring = 1;
var t0, t, dt;
var acc, force;
var animId;
var graphX;
var graphY;
var animTime = 20;
var omega;
var A;
var B;

window.onload = init; 

function init() {
	// create a ball
	ball = new Ball(15,'#0000cc',m,0,true);
	ball.pos2D = new Vector2D(100,50);	
	ball.velo2D = new Vector2D(0,50);	
	ball.draw(context);
	// create an attractor		
	var attractor = new Ball(2,'#000000');
	attractor.pos2D = center;
	attractor.draw(context_bg);	
	// for analytical solution
	omega = Math.sqrt(kSpring/m);
	A = ball.pos2D.subtract(center);
	B = ball.velo2D.multiply(1/omega);	
	// set up graph
	setupGraph();
	// make the ball move
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
	moveObject(ball);
	calcForce();
	updateAccel();
	updateVelo(ball);
	plotGraph();	
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
function stop(){
	cancelAnimationFrame(animId);
}
function setupGraph(){
	//graph= new Graph(context,xmin,xmax,ymin,ymax,xorig,yorig,xwidth,ywidth);	
	graphX = new Graph(context_bg,0,20,-250,250,50,200,600,125);					
	graphX.drawgrid(5,1,250,50);			
	graphX.drawaxes('t (s)','x displacement (px)');
	graphY = new Graph(context_bg,0,20,-250,250,50,400,600,125);					
	graphY.drawgrid(5,1,250,50);			
	graphY.drawaxes('t (s)','y displacement (px)');	
}
function plotGraph(){
	graphX.plot([t], [displ.x], '#ff0000', false, true);
	graphY.plot([t], [displ.y], '#0000ff', false, true);
	var r = A.multiply(Math.cos(omega*t)).add(B.multiply(Math.sin(omega*t)));			
	graphX.plot([t], [r.x], '#00ff00', false, true);
	graphY.plot([t], [r.y], '#ff00ff', false, true);		
}
