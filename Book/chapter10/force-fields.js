var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 
var canvas_bg = document.getElementById('canvas_bg');
var context_bg = canvas_bg.getContext('2d');

var vmax = 20;
var G = 1;
var centers;
var particles;
var t0;
var dt;
var force;
var acc;
var numParticles = 50;

window.onload = init; 

function init() {
	centers = new Array();
	// k/r force
	var center1 = new Ball(20,'#ff0000',1000,-1,true);
	center1.pos2D = new Vector2D(200,500);
	center1.velo2D = new Vector2D(10,-10);
	center1.draw(context);
	centers.push(center1);
	// k/r2 force
	var center2 = new Ball(20,'#00ff00',100000,-2,true);
	center2.pos2D = new Vector2D(500,100);
	center2.draw(context_bg);
	centers.push(center2);
	// k/r3 force
	var center3 = new Ball(20,'#0000ff',10000000,-3,true);
	center3.pos2D = new Vector2D(600,300);
	center3.draw(context_bg);	
	centers.push(center3);	
	// create particles
	particles = new Array();
	for (var i=0; i<numParticles; i++){	
		var particle = new Ball(4,'#000000',1,0,false);	
		particle.pos2D = new Vector2D(Math.random()*canvas.width,Math.random()*canvas.height);
		particle.velo2D = new Vector2D((Math.random()-0.5)*vmax,(Math.random()-0.5)*vmax);
		particle.draw(context);
		particles.push(particle);
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
	moveObject(centers[0]);
	for (var i=0; i<numParticles; i++){
		var particle = particles[i];	
		moveObject(particle);
		calcForce(particle);
		updateAccel(particle.mass);
		updateVelo(particle);				
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
	var central;
	force = Forces.zeroForce();
	for (var i=0; i<centers.length; i++){
		var center = centers[i];
		var k = -G*center.mass*particle.mass;
		var n = center.charge;
		var r = particle.pos2D.subtract(center.pos2D);
		if (r.length() > center.radius){			
			central = Forces.central(k,n,r);
		}else{
			central = Forces.zeroForce();
		}
		force = Forces.add([force, central]);	
	}		
}

