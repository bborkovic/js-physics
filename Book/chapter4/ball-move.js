var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 

var ball;
var t;
var t0;
var dt;
var animId;
var animTime = 5; // duration of animation

window.onload = init; 

function init() {
	ball = new Ball(20,'#ff0000',1,0,true);
	ball.pos2D = new Vector2D(150,50);
	ball.velo2D=new Vector2D(30,20);
	ball.draw(context);
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
	ball.pos2D = ball.pos2D.addScaled(ball.velo2D,dt);	
	context.clearRect(0, 0, canvas.width, canvas.height);
	ball.draw(context);
}
function stop(){
	cancelAnimationFrame(animId);
}
