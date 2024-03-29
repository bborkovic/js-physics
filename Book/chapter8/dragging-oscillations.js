var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 

var bob;
var fixedPoint;
var displ = new Vector2D(0,0);
var center = new Vector2D(0.5*canvas.width,50);
var mass = 1;
var g = 20;
var kDamping = 0.1;
var kSpring = 1;
var springLength = 200;
var t0, dt;
var acc, force;
var animId;
var isDragging = false;

window.onload = init; 

function init() {
	// create a bob
	bob = new StickMan();
	bob.mass = mass;
	bob.pos2D = new Vector2D(300,200);	
	bob.draw(context);
	// create a fixedPoint		
	fixedPoint = new Ball(2,'#000000');
	fixedPoint.pos2D = center;
	fixedPoint.draw(context);	
	// drag and drop event listeners
	canvas.addEventListener('mousedown', function () {
	canvas.addEventListener('mousemove',onDrag,false);
	canvas.addEventListener('mouseup',onDrop,false);
	}, false);	
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
	drawSpring(bob);		
	moveObject(bob);
	if (isDragging == false){
		calcForce(bob);
		updateAccel();
		updateVelo(bob);
	}
}

function drawSpring(obj){
	fixedPoint.draw(context);
	context.save();			
	context.lineStyle = '#999999';
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
	var damping = Forces.drag(kDamping,obj.velo2D);	
	var extension = displ.subtract(displ.unit().multiply(springLength));
	var restoring = Forces.spring(kSpring,extension);
	force = Forces.add([gravity, damping, restoring]);	
}	
function updateAccel(){
	acc = force.multiply(1/mass);
}	
function updateVelo(obj){
	obj.velo2D = obj.velo2D.addScaled(acc,dt);				
}
function onDrag(evt){
	var mousePos = new Vector2D(evt.clientX,evt.clientY);
	var dist = Vector2D.distance(bob.pos2D,mousePos);
	if (dist<bob.radius){
		bob.velo2D = new Vector2D(0,0);
		bob.pos2D = mousePos;
		isDragging = true;		
	}
}
function onDrop(){
	isDragging = false;
	canvas.removeEventListener('mousemove',onDrag,false);
	canvas.removeEventListener('mouseup',onDrop,false);	
}
