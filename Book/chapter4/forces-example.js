var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 
var canvas_bg = document.getElementById('canvas_bg');
var context_bg = canvas_bg.getContext('2d');

var ball;
var t;
var t0;
var dt;
var animId;
var graphAcc;
var graphVelo;
var force;
var acc;	
var g = 10;
var k = 0.5;
var animTime = 30; // duration of animation

window.onload = init; 

function init() {
	ball = new Ball(15,'#000000',1,0,true);
	ball.pos2D = new Vector2D(75,20);
	ball.velo2D=new Vector2D(0,0);
	ball.draw(context);
	setupGraphs();
	t0 = new Date().getTime(); 
	t = 0;
	animFrame();
};

function setupGraphs(){
	//graph = new Graph(context,xmin,xmax,ymin,ymax,xorig,yorig,xwidth,ywidth);	
	graphAcc = new Graph(context_bg,0,30,0,10,150,250,600,200);					
	graphAcc.drawgrid(5,1,5,1);			
	graphAcc.drawaxes('time (s)','acceleration (px/s/s)');		
	graphVelo = new Graph(context_bg,0,30,0,25,150,550,600,200);					
	graphVelo.drawgrid(5,1,5,1);			
	graphVelo.drawaxes('time (s)','velocity (px/s)');		
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
	calcForce();
	updateAccel();
	updateVelo();
	plotGraphs();
}

function moveObject(){
	ball.pos2D = ball.pos2D.addScaled(ball.velo2D,dt);	
	context.clearRect(0, 0, canvas.width, canvas.height);
	ball.draw(context);	
}
function calcForce(){
	force = new Vector2D(0,ball.mass*g-k*ball.vy);
}	
function updateAccel(){
	acc = force.multiply(1/ball.mass);
}	
function updateVelo(){
	ball.velo2D = ball.velo2D.addScaled(acc,dt);				
}
function plotGraphs(){
	graphAcc.plot([t], [acc.y], '#ff0000', false, true);			
	graphVelo.plot([t], [ball.vy], '#ff0000', false, true);						
}		

function stop(){
	cancelAnimationFrame(animId);
}
