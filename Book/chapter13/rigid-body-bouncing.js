var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 
var canvas_bg = document.getElementById('canvas_bg');
var context_bg = canvas_bg.getContext('2d');

var block;
var wall;
var m = 1;
var im = 5000;
var g = 20;
var cr = 0.4;
var k = 1;
var acc, force;	
var alp, torque;
var t0, dt;
var animId;

window.onload = init; 

function init() {
	// create a block
	block = makeBlock(100,50,'#0000ff',m,im);
	block.rotation = Math.PI/4;	
	block.pos2D = new Vector2D(400,50);	
	block.draw(context);
	// create a wall		
	wall = new Wall(new Vector2D(100,400),new Vector2D(700,400));	
	wall.draw(context_bg);
	// make the block move
	t0 = new Date().getTime(); 
	animFrame();
}
function makeBlock(w,h,col,m,im){
	var vertices = new Array();
	var vertex = new Vector2D(-w/2,-h/2);
	vertices.push(vertex);
	vertex = new Vector2D(w/2,-h/2);
	vertices.push(vertex);			
	vertex = new Vector2D(w/2,h/2);
	vertices.push(vertex);
	vertex = new Vector2D(-w/2,h/2);
	vertices.push(vertex);	
	return new PolygonRB(vertices,col,m,im); 
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
	moveObject(block);
	checkBounce(block);
	calcForce(block);
	updateAccel();
	updateVelo(block);	
}
function moveObject(obj){
	obj.pos2D = obj.pos2D.addScaled(obj.velo2D,dt);	
	obj.rotation = obj.angVelo*dt;	
	context.clearRect(0, 0, canvas.width, canvas.height);
	obj.draw(context);	
}	
function checkBounce(obj){
	// collision detection
	var testCollision = false;
	var j;
	for (var i=0; i<obj.vertices.length;i++){
		if (obj.pos2D.add(obj.vertices[i].rotate(obj.rotation)).y >= wall.p1.y){
			if (testCollision==false){
				testCollision = true;
				j = i;
			}else{ // that means one vertex is already touching
				stop(); // block is lying flat on floor, so stop simulation
			}
		}
		//console.log(obj.rotation);
	}
	// collision resolution
	if (testCollision == true){
		obj.y += obj.pos2D.add(obj.vertices[j].rotate(obj.rotation)).y*(-1) + wall.p1.y;
		var normal = wall.normal;
		var rp1 = obj.vertices[j].rotate(obj.rotation);
		var vp1 = obj.velo2D.add(rp1.perp(-obj.angVelo*rp1.length()));
		var rp1Xnormal = rp1.crossProduct(normal);
		var impulse = -(1+cr)*vp1.dotProduct(normal)/(1/obj.mass + rp1Xnormal*rp1Xnormal/obj.im); 
		obj.velo2D = obj.velo2D.add(normal.multiply(impulse/obj.mass));
		obj.angVelo += rp1.crossProduct(normal)*impulse/obj.im;
		testCollision = false;
	}			
}
function calcForce(obj){
	force = Forces.constantGravity(m,g);	
	torque = 0; // no external torque since gravity is the only force
	torque += -k*obj.angVelo; // damping	
}	
function updateAccel(){
	acc = force.multiply(1/m);
	alp = torque/im;	
}	
function updateVelo(obj){
	obj.velo2D = obj.velo2D.addScaled(acc,dt);	
	obj.angVelo += alp*dt;		
}
function stop(){
	cancelAnimationFrame(animId);
}
