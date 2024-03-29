var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 
var canvas_bg = document.getElementById('canvas_bg');
var context_bg = canvas_bg.getContext('2d');

var ball;
var wall;
var m = 1;
var g = 100;
var vfac = 0.6;
var t0;
var dt;
var force;
var acc;
var animId;

window.onload = init; 

function init() {
	// create a ball
	ball = new Ball(15,'#0000ff',m,0,true);
	ball.pos2D = new Vector2D(100,50);	
	ball.draw(context);
	// create a wall		
	wall = new Wall(new Vector2D(50,200),new Vector2D(700,500));	
	wall.draw(context_bg);
	// check which side of the wall the ball is
	checkSide();
	// set up event listener	
	addEventListener('mousedown',onDown,false);
	// make the ball move
	initAnim();
}
function checkSide(){
    var wdir = wall.dir;			   
	var ballp1 = wall.p1.subtract(ball.pos2D);
	var proj1 = ballp1.projection(wdir);                
	var dist = ballp1.addScaled(wdir.unit(), proj1*(-1));   
	setSide(dist);
}		
function setSide(dist){
	if (dist.dotProduct(wall.normal) > 0){
		wall.side = 1;
	}else{
		wall.side = -1;
	}
}	
function onDown(evt){
	ball.velo2D = new Vector2D(0,0);
	addEventListener('mouseup',onUp,false);	
	ball.radius = 1;		
	ball.pos2D = new Vector2D(evt.clientX,evt.clientY);	
	addEventListener('mousemove',onMouseMove,false);
	stop();			
}
function onUp(evt){
	removeEventListener('mouseup',onUp,false);
	removeEventListener('mousemove',onMouseMove,false);
	checkSide();
	initAnim();		
}		
function onMouseMove(evt){
	var dvec = new Vector2D(evt.clientX-ball.x,evt.clientY-ball.y);
	ball.radius = dvec.length();
	moveObject(ball);	
}
function initAnim(){
	t0 = new Date().getTime(); 
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
	move();
}
function move(){			
	moveObject(ball);
	checkBounce(ball);
	calcForce();
	updateAccel();
	updateVelo(ball);	
}
function moveObject(obj){
	obj.pos2D = obj.pos2D.addScaled(obj.velo2D,dt);	
	context.clearRect(0, 0, canvas.width, canvas.height);
	obj.draw(context);	
}	
function checkBounce(obj){
	// vector along wall
	var wdir = wall.dir;
	// vectors from ball to endpoints of wall
	var ballp1 = wall.p1.subtract(obj.pos2D);
	var ballp2 = wall.p2.subtract(obj.pos2D);
	// projection of above vectors onto wall vector
	var proj1 = ballp1.projection(wdir);                
	var proj2 = ballp2.projection(wdir);
	// perpendicular distance vector from the object to the wall
	var dist = ballp1.addScaled(wdir.unit(), proj1*(-1));
	// collision detection
	var test = ((Math.abs(proj1) < wdir.length()) && (Math.abs(proj2) < wdir.length()));
	// test tunneling
	var testTunneling;				
	if (wall.side*dist.dotProduct(wall.normal) < 0){
		testTunneling = true;
	}else{
		testTunneling = false;
	}	
	setSide(dist);
	if (( (dist.length() < obj.radius) || (testTunneling) ) &&  test){
		// angle between velocity and wall
		var angle = Vector2D.angleBetween(obj.velo2D, wdir);
		// reposition object
		var normal = wall.normal;
		if (normal.dotProduct(obj.velo2D) > 0){
			normal.scaleBy(-1);
		}
		var deltaS = (obj.radius+dist.dotProduct(normal))/Math.sin(angle);
		var displ = obj.velo2D.para(deltaS);
		obj.pos2D = obj.pos2D.subtract(displ);			
		// velocity correction factor
		var vcor = 1-acc.dotProduct(displ)/obj.velo2D.lengthSquared();
		// corrected velocity vector just before impact 
		var Velo = obj.velo2D.multiply(vcor);
		// velocity vector component perpendicular to wall just before impact
		var normalVelo = dist.para(Velo.projection(dist));
		// velocity vector component parallel to wall; unchanged by impact
		var tangentVelo = Velo.subtract(normalVelo);
		// velocity vector component perpendicular to wall just after impact
		obj.velo2D = tangentVelo.addScaled(normalVelo,-vfac);
	}
	// collision at the wall boundaries
	else if (Math.abs(ballp1.length()) < obj.radius){
		bounceOffEndpoint(obj,wall.p1);
	}
	else if (Math.abs(ballp2.length()) < obj.radius){
		bounceOffEndpoint(obj,wall.p2);
	}	
	if (testTunneling){
		wall.side *= -1;
	}
}
function bounceOffEndpoint(obj,pEndpoint){
	var distp = obj.pos2D.subtract(pEndpoint);
	// move particle so that it just touches the endpoint			
	var L = obj.radius-distp.length();
	var vrel = obj.velo2D.length();
	obj.pos2D = obj.pos2D.addScaled(obj.velo2D,-L/vrel);
	// normal velocity vector just before the impact
	var normalVelo = obj.velo2D.project(distp);
	// tangential velocity vector
	var tangentVelo = obj.velo2D.subtract(normalVelo);
	// normal velocity vector after collision
	normalVelo.scaleBy(-vfac);
	// final velocity vector after collision
	obj.velo2D = normalVelo.add(tangentVelo);			
}
function calcForce(){
	force = Forces.constantGravity(m,g);		
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
