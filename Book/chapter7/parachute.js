var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 
var canvas_bg = document.getElementById('canvas_bg');
var context_bg = canvas_bg.getContext('2d');

var ball;
var t;
var t0;
var dt;
var animId;
var graph;
var force;
var acc;	
var m = 1; // particle mass
var g = 10;
var k = 0.01;
var rho = 0.1;
var V = 1;
var linearFactor = 3;
var animTime = 50; // duration of animation

window.onload = init; 

function init() {
	ball = new Ball(20,'#0000ff',m);
	ball.pos2D = new Vector2D(650,50);
	ball.velo2D=new Vector2D(0,0);
	ball.draw(context);
	setupGraph();
	window.addEventListener('mousedown',openParachute,false);
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
	plotGraph();
}

function moveObject(){
	ball.pos2D = ball.pos2D.addScaled(ball.velo2D,dt);	
	context.clearRect(0, 0, canvas.width, canvas.height);
	ball.draw(context);	
}
function calcForce(){
	var gravity = Forces.constantGravity(m,g);
	var drag = Forces.drag(k,ball.velo2D);
	var upthrust = Forces.upthrust(rho,V,g);		
	force = Forces.add([gravity, upthrust, drag]);	
}	
function updateAccel(){
	acc = force.multiply(1/m);
}	
function updateVelo(){
	ball.velo2D = ball.velo2D.addScaled(acc,dt);				
}
function openParachute(evt){
	k *= linearFactor*linearFactor;
	ball.radius *= linearFactor;			
	window.removeEventListener('mousedown',openParachute,false);		
}		
function setupGraph(){
	//graph = new Graph(context,xmin,xmax,ymin,ymax,xorig,yorig,xwidth,ywidth);		
	graph = new Graph(context_bg,0,50,0,40,50,350,450,300);					
	graph.drawgrid(10,1,10,1);			
	graph.drawaxes('t (s)','vy (px/s)');		
}
function plotGraph(){			
	graph.plot([t], [ball.vy], '#ff0000', false, true);	
}		
function stop(){
	cancelAnimationFrame(animId);
}
