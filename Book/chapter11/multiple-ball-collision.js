var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 

var balls;
var numBalls = 9;
var t0, dt;

window.onload = init; 

function init() {
	var center = new Vector2D(canvas.width/2,canvas.height/2);
	balls = new Array();
	for(var i = 0; i < numBalls; i++){
		var ball = new Ball(15,'#0000ff',1,0,true);
		ball.pos2D = new Vector2D(Math.random()*canvas.width, Math.random()*canvas.height);
		ball.velo2D = center.subtract(ball.pos2D).multiply(0.2);
		balls.push(ball);
		ball.draw(context);
	}				
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
	}			
}
