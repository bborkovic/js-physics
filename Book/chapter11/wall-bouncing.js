var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 
var canvas_bg = document.getElementById('canvas_bg');
var context_bg = canvas_bg.getContext('2d');

var ball;
var wallX = 400;
var t0, dt;

window.onload = init; 

function init() {
	// create a ball
	ball = new Ball(15,'#000000',1,0,false);
	ball.pos2D = new Vector2D(100,100);	
	ball.velo2D = new Vector2D(200,50);	
	ball.draw(context);
	// create a wall		
	context_bg.strokeStyle = '#333333';
	context_bg.beginPath();		
	context_bg.moveTo(wallX,50);
	context_bg.lineTo(wallX,350);
	context_bg.closePath();		
	context_bg.stroke();	
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
	moveObject(ball);
	checkBounce(ball);
}
function moveObject(obj){
	obj.pos2D = obj.pos2D.addScaled(obj.velo2D,dt);	
	context.clearRect(0, 0, canvas.width, canvas.height);
	obj.draw(context);	
}	
function checkBounce(obj){
	if (obj.x > wallX - obj.radius){
		obj.x = wallX - obj.radius; 
		obj.vx *= -1;
	}	
}
