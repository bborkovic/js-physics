var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 
var canvas_bg = document.getElementById('canvas_bg');
var context_bg = canvas_bg.getContext('2d'); 

var balls;
var numBalls = 5;
var walls;
var vfac = 1;
var animId;
var t0, dt;

window.onload = init; 

function init() {
	balls = new Array();
	for(var i = 0; i < numBalls; i++){
		var radius = Math.random()*20 + 5;
		var mass = 0.01*Math.pow(radius,3);
		var ball = new Ball(radius,'#666600',mass,0,true);
		ball.pos2D = new Vector2D(Math.random()*(canvas.width-2*radius)+radius, Math.random()*(canvas.height-2*radius)+radius);
		ball.velo2D = new Vector2D(((Math.random()-0.5)*80),((Math.random()-0.5)*80));
		balls.push(ball);
		ball.draw(context);
	}		
	numBalls = balls.length;	
	walls = new Array();				
	var wall1 = new Wall(new Vector2D(canvas.width,0),new Vector2D(0,0));
    wall1.draw(context_bg);
	walls.push(wall1);
	var wall2 = new Wall(new Vector2D(canvas.width,canvas.height),new Vector2D(canvas.width,0));			
	wall2.draw(context_bg);
	walls.push(wall2);
	var wall3 = new Wall(new Vector2D(0,canvas.height),new Vector2D(canvas.width,canvas.height));
	wall3.draw(context_bg);
	walls.push(wall3);
	var wall4 = new Wall(new Vector2D(0,0),new Vector2D(0,canvas.height));
    wall4.draw(context_bg);
	walls.push(wall4);
	addEventListener('mousedown',onDown,false);
	initAnim();
}
function onDown(evt){
	addEventListener('mouseup',onUp,false);	
	var newBall = new Ball(1,'#666600',1,0,true);
	newBall.pos2D = new Vector2D(evt.clientX,evt.clientY);		
	newBall.velo2D = new Vector2D((Math.random()-0.5)*80,(Math.random()-0.5)*80);
	newBall.draw(context);
	balls.push(newBall);
	numBalls = balls.length;		
	addEventListener('mousemove',onMouseMove,false);
	stop();			
}
function onUp(evt){
	removeEventListener('mouseup',onUp,false);
	removeEventListener('mousemove',onMouseMove,false);
	initAnim();	
}		
function onMouseMove(evt){
	var dvec = new Vector2D(evt.clientX-balls[numBalls-1].x,evt.clientY-balls[numBalls-1].y);
	balls[numBalls-1].radius = dvec.length();			
	balls[numBalls-1].mass = 0.01*Math.pow(dvec.length(),3);	
	moveObject(balls[numBalls-1]);		
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
	context.clearRect(0, 0, canvas.width, canvas.height);	
	for (var i=0; i<numBalls; i++){
		var ball = balls[i];
		moveObject(ball);
	}	
	checkCollision();
}
function moveObject(obj){
	obj.pos2D = obj.pos2D.addScaled(obj.velo2D,dt);	
	obj.draw(context);	
}	
function stop(){
	cancelAnimationFrame(animId);
}
function checkCollision(){
	for (var i=0; i<balls.length; i++){
		var ball1 = balls[i];
		for(var j=i+1; j<balls.length; j++){
			var ball2 = balls[j];
			var dist = ball1.pos2D.subtract(ball2.pos2D);
			if (dist.length() < (ball1.radius + ball2.radius) ) {   			
				// normal velocity vectors just before the impact
				var normalVelo1 = ball1.velo2D.project(dist);
				var normalVelo2 = ball2.velo2D.project(dist);			
				// tangential velocity vectors
				var tangentVelo1 = ball1.velo2D.subtract(normalVelo1);
				var tangentVelo2 = ball2.velo2D.subtract(normalVelo2);
				// move particles so that they just touch	
				var L = ball1.radius + ball2.radius-dist.length();
				var vrel = normalVelo1.subtract(normalVelo2).length();
				ball1.pos2D = ball1.pos2D.addScaled(normalVelo1,-L/vrel);
				ball2.pos2D = ball2.pos2D.addScaled(normalVelo2,-L/vrel);				
				// normal velocity components after the impact
				var m1 = ball1.mass;
				var m2 = ball2.mass;
				var u1 = normalVelo1.projection(dist);
				var u2 = normalVelo2.projection(dist);			
				var v1 = ((m1-m2)*u1+2*m2*u2)/(m1+m2);
				var v2 = ((m2-m1)*u2+2*m1*u1)/(m1+m2);
				// normal velocity vectors after collision
				normalVelo1 = dist.para(v1);
				normalVelo2 = dist.para(v2);
				// final velocity vectors after collision
				ball1.velo2D = normalVelo1.add(tangentVelo1);
				ball2.velo2D = normalVelo2.add(tangentVelo2);
			}
		}	
		checkWallBounce(ball1);		
	}			
}
function checkWallBounce(obj){
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
		if ((dist.length() < obj.radius) &&  test){
			var angle = Vector2D.angleBetween(obj.velo2D, wdir);
			var normal = wall.normal;
			if (normal.dotProduct(obj.velo2D) > 0){
				normal.scaleBy(-1);
			}
			var deltaS = (obj.radius+dist.dotProduct(normal))/Math.sin(angle);
			var displ = obj.velo2D.para(deltaS);
			obj.pos2D = obj.pos2D.subtract(displ);			
			var normalVelo = obj.velo2D.project(dist);
			var tangentVelo = obj.velo2D.subtract(normalVelo);
			obj.velo2D = tangentVelo.addScaled(normalVelo,-vfac);			
			hasHitAWall = true;
		}	
	}
}
