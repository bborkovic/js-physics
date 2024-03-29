var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 

var balls;
var support;
var center = new Vector2D(0.5*canvas.width,50);
var g = 20;
var kDamping = 0.5;
var kSpring = 10;
var springLength = 50;
var numBalls = 6;
var t0, t, dt;
var acc, force;
var animId;

window.onload = init; 

function init() {
	// create a support		
	support = new Ball(2,'#000000');
	support.pos2D = center;
	support.draw(context);	
	// create a bunch of balls
	balls = new Array();
	for (var i=0; i<numBalls; i++){
		var ball = new Ball(15,'#0000ff',1,0,true);	
		ball.pos2D = new Vector2D(0.5*canvas.width,100+60*i);
		ball.pos2D = new Vector2D(0.5*canvas.width+60*i,100+60*i);
		ball.draw(context);
		balls.push(ball);
	}  	
	// make the balls move
	t0 = new Date().getTime(); 
	t = 0;
	animFrame();
};
function animFrame(){
	//animId = setTimeout(animFrame,1000/60);
	animId = requestAnimationFrame(animFrame,canvas);
	onTimer(); 
}
function onTimer(){
	var t1 = new Date().getTime(); 
	dt = 0.001*(t1-t0); 
	t0 = t1;
	if (dt>0.2) {dt=0;};	
	t += dt;
	move();
}
function move(){		
	context.clearRect(0, 0, canvas.width, canvas.height);
	drawSpring();	
	moveSupport();	
	for (var i=0; i<numBalls; i++){
		var ball = balls[i];	
		moveObject(ball);
		calcForce(ball,i);
		updateAccel(ball.mass);
		updateVelo(ball);				
	}	
	
}
function drawSpring(){
	support.draw(context);
	context.save();			
	context.lineStyle = '#999999';
	context.lineWidth = 2;
	context.moveTo(center.x,center.y);
	for (var i=0; i<numBalls; i++){ 
		var X = balls[i].x;
		var Y = balls[i].y;
		context.lineTo(X,Y);
	}
	context.stroke();
	context.restore();
}
function moveSupport(){
	support.x = 100*Math.sin(1.0*t)+0.5*canvas.width;	
	center = support.pos2D;
}
function moveObject(obj){
	obj.pos2D = obj.pos2D.addScaled(obj.velo2D,dt);	
	obj.draw(context);	
}
function calcForce(obj,num){
	var centerPrev;
	var centerNext;
	if (num > 0){
		centerPrev = balls[num-1].pos2D;
	}else{
		centerPrev = center;
	}
	if (num < balls.length-1){
		centerNext = balls[num+1].pos2D;
	}else{
		centerNext = obj.pos2D;
	}
	var gravity = Forces.constantGravity(obj.mass,g);
	var damping = Forces.damping(kDamping,obj.velo2D);				
	var displPrev = obj.pos2D.subtract(centerPrev);
	var displNext = obj.pos2D.subtract(centerNext);			
	var extensionPrev = displPrev.subtract(displPrev.unit().multiply(springLength));
	var extensionNext = displNext.subtract(displNext.unit().multiply(springLength));	
	var restoringPrev = Forces.spring(kSpring,extensionPrev);
	var restoringNext = Forces.spring(kSpring,extensionNext);									
	force = Forces.add([gravity, damping, restoringPrev, restoringNext]);    
}	
function updateAccel(mass){
	acc = force.multiply(1/mass);
}	
function updateVelo(obj){
	obj.velo2D = obj.velo2D.addScaled(acc,dt);				
}
