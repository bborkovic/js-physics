var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 
var canvas_bg = document.getElementById('canvas_bg');
var context_bg = canvas_bg.getContext('2d');

var ball;
var m = 1;
var g = 10;
var x0 = new Vector2D(50,550); // initial position of projectile
var u = new Vector2D(30,-100); // initial velocity of projectile
var oldpos; 	// needed for Standard Verlet scheme
var olddt;		// as above
var n = 0;		// as above
var t0, t, dt;
var force, acc;
var graph;
var animId;
var animTime = 20;

window.onload = init; 

function init() {
	ball = new Ball(10,'#0000ff',m,0,true);
	ball.pos2D = x0;
	ball.velo2D = u;	
	ball.draw(context);
	setupGraph();
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
	//EulerExplicit(ball);
	//EulerSemiImplicit(ball);
	//EulerSemiImplicit2(ball);
	//RK2(ball);
	//RK4(ball);			
	PositionVerlet(ball);
	//VelocityVerlet(ball);	
	context.clearRect(0, 0, canvas.width, canvas.height);
	ball.draw(context);	
	plotGraph(ball);
}
function calcForce(pos,vel){
	force = Forces.constantGravity(m,g);	
}	
function getAcc(pos,vel){
	calcForce(pos,vel);
	return force.multiply(1/m);
}	
function EulerExplicit(obj){			
	acc = getAcc(obj.pos2D,obj.velo2D); 
	obj.pos2D = obj.pos2D.addScaled(obj.velo2D,dt);
	obj.velo2D = obj.velo2D.addScaled(acc,dt);			
}
function EulerSemiImplicit(obj){			
	acc = getAcc(obj.pos2D,obj.velo2D); 
	obj.velo2D = obj.velo2D.addScaled(acc,dt);			
	obj.pos2D = obj.pos2D.addScaled(obj.velo2D,dt);			
}
function EulerSemiImplicit2(obj){			
	obj.pos2D = obj.pos2D.addScaled(obj.velo2D,dt);					
	acc = getAcc(obj.pos2D,obj.velo2D); 
	obj.velo2D = obj.velo2D.addScaled(acc,dt);			
}		
function PositionVerlet(obj){		
	if (dt==0){dt=0.02;};				
	var temp = obj.pos2D; // store current position in temp variable
	if (n==0){ // initialize old position and old timestep
		acc = getAcc(obj.pos2D,obj.velo2D); 
//		oldpos = obj.pos2D.addScaled(obj.velo2D,-dt).addScaled(acc,dt*dt/2);				
		oldpos = obj.pos2D.addScaled(obj.velo2D,-dt);
		olddt = dt;
	}
	acc = getAcc(obj.pos2D,obj.velo2D); // acceleration based on current pos and velo
	obj.pos2D = obj.pos2D.addScaled(obj.pos2D.subtract(oldpos),dt/olddt).addScaled(acc,dt*dt); // update pos
	//obj.pos2D = obj.pos2D.add(obj.pos2D).subtract(oldpos).addScaled(acc,dt*dt); // without time correction
	obj.velo2D = (obj.pos2D.subtract(oldpos)).multiply(0.5/dt);	// estimate new velocity					
	oldpos = temp; // store pos before update; will be pos at previous timestep next time
	olddt = dt;
	n++;
}
function VelocityVerlet(obj){			
	acc = getAcc(obj.pos2D,obj.velo2D); // acceleration based on current pos and velo
	var accPrev = acc; // save for velo update calculation
	obj.pos2D = obj.pos2D.addScaled(obj.velo2D,dt).addScaled(acc,dt*dt/2); // update pos
	acc = getAcc(obj.pos2D,obj.velo2D); // acceleration based on updated pos; note assume force does not depend explicitly on velo
	obj.velo2D = obj.velo2D.addScaled(acc.add(accPrev),dt/2);	//update velocity		
}		
function RK2(obj){			
	// step 1
	var pos1 = obj.pos2D;
	var vel1 = obj.velo2D;
	var acc1 = getAcc(pos1,vel1); 
	// step 2
	var pos2 = pos1.addScaled(vel1,dt); 
	var vel2 = vel1.addScaled(acc1,dt);
	var acc2 = getAcc(pos2,vel2); 
	// update particle pos and velo
	obj.pos2D = pos1.addScaled(vel1.add(vel2),dt/2);
	obj.velo2D = vel1.addScaled(acc1.add(acc2),dt/2);			
	//acc = acc1.add(acc2).multiply(1/2); 			 
}
function RK4(obj){			
	// step 1
	var pos1 = obj.pos2D;
	var vel1 = obj.velo2D;
	var acc1 = getAcc(pos1,vel1); 
	// step 2
	var pos2 = pos1.addScaled(vel1,dt/2); 
	var vel2 = vel1.addScaled(acc1,dt/2);
	var acc2 = getAcc(pos2,vel2); 
	// step 3
	var pos3 = pos1.addScaled(vel2,dt/2); 
	var vel3 = vel1.addScaled(acc2,dt/2);
	var acc3 = getAcc(pos3,vel3); 
	// step 4
	var pos4 = pos1.addScaled(vel3,dt); 
	var vel4 = vel1.addScaled(acc3,dt);
	var acc4 = getAcc(pos4,vel4); 
	// sum vel and acc
	var velsum = vel1.addScaled(vel2,2).addScaled(vel3,2).add(vel4);
	var accsum = acc1.addScaled(acc2,2).addScaled(acc3,2).add(acc4);
	// update particle pos and velo
	obj.pos2D = pos1.addScaled(velsum,dt/6);
	obj.velo2D = vel1.addScaled(accsum,dt/6);			
	//acc = accsum.multiply(1/6);
}
function setupGraph(){
	//graph= new Graph(context,xmin,xmax,ymin,ymax,xorig,yorig,xwidth,ywidth);	
	graph = new Graph(context_bg,0,canvas.width,0,canvas.height,0,0,canvas.width,canvas.height);						
}
function plotGraph(obj){
	graph.plot([obj.x], [-obj.y], '#333333', false, true);
	graph.plot([x0.x+u.x*t], [-(x0.y+u.y*t+0.5*g*t*t)], '#ff0000', false, true);
}
function stop(){
	cancelAnimationFrame(animId);
}
