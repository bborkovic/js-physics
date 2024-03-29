var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 

var earth;
var satellite;
var t0, t, dt;

var r, x0, y0, omega;
var angle = 0;

window.onload = init; 

function init() {			
	// create a stationary earth
	earth = new Ball(70,'#0099ff',1000000,0,true,true);
	earth.pos2D = new Vector2D(400,300);	
	earth.angVelo = 0.4;
	earth.draw(context);
	// create a moving satellite			
	satellite = new Satellite(8,'#0000ff',1);
	satellite.pos2D = new Vector2D(600,300);
	satellite.angVelo = earth.angVelo;
	satellite.draw(context);
	// set params
	r = satellite.pos2D.subtract(earth.pos2D).length();
	omega = earth.angVelo;
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
	context.clearRect(0, 0, canvas.width, canvas.height);
	rotateObject(earth);	
	rotateObject(satellite);	
}
function rotateObject(obj){
	context.save();
	context.translate(obj.x,obj.y);
	context.rotate(angle);
	context.translate(-obj.x,-obj.y);
	obj.draw(context);
	context.restore();	
}
