var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 
var canvas_bg = document.getElementById('canvas_bg');
var context_bg = canvas_bg.getContext('2d');

var stars;
var numStars = 1000;
var massStar = 1;
var massAttractor = 10000;
var radiusAttractor = 20;
var posAttractor = new Vector2D(400,400);
var posEmitter = new Vector2D(400,100);
var G = 10;
var t0, dt;
var acc, force;

window.onload = init; 

function init() {
	// create a stationary black hole
	var blackHole = new Star(radiusAttractor,'#222222',massAttractor);
	blackHole.pos2D = posAttractor;						
	blackHole.draw(context_bg);	
	// create a stationary white hole
	var whiteHole = new Star(10,'#ffffff');
	whiteHole.pos2D = posEmitter;						
	whiteHole.draw(context_bg);
	// create stars
	stars = new Array();
	for (var i=0; i<numStars; i++){	
		var star = new Star(2,'#ffff00',massStar);	
		star.pos2D = new Vector2D(Math.random()*canvas.width,Math.random()*canvas.height);
		star.velo2D = new Vector2D((Math.random()-0.5)*50,(Math.random()-0.5)*50);
		star.draw(context);
		stars.push(star);
	}  
	t0 = new Date().getTime(); 
	animFrame();
}

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
	for (var i=0; i<numStars; i++){
		var star = stars[i];	
		moveObject(star);
		calcForce(star);
		updateAccel(massStar);
		updateVelo(star);				
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
function calcForce(obj){	
	var dist = obj.pos2D.subtract(posAttractor);
	if (dist.length() < radiusAttractor){
		recycleObject(obj);
	}else{	
		var gravity;
		force = Forces.zeroForce();	
		if (dist.length() > radiusAttractor+obj.radius){
			gravity = Forces.gravity(G,massAttractor,massStar,dist);
			force = Forces.add([force, gravity]);		
		}	
	}	
}
function recycleObject(obj){
	obj.pos2D = posEmitter;
	obj.velo2D = new Vector2D((Math.random()-0.5)*50,Math.random()*10);
	obj.radius *= 1.5;
}
