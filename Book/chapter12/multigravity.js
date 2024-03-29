var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 
var canvas_bg = document.getElementById('canvas_bg');
var context_bg = canvas_bg.getContext('2d');

var stars;
var numStars = 200;
var massStar = 100;
var vmag = 10;
var massNucleus = 1;
var radiusNucleus = 20;
var posNucleus = new Vector2D(0.5*canvas.width,0.5*canvas.height);
var G = 1;
var eps = 1;
var rmin = 100;
var t0, dt;
var acc, force;

window.onload = init; 

function init() {
	// create a stationary attracting nucleus
	var nucleus = new Star(radiusNucleus,'#333333',massNucleus);
	nucleus.pos2D = posNucleus;						
	nucleus.draw(context_bg);	
	// create stars
	stars = new Array();
	for (var i=0; i<numStars; i++){	
		var star = new Star(2,'#ffff00',massStar*(Math.random()+0.1));	
		star.pos2D = new Vector2D(Math.random()*canvas.width,Math.random()*canvas.height);
		star.velo2D = new Vector2D((Math.random()-0.5)*vmag,(Math.random()-0.5)*vmag);
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
		calcForce(star,i);
		updateAccel(star.mass);
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
function calcForce(obj,num){	
	var dist = obj.pos2D.subtract(posNucleus);		
	var gravityCentral;
	if (dist.length() < radiusNucleus) {
		gravityCentral = new Vector2D(0,0);
	}else{
		gravityCentral = Forces.gravity(G,massNucleus,obj.mass,dist);		
	}
	var gravityMutual = new Vector2D(0,0);
	for (var i=0; i<stars.length; i++){
		if (i != num){
			var star = stars[i];
			var distP = obj.pos2D.subtract(star.pos2D);		
			if (distP.length() < rmin){
				var gravityP = Forces.gravityModified(G,star.mass,obj.mass,distP,eps);	
				gravityMutual.incrementBy(gravityP);
			}
		}
	}
	force = Forces.add([gravityCentral, gravityMutual]);	
}
