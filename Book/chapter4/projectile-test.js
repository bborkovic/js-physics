var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 

var ball1;
var ball2;
var t; // time from start of simulation
var t0; // time at last call
var dt; // elapsed time between calls
var animId;
var pos0 = new Vector2D(100,350);		
var velo0 = new Vector2D(45,-45);			
var acc = new Vector2D(0,10); // acceleration due to gravity
var animTime = 16; // duration of animation

window.onload = init; 

function init() {
	ball1 = new Ball(15,'#000000',1,0,true);
	ball1.pos2D = pos0;
	ball1.velo2D = velo0;
	ball2 = new Ball(15,'#aaaaaa',1,0,true);
	ball2.pos2D = pos0;
	ball2.velo2D = velo0;
	// ball1.draw(context);
	// ball2.draw(context);
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
	if (dt>0.2) {dt=0;}; // fix for bug if user switches tabs  	
	t += dt; // current time since start of simulation; not used here
	//console.log(dt,t);
	if (t < animTime){
		move();
	}
}
function move(){
	// numerical solution - Euler scheme
	ball1.pos2D = ball1.pos2D.addScaled(ball1.velo2D,dt);	
	ball1.velo2D = ball1.velo2D.addScaled(acc,dt);	
	// analytical solution
	ball2.pos2D = pos0.addScaled(velo0,t).addScaled(acc,0.5*t*t);
	ball2.velo2D = velo0.addScaled(acc,t);	
	// display	
	context.clearRect(0, 0, canvas.width, canvas.height);
	ball1.draw(context);
	ball2.draw(context);	
}

