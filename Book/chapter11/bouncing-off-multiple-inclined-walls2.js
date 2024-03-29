var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 
var canvas_bg = document.getElementById('canvas_bg');
var context_bg = canvas_bg.getContext('2d');

var ball;
var walls;
var m = 1;
var g = 100;
//var vfac = 0.8;
var vfac = 1;
var t0;
var dt;
var force;
var acc;
var animId;

window.onload = init; 

function init() {
	// create a ball
	ball = new Ball(4,'#0000ff',m,0,true);
	ball.pos2D = new Vector2D(200,90);	
	ball.draw(context);
	// create the inclined walls - stored in an Array called walls
	walls = new Array();
    // wall 1
	var wall1=new Wall(new Vector2D(50,50),new Vector2D(550,50));
//	var wall1=new Wall(new Vector2D(550,50),new Vector2D(50,50));
	wall1.draw(context_bg);
	walls.push(wall1);
    // wall 2
	var wall2=new Wall(new Vector2D(550,50),new Vector2D(550,400));
//	var wall2=new Wall(new Vector2D(550,400),new Vector2D(550,50));			
    wall2.draw(context_bg);
	walls.push(wall2);
	// wall 3
	var wall3=new Wall(new Vector2D(50,400),new Vector2D(550,400));
	wall3.draw(context_bg);
	walls.push(wall3);
	// wall 4
	var wall4=new Wall(new Vector2D(50,50),new Vector2D(50,400));
    wall4.draw(context_bg);
	walls.push(wall4);
	// wall 5
	var wall5=new Wall(new Vector2D(100,100),new Vector2D(200,120));
    wall5.draw(context_bg);
	walls.push(wall5);
 	// wall 6
	var wall6=new Wall(new Vector2D(350,170),new Vector2D(450,140));
    wall6.draw(context_bg);
	walls.push(wall6);
	// wall 7
	var wall7=new Wall(new Vector2D(130,200),new Vector2D(260,300));
    wall7.draw(context_bg);
	walls.push(wall7);
	// wall 8
	var wall8=new Wall(new Vector2D(370,310),new Vector2D(470,280));
	wall8.draw(context_bg);
	walls.push(wall8);
	// check which side of the wall the ball is
	checkSide();
	//set up event listener	
	addEventListener('mousedown',onDown,false);
	// make the ball move
	initAnim();
}
function checkSide(){
	for (var i=0; (i<walls.length); i++){
		var wall = walls[i];	
		var wdir = wall.dir;			   
		var ballp1 = wall.p1.subtract(ball.pos2D);
		var proj1 = ballp1.projection(wdir);                
		var dist = ballp1.addScaled(wdir.unit(), proj1*(-1));   
		setSide(dist,wall);
	}
}		
function setSide(dist,wall){
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
	var hasHitAWall = false;
	for (var i=0; (i<walls.length && hasHitAWall==false); i++){
		var wall = walls[i];		
		var wdir = wall.dir;
		var ballp1 = wall.p1.subtract(obj.pos2D);
		var ballp2 = wall.p2.subtract(obj.pos2D);
		var proj1 = ballp1.projection(wdir);                
		var proj2 = ballp2.projection(wdir);
		var dist = ballp1.addScaled(wdir.unit(), proj1*(-1));
		var test = ((Math.abs(proj1) < wdir.length()) && (Math.abs(proj2) < wdir.length()));
		
		var testTunneling;				
		if (wall.side*dist.dotProduct(wall.normal) < 0){
			testTunneling = true;
		}else{
			testTunneling = false;
		}	
		setSide(dist,wall);		
		if (( (dist.length() < obj.radius) || (testTunneling) ) &&  test){
			var angle = Vector2D.angleBetween(obj.velo2D, wdir);
			var normal = wall.normal;
			if (normal.dotProduct(obj.velo2D) > 0){
				normal.scaleBy(-1);
			}
			var deltaS = (obj.radius+dist.dotProduct(normal))/Math.sin(angle);
			var displ = obj.velo2D.para(deltaS);
			obj.pos2D = obj.pos2D.subtract(displ);			
			var vcor = 1-acc.dotProduct(displ)/obj.velo2D.lengthSquared();
			var Velo = obj.velo2D.multiply(vcor);
			var normalVelo = dist.para(Velo.projection(dist));
			var tangentVelo = Velo.subtract(normalVelo);
			obj.velo2D = tangentVelo.addScaled(normalVelo,-vfac);
			if (testTunneling){
				wall.side *= -1;
			}
			hasHitAWall = true;
		}
		else if (Math.abs(ballp1.length()) < obj.radius){
			bounceOffEndpoint(obj,wall.p1);
			hasHitAWall = true;
		}
		else if (Math.abs(ballp2.length()) < obj.radius){
			bounceOffEndpoint(obj,wall.p2);
			hasHitAWall = true;
		}	
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
