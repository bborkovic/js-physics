var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 

var turbines;
var acc, force;	
var alp, torque;
var t0, dt;
var animId;
var k = 0.5; // angular damping factor	
var tqMax = 2;
var tq = 0;

window.onload = init; 

function init() {
	turbines = new Array();
	var turbine1 = turbine(4,50,'#000000',1,1);
	turbine1.pos2D = new Vector2D(200,150);	
	turbines.push(turbine1);
	var turbine2 = turbine(6,75,'#000000',2.25,5);
	turbine2.pos2D = new Vector2D(150,400);	
	turbines.push(turbine2);	
	var turbine3 = turbine(12,150,'#000000',9,81);
	turbine3.pos2D = new Vector2D(500,300);	
	turbines.push(turbine3);	
	addEventListener('mousedown',onDown,false);
	t0 = new Date().getTime(); 
	animFrame();
}
function turbine(ri,ro,col,m,im){
	var vertices = new Array();
	for (var i=0; i<3; i++){
		var vertex = getVertex(ro,i*120);
		vertices.push(vertex);
		vertex = getVertex(ri,i*120+60);
		vertices.push(vertex);
	}
	return new PolygonRB(vertices,col,m,im); 
}
function getVertex(r,a){
	a *= Math.PI/180;
	return new Vector2D(r*Math.cos(a),r*Math.sin(a));
}
function onDown(evt){
	tq = tqMax;
	addEventListener('mouseup',onUp,false);						
}
function onUp(evt){
	tq = 0;
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
	for (var i=0; i<turbines.length; i++){
		var windTurbine = turbines[i];	
		moveObject(windTurbine);
		calcForce(windTurbine);
		updateAccel(windTurbine);
		updateVelo(windTurbine);
	}
}
function moveObject(obj){
	obj.pos2D = obj.pos2D.addScaled(obj.velo2D,dt);	
	obj.rotation = obj.angVelo*dt;
	obj.draw(context);	
}
function calcForce(obj){
	force = Forces.zeroForce();
	torque = tq;
	torque += -k*obj.angVelo; // angular damping 	
}	
function updateAccel(obj){
	acc = force.multiply(1/obj.mass);
	alp = torque/obj.im;
}	
function updateVelo(obj){
	obj.velo2D = obj.velo2D.addScaled(acc,dt);	
	obj.angVelo += alp*dt;	
}

