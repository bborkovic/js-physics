var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 

var stars;
var numStars = 5000;
var massStar = 10;
var veloMag = 20;
var maxRadius = 300;
var nucleus;
var massNucleus = 100000;
var radiusNucleus = 20;
var posNucleus = new Vector2D(0.5*canvas.width,0.5*canvas.height);
var G = 1;
var rmax = 500;
var constDark = 1000;
var A = 1;
var alpha = 0.5;
var t0, dt;
var acc, force;
var massStars = new Array(); // total mass of stars within radius r
var massDark = new Array(); // total mass of dark matter within radius r	

window.onload = init; 

function init() {
	// create a stationary attracting nucleus
	nucleus = new Star(radiusNucleus,'#333333',massNucleus);
	nucleus.pos2D = posNucleus;						
	nucleus.draw(context);	
	// initial distribution of stars
	stars = new Array();
	for (var i=0; i<numStars; i++){	
		var star = new Star(1,'#ffff00',massStar);	
		var radius = radiusNucleus + (maxRadius-radiusNucleus)*Math.random();
		var angle = 2*Math.PI*Math.random();
		star.pos2D = new Vector2D(radius*Math.cos(angle),radius*Math.sin(angle)).add(posNucleus);				
		//star.pos2D = new Vector2D(Math.random()*canvas.width,Math.random()*canvas.height);
		//star.velo2D = new Vector2D(veloMag*(Math.random()-0.5),veloMag*(Math.random()-0.5));				
		var rvec = posNucleus.subtract(star.pos2D);
		star.velo2D = rvec.perp(veloMag);
		//star.velo2D = rvec.perp(veloMag*2);
		//star.velo2D = rvec.perp(veloMag).add(rvec.para(veloMag));		
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
	nucleus.draw(context);
	calcMass();
	for (var i=0; i<numStars; i++){
		var star = stars[i];	
		moveObject(star);
		calcForce(star,i);
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
	var dist = obj.pos2D.subtract(posNucleus);			
	if (dist.length() < radiusNucleus) {
		force = new Vector2D(0,0);
	}else{
		force = Forces.gravity(G,massNucleus+massStars[Math.ceil(dist.length())]+massDark[Math.ceil(dist.length())],massStar,dist);		
	}	
}
function calcMass(){
	var distanceToCenter;
	var star;
	var massStarRing = new Array();
	var massDarkRing = new Array();
	for (var l=0; l<rmax; l++){
		massStarRing[l] = 0;
		massDarkRing[l] = constDark*l*l*Math.exp(-A*Math.pow(l,alpha));
	}
	for (var k=0; k<stars.length-1; k++){
		star = stars[k];
		distanceToCenter = star.pos2D.subtract(posNucleus).length();
		massStarRing[Math.ceil(distanceToCenter)] += star.mass; 
	}
	massStars[0] = massStarRing[0];
	massDark[0] = massDarkRing[0];
	for(var j=1; j<stars.length-1; j++){
		massStars[j] = massStars[j-1] + massStarRing[j]; 
		massDark[j] = massDark[j-1] + massDarkRing[j]; 				
	}			
	//console.log(massNucleus,massStars[rmax-1],massDark[rmax-1]);
}
