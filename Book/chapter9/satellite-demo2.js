var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 

var satellite;
var earth;
var G = 1;
var M = 1000000; // earth's mass
var t0, t, dt;

var r, x0, y0, omega, omegaE;
var angle = 0;
var angleE = 0;

window.onload = init; 

function init() {			
	// create a stationary earth
	earth = new Ball(70,'#0099ff',M,0,true,true);
	earth.pos2D = new Vector2D(400,300);	
	earth.angVelo = 0.4;
	earth.draw(context);
	// create a moving satellite			
	satellite = new Satellite(8,'#0000ff',1);
	satellite.pos2D = new Vector2D(600,300);
//	satellite.pos2D = new Vector2D(584.2,300);	
	//satellite.angVelo = earth.angVelo;
	satellite.draw(context);
	// set params
	r = satellite.pos2D.subtract(earth.pos2D).length();
	omegaE = earth.angVelo;
	omega = Math.sqrt(G*M/(r*r*r));	
	x0 = earth.x;
	y0 = earth.y;	
	// make the satellite orbit the earth
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
	satellite.pos2D = new Vector2D(r*Math.cos(omega*t)+x0,r*Math.sin(omega*t)+y0);
	angle += omega*dt;
	angleE += omegaE*dt;
	context.clearRect(0, 0, canvas.width, canvas.height);
	rotateObject(earth,angleE);	
	rotateObject(satellite,angle);
}
function rotateObject(obj,theta){
	context.save();
	context.translate(obj.x,obj.y);
	context.rotate(theta);
	context.translate(-obj.x,-obj.y);
	obj.draw(context);
	context.restore();	
}