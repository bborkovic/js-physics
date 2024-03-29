var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 
var canvas_bg = document.getElementById('canvas_bg');
var context_bg = canvas_bg.getContext('2d');

var drop;
var droplets;
var numDroplets = 20;
var m = 1; 
var g = 20; 
var vx = 20;
var vy = -15;
var wlevel = 510;
var fac = 1;
var t0,dt;
var acc, force;

window.onload = init; 

function init() {
	makeBackground();
	makeDrop();
	makeDroplets();
	t0 = new Date().getTime();
	animFrame();
}
function makeBackground(){
	var horizon = 500; 
	// the sea	
	context_bg.fillStyle = '#7fffd4';
	context_bg.fillRect(0,horizon,canvas_bg.width,canvas_bg.height-horizon);	
	// the sky
	gradient = context_bg.createLinearGradient(0,0,0,horizon);
	gradient.addColorStop(0,'#87ceeb');
	gradient.addColorStop(1,'#ffffff');
	context_bg.fillStyle = gradient;	
	context_bg.fillRect(0,0,canvas_bg.width,horizon);	
}
function makeDrop(){
	drop = new Ball(8,'#3399ff',1,0,true);
	drop.pos2D = new Vector2D(400,100);
	drop.velo2D = new Vector2D(0,100);
	drop.draw(context);	
}
function makeDroplets(){
	droplets = new Array();
	for (var i=0; i<numDroplets; i++){
		var radius = Math.random()*2+1;
		var droplet = new Ball(radius,'#3399ff',m,0,true);
		droplets.push(droplet);
	} 	
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
	moveObject(drop);	
	checkDrop();
	for (var i=0; i<numDroplets; i++){
		var droplet = droplets[i];			
		moveObject(droplet);
		calcForce(droplet);
		updateAccel();
		updateVelo(droplet);				
	}	
}
function moveObject(obj){
	obj.pos2D = obj.pos2D.addScaled(obj.velo2D,dt);	
	if (obj.y < wlevel){// only show drops above water level
		obj.draw(context);	
	}	
}
function calcForce(obj){
	force = Forces.constantGravity(m,g);				
}	
function updateAccel(){
	acc = force.multiply(1/m);
}	
function updateVelo(obj){
	obj.velo2D = obj.velo2D.addScaled(acc,dt);				
}
function checkDrop(){
	if (drop.y > wlevel){
		for (var i=0; i<droplets.length; i++){
			var droplet = droplets[i];
			var posx = drop.x+(Math.random()-0.5)*drop.radius;
			var posy = wlevel-10+Math.random()*drop.radius;
			var velx = (Math.random()-0.5)*vx*fac;
			var vely = (Math.random()+0.5)*vy*fac;
			droplet.pos2D = new Vector2D(posx,posy);
			droplet.velo2D = new Vector2D(velx,vely);
		} 				
		drop.x = Math.random()*600+100;
		drop.y = 100;
		drop.radius = 4 + 8*Math.random();
		fac = Math.pow(drop.radius/8,1.5);
	}
}

