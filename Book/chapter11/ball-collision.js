var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 

var ball1, ball2;
var t0, dt;

window.onload = init; 

function init() {
	// create a ball
	ball1 = new Ball(15,'#ff0000',1,0,true);
	ball1.pos2D = new Vector2D(0,200);	
	ball1.velo2D = new Vector2D(250,0);	
//	ball1.velo2D = new Vector2D(100,-30);	
	ball1.draw(context);
	ball2 = new Ball(75,'#0000ff',125,0,true);
//	ball2 = new Ball(15,'#0000ff',1,0,true);	
	ball2.pos2D = new Vector2D(300,200);	
	ball2.velo2D = new Vector2D(50,0);	
//	ball2.velo2D = new Vector2D(-50,-30);	
	ball2.draw(context);
	// make the ball move
	t0 = new Date().getTime(); 
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
	move();
}
function move(){		
	context.clearRect(0, 0, canvas.width, canvas.height);	
	moveObject(ball1);
	moveObject(ball2);	
	checkCollision();
}
function moveObject(obj){
	obj.pos2D = obj.pos2D.addScaled(obj.velo2D,dt);	
	obj.draw(context);	
}	
function checkCollision(){
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
