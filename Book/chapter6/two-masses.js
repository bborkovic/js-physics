var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 
var canvas_bg = document.getElementById('canvas_bg');
var context_bg = canvas_bg.getContext('2d');

var ball1;
var ball2;
var r1 = 10;
var r2 = 40;
var m1 = 1; 
var m2 = 60; 
var G = 100000;
var t0,dt;

window.onload = init; 

function init() {			
	var ball1Init = new Ball(r1,'#9999ff',m1,0,true);
	ball1Init.pos2D = new Vector2D(150,200);
	ball1Init.draw(context_bg);
		
	var ball2Init = new Ball(r2,'#ff9999',m2,0,true);
//	var ball2Init = new Ball(r1,'#ff9999',m1,0,true);			
	ball2Init.pos2D = new Vector2D(350,200);
	ball2Init.draw(context_bg);				
		
	ball1 = new Ball(r1,'#0000ff',m1,0,true);				
	ball1.pos2D = ball1Init.pos2D;
	ball1.velo2D = new Vector2D(0,150);
//	ball1.velo2D = new Vector2D(0,10);			
	ball1.draw(context);
			
	ball2 = new Ball(r2,'#ff0000',m2,0,true);
//	ball2 = new Ball(r1,'#ff0000',m1,0,true);
	ball2.pos2D = ball2Init.pos2D;	
	ball2.velo2D = new Vector2D(0,0);		
//	ball2.velo2D = new Vector2D(0,-2.5);	
//	ball2.velo2D = new Vector2D(0,-10);
	ball2.draw(context);				
			
	t0 = new Date().getTime(); 
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
	move();
}
function move(){// note: the order of these calls is important!		
	context.clearRect(0, 0, canvas.width, canvas.height);	
	moveObject(ball1);
	moveObject(ball2);	
	calcForce(ball1,ball2); // calc force on ball1 due to ball2 
	update(ball1);
	calcForce(ball2,ball1);	// calc force on ball2 due to ball1
	update(ball2);	
}

function update(obj){
	updateAccel(obj.mass);
	updateVelo(obj);
}

function moveObject(obj){
	obj.pos2D = obj.pos2D.addScaled(obj.velo2D,dt);	
	obj.draw(context);	
}
function calcForce(obj1,obj2){
	force = Forces.gravity(G,obj1.mass,obj2.mass,obj1.pos2D.subtract(obj2.pos2D));	
}	
function updateAccel(m){
	acc = force.multiply(1/m);
}	
function updateVelo(obj){
	obj.velo2D = obj.velo2D.addScaled(acc,dt);				
}
