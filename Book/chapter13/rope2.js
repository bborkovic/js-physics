var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 

var balls;
var support;
var center = new Vector2D(100,100);
var g = 10;
var kDamping = 20;
var kSpring = 500;
var springLength = 20;
var spacing = 20; // make close to spring length
var numBalls = 15;
var pull = false;
var pfac = 50; // factor setting magnitude of pull when mouse is pressed
var t0, dt;
var acc, force;
var animId;
var mouseX;
var mouseY;

window.onload = init; 

function init() {
	// create a support		
	support = new Ball(2,'#000000');
	support.pos2D = center;
	support.draw(context);	
	// create a bunch of balls
	balls = new Array();
	for (var i=0; i<numBalls; i++){
		var ball = new Ball(2,'#000000',10,0,true);	
		ball.pos2D = new Vector2D(support.x+spacing*(i+1),support.y);
		ball.draw(context);
		balls.push(ball);
	}  	
	addEventListener('mousedown',onDown,false);
	t0 = new Date().getTime(); 
	animFrame();
}
function onDown(evt){
	pull = true;
	mouseX = evt.clientX;
	mouseY = evt.clientY;	
	addEventListener('mousemove',onMouseMove,false);
	addEventListener('mouseup',onUp,false);						
}
function onMouseMove(evt){
	mouseX = evt.clientX;
	mouseY = evt.clientY;	
}
function onUp(evt){
	pull = false;
	removeEventListener('mousemove',onMouseMove,false);	
	removeEventListener('mouseup',onUp,false);
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
	drawSpring();		
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
	context.lineStyle = '#009999';
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
function moveObject(obj){
	obj.pos2D = obj.pos2D.addScaled(obj.velo2D,dt);	
	obj.draw(context);	
}
function calcForce(obj,num){
	var centerPrev;
	var centerNext;
	var veloPrev;
	var veloNext;	
	if (num > 0){
		centerPrev = balls[num-1].pos2D;
		veloPrev = balls[num-1].velo2D;		
	}else{
		centerPrev = center;
		veloPrev = new Vector2D(0,0);
	}
	if (num < balls.length-1){
		centerNext = balls[num+1].pos2D;
		veloNext = balls[num+1].velo2D;
	}else{
		centerNext = obj.pos2D;
		veloNext = obj.velo2D;		
	}
	var gravity = Forces.constantGravity(obj.mass,g);
	var velo = obj.velo2D.multiply(2).subtract(veloPrev).subtract(veloNext);
	var damping = Forces.damping(kDamping,velo);				
	var displPrev = obj.pos2D.subtract(centerPrev);
	var displNext = obj.pos2D.subtract(centerNext);			
	var extensionPrev = displPrev.subtract(displPrev.unit().multiply(springLength));
	var extensionNext = displNext.subtract(displNext.unit().multiply(springLength));	
	var restoringPrev = Forces.spring(kSpring,extensionPrev);
	var restoringNext = Forces.spring(kSpring,extensionNext);									
	force = Forces.add([gravity, damping, restoringPrev, restoringNext]);   
	if (num==balls.length-1){ // last particle
		if (pull==true){ // if mouse is pressed
			var fx = mouseX-obj.x; // x distance from mouse to last particle
			var fy = mouseY-obj.y; // y distance from mouse to last particle
			var pullForce = new Vector2D(pfac*fx,pfac*fy); // pull force in direction of mouse proportional to distance from particle
			force = Forces.add([damping, restoringPrev, restoringNext, pullForce]);
		}else{ // if mouse is not pressed hold last particle fixed
			force = new Vector2D(0,0);
			obj.velo2D = new Vector2D(0,0);
		}
	}	
	
	
}	
function updateAccel(mass){
	acc = force.multiply(1/mass);
}	
function updateVelo(obj){
	obj.velo2D = obj.velo2D.addScaled(acc,dt);				
}
