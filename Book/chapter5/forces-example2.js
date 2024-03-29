var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 
var canvas_bg = document.getElementById('canvas_bg');
var context_bg = canvas_bg.getContext('2d');

var ball;
var t;
var t0;
var dt;
var animId;
var graphDisp;
var graphVelo;
var force;
var acc;	
var y0 = 20; // initial particle vertical position
var m = 1; // particle mass
var g = 10;
var k = 0.5;
var animTime = 25; // duration of animation

window.onload = init; 

function init() {
	ball = new Ball(15,'#000000',m,0,true);
	ball.pos2D = new Vector2D(75,y0);
	ball.velo2D=new Vector2D(0,0);
	ball.draw(context);
	setupGraphs();
	t0 = new Date().getTime(); 
	t = 0;
	animFrame();
};

function setupGraphs(){
	//graph = new Graph(context,xmin,xmax,ymin,ymax,xorig,yorig,xwidth,ywidth);	
	graphDisp= new Graph(context_bg,0,30,0,500,150,300,600,250);					
	graphDisp.drawgrid(5,1,100,20);			
	graphDisp.drawaxes('time (s)','displacement (px)');		
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
	if (dt>0.2) {dt=0;};	
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
	//force = new Vector2D(0,m*g-k*ball.vy);
	var gravity = Forces.constantGravity(m,g);
	var drag = Forces.linearDrag(k,ball.velo2D);
	force = Forces.add([gravity, drag]);	
}	
function updateAccel(){
	acc = force.multiply(1/m);
}	
function updateVelo(){
	ball.velo2D = ball.velo2D.addScaled(acc,dt);				
}
function plotGraphs(){			
	graphDisp.plot([t], [ball.y-y0], '#ff0000');			
	graphDisp.plot([t], [m*g/k*(t+m/k*Math.exp(-k/m*t)-m/k)], '#0000ff');
	graphVelo.plot([t], [ball.vy], '#ff0000');			
	graphVelo.plot([t], [m*g/k*(1-Math.exp(-k/m*t))], '#0000ff');	
}		

function stop(){
	cancelAnimationFrame(animId);
}
