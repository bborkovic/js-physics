var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 
var canvas_bg = document.getElementById('canvas_bg');
var context_bg = canvas_bg.getContext('2d');

var particle;
var center;
var t0, t, dt;
var acc, force;
var mass = 1;
var graph;
var animId;
var animTime = 1000;
//var k = -1;
//var n = 1;
//var k = -100000;
//var n = -2;
var k = -1000;
var n = -1;

window.onload = init; 

function init() {
	center = new Ball(2,'#000000');
	center.pos2D = new Vector2D(350,250);
	center.draw(context_bg);
	particle = new Ball(5,'#ff0000',mass,0,true);
	particle.pos2D = new Vector2D(150,250);	
	particle.velo2D = new Vector2D(0,-20);
	particle.draw(context);
	setupGraph();
	t0 = new Date().getTime(); 
	t = 0;
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
	t += dt;
	if (t < animTime){
		move();
	}else{
		stop();
	}
}
function move(){			
	moveObject(particle);
	calcForce();
	updateAccel();
	updateVelo(particle);
	plotGraph();	
}
function moveObject(obj){
	obj.pos2D = obj.pos2D.addScaled(obj.velo2D,dt);	
	context.clearRect(0, 0, canvas.width, canvas.height);
	obj.draw(context);	
}
function calcForce(){
	var r = particle.pos2D.subtract(center.pos2D);
	force = Forces.central(k,n,r);		
}	
function updateAccel(){
	acc = force.multiply(1/mass);
}	
function updateVelo(obj){
	obj.velo2D = obj.velo2D.addScaled(acc,dt);				
}		
function stop(){
	cancelAnimationFrame(animId);
}
function setupGraph(){
	//graph= new Graph(context,xmin,xmax,ymin,ymax,xorig,yorig,xwidth,ywidth);	
	graph = new Graph(context_bg,0,canvas.width,0,canvas.height,0,0,canvas.width,canvas.height);						
}
function plotGraph(){
	graph.plot([particle.x], [-particle.y], '#666666', false, true);
}
