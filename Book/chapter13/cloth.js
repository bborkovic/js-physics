var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 

var balls;
var rows = 10;
var cols = 15;
var refPoint = new Vector2D(120,50);
var fixedPoints = new Array(0,70,140);
var g = 10;
var kDamping = 10;
var kSpring = 100;
var kWind = 10;
var windMag = 10;
var springLength = 20;
var spacing = 20; // make close to spring length
var w = 0;
var t0, dt;
var acc, force;
var animId;

window.onload = init; 

function init() {
	// create the masses
	balls = new Array();
	for (var i=0; i<cols*rows; i++){
		var ball = new Ball(2,'#000000',10,0,true);	
		var ncol = Math.floor(i/rows);
		ball.pos2D = new Vector2D(refPoint.x+ncol*spacing,refPoint.y+(i-ncol*rows-1)*spacing);
		ball.draw(context);
		balls.push(ball);
	}  	
	addEventListener('mousedown',onDown,false);
	t0 = new Date().getTime(); 
	animFrame();
}
function onDown(evt){
	w = windMag;
	addEventListener('mouseup',onUp,false);						
}
function onUp(evt){
	w = 0;
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
	for (var i=0; i<rows*cols; i++){
		var ball = balls[i];	
		moveObject(ball);
		calcForce(ball,i);
		updateAccel(ball.mass);
		updateVelo(ball);				
	}	
}
function drawSpring(){
	context.save();			
	context.lineStyle = '#009999';
	context.lineWidth = 2;
	for (var i=0; i<rows*cols; i++){ 
		var X = balls[i].x;
		var Y = balls[i].y;
		if((i-Math.floor(i/rows)*rows)==0) {
			context.moveTo(X,Y);
		}else{		
			context.lineTo(X,Y);
		}
	}
	for (i=0; i<(rows); i++){
		X = balls[i].x;
		Y = balls[i].y;
		context.moveTo(X,Y);
		for (var j=0; j<(cols); j++){
			X = balls[i+j*rows].x;
			Y = balls[i+j*rows].y;
			context.lineTo(X,Y);
		}
	}	
	context.stroke();
	context.restore();
}
function moveObject(obj){
	obj.pos2D = obj.pos2D.addScaled(obj.velo2D,dt);	
	obj.draw(context);	
}
function calcForce(obj,num){
	// variables to store positions and velocities of nearest neighbors
	var centerUp;
	var centerDown;
	var centerLeft;
	var centerRight;
	var veloUp;
	var veloDown;
	var veloLeft;
	var veloRight;			
	// position and velocity of particle above current particle			
	if ((num-Math.floor(num/rows)*rows) > 0){
		centerUp = balls[num-1].pos2D;
		veloUp = balls[num-1].velo2D;				
	}else{ // current particle is in first row, no particle above, just use current particle's position and velocity 
		centerUp = obj.pos2D;
		veloUp = obj.velo2D;				
	}
	// position and velocity of particle below current particle						
	if ( ((num+1)-Math.floor( (num+1)/rows) * rows) > 0){
		centerDown = balls[num+1].pos2D;
		veloDown = balls[num+1].velo2D;				
	}else{ // current particle is in last row, no particle below, just use current particle's position and velocity 
		centerDown = obj.pos2D;
		veloDown= obj.velo2D;				
	}
	// position and velocity of particle to the left of current particle			
	if (num > (rows-1) ){
		centerLeft = balls[num-rows].pos2D;
		veloLeft = balls[num-rows].velo2D;
	}else{ // current particle is in first column, no particle to the left, just use current particle's position and velocity 
		centerLeft = obj.pos2D;
		veloLeft = obj.velo2D;				
	}
	// position and velocity of particle to the right of current particle			
	if (num < rows*(cols -1) ) {
		centerRight = balls[num+rows].pos2D;
		veloRight = balls[num+rows].velo2D;
	}else{  // current particle is in last column, no particle to the right, just use current particle's position and velocity 
		centerRight = obj.pos2D;
		veloRight = obj.velo2D;
	}
	// apply gravity to all particles (except fixed ones)
	var gravity = Forces.constantGravity(obj.mass,g);
//	var damping = Forces.damping(kDamping,obj.velo2D);			
	// damping force 
	var velo = obj.velo2D.multiply(4).subtract(veloUp).subtract(veloDown).subtract(veloLeft).subtract(veloRight);
	var damping = Forces.damping(kDamping,velo);				
	// displacement vector of current particle from each of its nearest neighbours
	var displUp = obj.pos2D.subtract(centerUp);
	var displDown = obj.pos2D.subtract(centerDown);			
	var displLeft = obj.pos2D.subtract(centerLeft);
	var displRight = obj.pos2D.subtract(centerRight);			
	// extension vector of current particle from equilibrium position with respect to each neighbour
	var extensionUp = displUp.subtract(displUp.unit().multiply(springLength));
	var extensionDown = displDown.subtract(displDown.unit().multiply(springLength));	
	var extensionLeft = displLeft.subtract(displLeft.unit().multiply(springLength));
	var extensionRight = displRight.subtract(displRight.unit().multiply(springLength));	
	// spring force exerted by each neighbour on the current particle
	var restoringUp = Forces.spring(kSpring,extensionUp);
	var restoringDown = Forces.spring(kSpring,extensionDown);									
	var restoringLeft = Forces.spring(kSpring,extensionLeft);
	var restoringRight = Forces.spring(kSpring,extensionRight);									
	// external wind velocity and resulting wind force
	var windVelocity = new Vector2D(w,0);
	var windForce = Forces.linearDrag((-1)*kWind,windVelocity.subtract(obj.velo2D));
	// identify fixed particles
	var fixed = false;
	for (var i=0; i<fixedPoints.length; i++){
		if (num==fixedPoints[i]){
			fixed = true;
		}
	}
	// apply forces to all particles that are not fixed
	if (!fixed){
 		force = Forces.add([gravity, damping, restoringUp, restoringDown,restoringLeft, restoringRight, windForce]);
	}else{ // zero force on fixed particles
		force = new Vector2D(0,0); 
	}
}			
function updateAccel(mass){
	acc = force.multiply(1/mass);
}	
function updateVelo(obj){
	obj.velo2D = obj.velo2D.addScaled(acc,dt);				
}
