var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 
var canvas_bg = document.getElementById('canvas_bg');
var context_bg = canvas_bg.getContext('2d');

var planet;
var sun;
var m = 1; // planet's mass
var M = 1000000; // sun's mass
var G = 1;
var t0,dt;

window.onload = init; 

function init() {
	// create 100 stars randomly positioned
	for (var i=0; i<100; i++){
		var star = new Ball(Math.random()*2,'#ffff00');
		star.pos2D = new Vector2D(Math.random()*canvas_bg.width,Math.random()*canvas_bg.height);
		star.draw(context_bg);
	}			
	// create a stationary sun
	sun = new Ball(70,'#ff9900',M,0,true);
	sun.pos2D = new Vector2D(275,200);	
	sun.draw(context_bg);
	// create a moving planet			
	planet = new Ball(10,'#0000ff',m,0,true);
	planet.pos2D = new Vector2D(200,50);
	planet.velo2D = new Vector2D(80,-40);
	//planet.velo2D = new Vector2D(70,-40);
	//planet.velo2D = new Vector2D(85,-40);
	//planet.velo2D = new Vector2D(80,0);
	//planet.velo2D = new Vector2D(100,0);
	//planet.velo2D = new Vector2D(105,0);		
	planet.draw(context);
	// make the planet orbit the sun
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
	if (dt>0.1) {dt=0;};	
	move();
}
function move(){			
	moveObject(planet);
	calcForce();
	updateAccel();
	updateVelo(planet);
}

function moveObject(obj){
	obj.pos2D = obj.pos2D.addScaled(obj.velo2D,dt);	
	context.clearRect(0, 0, canvas.width, canvas.height);
	obj.draw(context);	
}
function calcForce(){
	force = Forces.gravity(G,M,m,planet.pos2D.subtract(sun.pos2D));	
}	
function updateAccel(){
	acc = force.multiply(1/m);
}	
function updateVelo(obj){
	obj.velo2D = obj.velo2D.addScaled(acc,dt);				
}
