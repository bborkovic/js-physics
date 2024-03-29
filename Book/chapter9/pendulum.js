var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 

var bob;
var pivot;
var displ = new Vector2D(0,0);
var center = new Vector2D(0.5*canvas.width,50);
var mass = 1;
var g = 100;
var lengthP = 200;
var initAngle = 30;
var t0, t, dt;
var acc, force;
var animId;

window.onload = init; 

function init() {
	// create a pivot		
	pivot = new Ball(2,'#000000');
	pivot.pos2D = center;
	pivot.draw(context);
	// create a bob
	bob = new Ball(10,'#333333',mass);
	bob.mass = mass;
	var relativePos = new Vector2D(lengthP*Math.sin(initAngle*Math.PI/180),lengthP*Math.cos(initAngle*Math.PI/180));
	bob.pos2D = pivot.pos2D.add(relativePos);
	bob.draw(context);	
	// make the bob move
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
	if (dt>0.2) {dt=0;};	
	t += dt;
	move();
}
function move(){		
	context.clearRect(0, 0, canvas.width, canvas.height);
	drawSpring(bob);		
	moveObject(bob);
	calcForce(bob);
	updateAccel();
	updateVelo(bob);
}
function drawSpring(obj){
	pivot.draw(context);
	context.save();			
	context.strokeStyle = '#999999';
	context.lineWidth = 2;
	context.moveTo(center.x,center.y);
	context.lineTo(obj.x,obj.y);
	context.stroke();
	context.restore();
}
function moveObject(obj){
	obj.pos2D = obj.pos2D.addScaled(obj.velo2D,dt);	
	obj.draw(context);	
}
function calcForce(obj){
    displ = obj.pos2D.subtract(center);
	var gravity = Forces.constantGravity(mass,g);
	var tension;
    if (displ.length() >= lengthP) {  
		tension = displ.unit().multiply(-(gravity.projection(displ)+mass*bob.velo2D.lengthSquared()/lengthP));
	}else{
		tension = new Vector2D(0,0);
	}
	force = Forces.add([gravity, tension]);	
}	
function updateAccel(){
	acc = force.multiply(1/mass);
}	
function updateVelo(obj){
	obj.velo2D = obj.velo2D.addScaled(acc,dt);				
}
