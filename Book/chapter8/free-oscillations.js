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
var graph;
var animTime = 20;

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
	graph = new Graph(context_bg,0,20,-250,250,50,300,600,300);					
	graph.drawgrid(5,1,50,50);			
	graph.drawaxes('t (s)','displacement (px)');	
}
function plotGraph(){
	graph.plot([t], [displ.x], '#ff0000', false, true);
	graph.plot([t], [displ.y], '#0000ff', false, true);
}
