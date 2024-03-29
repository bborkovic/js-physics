var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 
var canvas_bg = document.getElementById('canvas_bg');
var context_bg = canvas_bg.getContext('2d');
var canvas_fg = document.getElementById('canvas_fg');
var context_fg = canvas_fg.getContext('2d'); 

var sub;	
var g = 10;
var rho = 1;
var V = 1;
var k = 0.05;
var yLevel = 200;
var thrustMag = 20;
var thrust = new Vector2D(0,0);
var waterMass = 1;
var emptySubMass = 0.5;
var waterFraction = 0.4; // must be between 0 and 1
var ballastInc = 0; // ballast increment		
var incMag = 0.01; // magnitude of the ballast increment
var t0, dt
var force, acc;
var animId;

window.onload = init; 

function init() {
	// create the sky
	gradient = context_bg.createLinearGradient(0,0,0,yLevel);
	gradient.addColorStop(0,'#0066ff');	
	gradient.addColorStop(1,'#ffffff');
	context_bg.fillStyle = gradient;	
	context_bg.fillRect(0,0,canvas_bg.width,yLevel);	
	// create the sea
	context_fg.fillStyle = "rgba(0,255,255,0.5)";
	context_fg.fillRect(0,yLevel,canvas.width,canvas.height);
	// create a sub
	sub = new Sub(160,60,'#0000ff',emptySubMass);
	sub.pos2D = new Vector2D(250,300);
	sub.velo2D = new Vector2D(40,-20);	
	sub.draw(context);	
	// set water height in sub
	setWaterHeight();	
	// set up text formating
	setupText();
	// set up event listener
	window.addEventListener('keydown',keydownListener,false);			
	// initialise time and animate
	initAnim();
};
function setupText(){
	context_fg.font = "12pt Arial";
	context_fg.textAlign = "left";
	context_fg.textBaseline = "top";
}
function keydownListener(evt){
	if (evt.keyCode == 39) { // right arrow
				thrust = new Vector2D(thrustMag,0);
	} else if (evt.keyCode == 37) { // left arrow
				thrust = new Vector2D(-thrustMag,0);
	}			
	if (evt.keyCode == 40) { // down arrow
				ballastInc = incMag;
	} else if (evt.keyCode == 38) { // up arrow
				ballastInc = -incMag;
	}
	window.addEventListener('keyup',keyupListener,false);			
}		
function keyupListener(evt){
	thrust = new Vector2D(0,0);
	ballastInc = 0;
	window.removeEventListener('keyup',keyupListener,false);						
} 

function initAnim(){
	t0 = new Date().getTime(); 
	animFrame();
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
	updateSub();		
	moveObject();
	calcForce();
	updateAccel();
	updateVelo();
}
function stop(){
	cancelAnimationFrame(animId);
}

function updateSub(){
	adjustBallast();
	updateInfo();			
}
function adjustBallast(){
	if (ballastInc != 0){
		waterFraction += ballastInc;
		if (waterFraction < 0){
			waterFraction = 0;
		}
		if (waterFraction > 1){
			waterFraction = 1;
		}
		setWaterHeight();
	}
}
function setWaterHeight(){
	sub.waterHeight = sub.tankHeight*waterFraction;
	sub.mass = emptySubMass + waterMass*waterFraction;
}
function updateInfo(){
	var ratio = sub.mass/V/rho; // ratio of submarine density to water density
	ratio = Math.round(ratio*100)/100; // round to 2 d.p.
	var txt = "[sub density] / [water density] = ";
	txt = txt.concat(ratio.toString()); 
	context_fg.clearRect(0,0,700,100);
	context_fg.fillText(txt,20,20);
}
function moveObject(){
	sub.pos2D = sub.pos2D.addScaled(sub.velo2D,dt);	
	context.clearRect(0, 0, canvas.width, canvas.height);
	sub.draw(context);	
}
function calcForce(){
	var rheight = 0.5*sub.height;	
	var ysub = sub.y + rheight;	
	var dr = (ysub-yLevel)/rheight;
	var ratio; // volume fraction of object that is submerged
	if (dr <= -1){ // object completely out of water
		ratio = 0;
	}else if (dr < 1){ // object partially in water 			
		ratio = 0.5+0.5*dr; // for cuboid
	}else{ // object completely in water
		ratio = 1;
	}
	var gravity = Forces.constantGravity(sub.mass,g);
	var upthrust = Forces.upthrust(rho,V*ratio,g);
	var drag = Forces.drag(k*ratio,sub.velo2D);
	force = Forces.add([gravity, upthrust, drag, thrust]);					
}	
function updateAccel(){
	acc = force.multiply(1/sub.mass);
}	
function updateVelo(){
	sub.velo2D = sub.velo2D.addScaled(acc,dt);		
}

