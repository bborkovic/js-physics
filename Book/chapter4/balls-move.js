var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 

var balls;
var t;
var t0;
var dt;
var animId;
var animTime = 10; // duration of animation
var numBalls = 10;

window.onload = init; 

function init() {
	balls = new Array();
	for (var i=0; i<numBalls; i++){
		var radius = (Math.random()+0.5)*20;
		var ball = new Ball(radius,'#0000ff',1,0,true);	
		ball.pos2D = new Vector2D(canvas.width/2,canvas.height/2);
		ball.velo2D = new Vector2D((Math.random()-0.5)*20,(Math.random()-0.5)*20);
		ball.draw(context);
		balls.push(ball);
	}  
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
	t += dt;
	//console.log(dt,t,t0,animTime);
	if (t < animTime){
		move();
	}else{
		stop();
	}
}
function move(){
	context.clearRect(0, 0, canvas.width, canvas.height);
	for (var i=0; i<numBalls; i++){
		var ball = balls[i];	
		ball.pos2D = ball.pos2D.addScaled(ball.velo2D,dt);	
		ball.draw(context);
	}
}
function stop(){
	cancelAnimationFrame(animId);
}
