var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 
var canvas_bg = document.getElementById('canvas_bg');
var context_bg = canvas_bg.getContext('2d');

var car;
var t;
var t0;
var dt;
var animId;
var graph;
var force;
var acc;	
var g = 10;
var k = 0.5;
var animTime = 60; // duration of animation

var powerLossFactor=0.1;		
var powerApplied=50;
var ke;
var vmag;
var mass;			
var applyThrust=false;

window.onload = init; 

function init() {
	car = new Ball(15,'#000000',1,0,true);
	car.pos2D = new Vector2D(50,50);
	car.velo2D=new Vector2D(20,0);
	car.draw(context);
	
	mass = car.mass;
	vmag = car.velo2D.length();
	ke = 0.5*mass*vmag*vmag;			
	window.addEventListener('keydown',startThrust,false);		
	window.addEventListener('keyup',stopThrust,false);	
	setupGraphs();
	
	t0 = new Date().getTime(); 
	t = 0;
	animFrame();
};

function setupGraphs(){
	//graph = new Graph(context,xmin,xmax,ymin,ymax,xorig,yorig,xwidth,ywidth);	
	graph= new Graph(context_bg,0,60,0,50,100,550,600,400);					
	graph.drawgrid(5,1,5,1);			
	graph.drawaxes('time (s)','velocity (px/s)');			
}

function startThrust(evt){
	if (evt.keyCode==38){
		applyThrust = true;
	}				
}			
function stopThrust(){
	applyThrust = false;
}

function animFrame(){
	animId = requestAnimationFrame(animFrame,canvas);
	onTimer(); 
}
function onTimer(){
	var t1 = new Date().getTime(); 
	dt = 0.001*(t1-t0); 
	t0 = t1;
	if (dt>0.2) {dt=0;}; // fix for bug if user switches tabs	
	t += dt;
	//console.log(dt,t,t0,animTime);
	if (t < animTime){
		move();
	}else{
		stop();
	}
}
function move(){			
	moveObject();
	applyPower();
	updateVelo();
	plotGraphs();
}

function moveObject(){
	car.pos2D = car.pos2D.addScaled(car.velo2D,dt);	
	context.clearRect(0, 0, canvas.width, canvas.height);
	car.draw(context);	
}
function applyPower(){
	if (applyThrust){
		ke += powerApplied*dt;
	}
	ke -= powerLossFactor*vmag*vmag*dt;	
}	
function updateVelo(){
	vmag = Math.sqrt(2*ke/mass);
//	car.velo2D = new Vector2D(vmag,0);
	car.vx = vmag;	
}
function plotGraphs(){	
	graph.plot([t], [car.vx], '#ff0000', false, true);	
}		

function stop(){
	cancelAnimationFrame(animId);
}
