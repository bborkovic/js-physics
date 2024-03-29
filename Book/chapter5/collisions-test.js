var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 

var t0;
var dt;
var animId;
var radius = 15; // ball radius
var balls = new Array();

window.onload = init; 

function init() {
	makeBalls();
	t0 = new Date().getTime(); 
	animFrame();
};

function makeBalls(){	
	setupBall('#0000ff',new Vector2D(50,200),new Vector2D(30,0));		
	setupBall('#ff0000',new Vector2D(500,200),new Vector2D(-20,0));
	setupBall('#00ff00',new Vector2D(300,200),new Vector2D(10,0));
}
function setupBall(color,pos,velo){	
	var ball = new Ball(radius,color,1,0,true);
	ball.pos2D = pos;
	ball.velo2D = velo;			
	ball.draw(context);
	balls.push(ball);
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
	checkCollision();
	move();
}
function move(){
	context.clearRect(0, 0, canvas.width, canvas.height);
	for (var i=0; i<balls.length; i++){
		var ball = balls[i];	
		ball.pos2D = ball.pos2D.addScaled(ball.velo2D,dt);	
		ball.draw(context);
	}
}
function checkCollision(){
	for (var i=0; i<balls.length; i++){
		var ball1 = balls[i];
		for (var j=i+1; j<balls.length; j++){				
			var ball2 = balls[j];				
			if (Vector2D.distance(ball1.pos2D,ball2.pos2D)<=ball1.radius+ball2.radius){						
				var vtemp = ball1.velo2D;
				ball1.velo2D = ball2.velo2D;
				ball2.velo2D = vtemp;						
			}
		}
	}			
}
