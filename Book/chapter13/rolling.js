var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 
var canvas_bg = document.getElementById('canvas_bg');
var context_bg = canvas_bg.getContext('2d');

var ball;
var r = 20; // radius of ball
var m = 1; // mass of ball
var g = 10; // acceleration due to gravity
var ck = 0.2; // coeff of kinetic friction
var cs = 0.25; // coeff of static friction
var vtol = 0.000001 // tolerance
// coordinates of end-points of inclined plane
var xtop = 50; var ytop = 150;
var xbot = 450; var ybot = 250;
var angle = Math.atan2(ybot-ytop,xbot-xtop); // angle of inclined plane
var acc, force;	
var alp, torque;
var t0, dt;
var animId;

window.onload = init; 

function init() {
	// create a ball
	ball = new BallRB(r,'#0000ff',m,0,true,true);
	ball.im = 0.4*m*r*r; // for solid sphere
	ball.pos2D = new Vector2D(50,130);	
	ball.velo2D = new Vector2D(0,0);	
	ball.draw(context);
	// create an inclined plane		
	context_bg.strokeStyle = '#333333';
	context_bg.beginPath();		
	context_bg.moveTo(xtop,ytop);
	context_bg.lineTo(xbot,ybot);
	context_bg.closePath();		
	context_bg.stroke();	
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
	dt = 0.001*(new Date().getTime() - t0);
	t0 = new Date().getTime();	
	t += dt;
	move();
}
function move(){			
	moveObject(ball);
	calcForce();
	updateAccel();
	updateVelo(ball);
}

function moveObject(obj){
	obj.pos2D = obj.pos2D.addScaled(obj.velo2D,dt);	
	obj.rotation = obj.angVelo*dt;	
	context.clearRect(0, 0, canvas.width, canvas.height);
	obj.draw(context);	
	if (obj.y > ybot-obj.radius){
		stop();
	}	
}
function calcForce(){
	var gravity = Forces.constantGravity(m,g);
	var normal = Vector2D.vector2D(m*g*Math.cos(angle),0.5*Math.PI-angle,false);
	var coeff;
/*
	if (ball.velo2D.length() < vtol){  // static friction
		coeff = Math.min(cs*normal.length(),m*g*Math.sin(angle)); 
	}else{  // kinetic friction
		coeff = ck*normal.length(); 
	}
*/	
	coeff = m*g*Math.sin(angle)/(1+m*r*r/ball.im);
	if (coeff > cs*normal.length()){
		coeff = ck*normal.length(); 
		//console.log("slipping");
	}	
	var friction = normal.perp(coeff);						
	force = Forces.add([gravity, normal, friction]);
	torque = r*friction.length();	
}	
function updateAccel(){
	acc = force.multiply(1/m);
	alp = torque/ball.im;
}	
function updateVelo(obj){
	obj.velo2D = obj.velo2D.addScaled(acc,dt);	
	obj.angVelo += alp*dt;		
}
function stop(){
	cancelAnimationFrame(animId);
}
