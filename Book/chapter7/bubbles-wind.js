var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 

var bubbles;
var t0;
var dt;
var force;
var acc;
var numBubbles = 10;
var g = 10;
var rho = 1;
var rhoP = 0.99;
var kfac = 0.01;
var windvel = new Vector2D(40,0);

window.onload = init; 

function init() {
	bubbles = new Array();
	var color = 'rgba(0,200,255,0.5)';
	//var color = '#00ffff';
	for (var i=0; i<numBubbles; i++){
		var radius = Math.random()*20+5;
		var V = 4*Math.PI*Math.pow(radius,3)/3;
		var mass = rho*V;		
		var bubble = new Ball(radius,color,mass,0,true);	
		//var bubble = new Ball(radius,color,mass);	
		bubble.pos2D = new Vector2D(Math.random()*canvas.width,Math.random()*canvas.height);
		bubble.velo2D = new Vector2D((Math.random()-0.5)*20,0);
		bubble.draw(context);
		bubbles.push(bubble);
	}  
	t0 = new Date().getTime(); 
	animFrame();
};

function animFrame(){
	requestAnimationFrame(animFrame,canvas);
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
	for (var i=0; i<numBubbles; i++){
		var bubble = bubbles[i];	
		moveObject(bubble);
		calcForce(bubble);
		updateAccel(bubble.mass);
		updateVelo(bubble);				
	}
}
function moveObject(obj){
	obj.pos2D = obj.pos2D.addScaled(obj.velo2D,dt);	
	obj.draw(context);	
}
function updateAccel(mass){
	acc = force.multiply(1/mass);
}	
function updateVelo(obj){
	obj.velo2D = obj.velo2D.addScaled(acc,dt);				
}
function calcForce(particle){
	var V = particle.mass/rhoP;
	var k = Math.PI*particle.radius*particle.radius*kfac;
	var gravity = Forces.constantGravity(particle.mass,g);
	var upthrust = Forces.upthrust(rho,V,g);
	var relwind = windvel.subtract(particle.velo2D);
	var wind = Forces.drag(-k,relwind);	
	force = Forces.add([gravity, upthrust, wind]);								
}

