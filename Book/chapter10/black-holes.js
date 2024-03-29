var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 
var canvas_bg = document.getElementById('canvas_bg');
var context_bg = canvas_bg.getContext('2d');

var G = 1;
var c = 200;
var attractors;
var ship;
var t0;
var dt;
var force;
var acc;
var yposWinning = 50;
var yposEdge = 400;
var applyThrust = false;			
var direction = "";			
var dir = new Vector2D(0,1);		
var vedmdt = 10; // ve*dm/dt		
var numLives = 3;	
var score = 0;
var txtLives;
var txtScore;
var animId;

window.onload = init; 

function init() {
	ship = new Rocket(12,12,'#ff0000',1);
	ship.pos2D = new Vector2D(0.5*canvas.width,canvas.height-50);
	ship.draw(context);		
	attractors = new Array();
	addAttractor();
	setupText();
	setupScene();
	setupEventListeners();
	t0 = new Date().getTime(); 
	animFrame();
}
function addAttractor(){
	var r = 20*(Math.random()+0.5);
	var m = (0.5*c*c/G)*r; 
	var attractor = new Ball(r,'#000000',m,0,false);				
	attractors.push(attractor);
}
function setupText(){
	context_bg.font = "18pt Arial";
	context_bg.textAlign = "left";
	context_bg.textBaseline = "top";
}
function setupScene(){
	context_bg.clearRect(0, 0, canvas_bg.width, canvas_bg.height);
	drawLines();
	showLives();
	showScore();
	for (var i=0; i<attractors.length; i++){
		var attractor = attractors[i];
		attractor.pos2D	= new Vector2D(Math.random()*canvas.width,Math.random()*(yposEdge-yposWinning)+yposWinning);	
		attractor.draw(context_bg);		
	}
}
function drawLines(){
	// create a winning line and a bounding line
	context_bg.strokeStyle = '#ccffcc';
	context_bg.lineWidth = 2;
	context_bg.beginPath();
	context_bg.moveTo(0,yposWinning);
	context_bg.lineTo(canvas.width,yposWinning);
	context_bg.strokeStyle = '#ccccff';
	context_bg.lineWidth = 1;	
	context_bg.moveTo(0,yposEdge);
	context_bg.lineTo(canvas.width,yposEdge);	
	context_bg.closePath();	
	context_bg.stroke();	
}
function showLives(){
	txtLives = numLives.toString().concat(" lives left"); 
	if (numLives==0){
		txtLives = "Game over";
		stop();
	}
	writeText(txtLives,50,20);
}
function showScore(){
	if (score==0){
		txtScore = "";
	}else if (score==1){
		txtScore = "You've just dodged a black hole!"
	}else{
		txtScore = "You've dodged "; 
		txtScore = txtScore.concat(score.toString()," black holes!");
	}
	writeText(txtScore,400,20);
}
function writeText(txt,x,y){
	context_bg.fillText(txt,x,y);
}
function setupEventListeners(){
	window.addEventListener('keydown',startThrust,false);		
	window.addEventListener('keyup',stopThrust,false);				
	window.addEventListener('dblclick',changeSetup,false);
}
function startThrust(evt){
	applyThrust = true;
	if (evt.keyCode==38){ // up arrow
		direction = "UP";
	}	
	if (evt.keyCode==40){ // down arrow
		direction = "DOWN";
	}				
	if (evt.keyCode==39){ // right arrow
		direction = "RIGHT";
	}
	if (evt.keyCode==37){ // left arrow
		direction = "LEFT";
	}			
}		
function stopThrust(evt){
	applyThrust = false;
	direction = "";
}		
function changeSetup(evt){
	setupScene();
	recycleOrbiter(ship);	
}
function recycleOrbiter(obj){
	obj.pos2D = new Vector2D(0.5*canvas.width,canvas.height-50);
	obj.velo2D = new Vector2D(0,0);
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
	moveObject(ship);
	calcForce(ship);
	updateAccel(ship.mass);
	updateVelo(ship);				
}
function moveObject(obj){
	obj.pos2D = obj.pos2D.addScaled(obj.velo2D,dt);	
	if (obj.x < 0 || obj.x > canvas.width || obj.y < 0 || obj.y > canvas.height){
		recycleOrbiter(obj);
	}
	if (obj.y < yposWinning){
		updateScore();
		addAttractor();
		setupScene();
		recycleOrbiter(obj);
	}
	obj.draw(context);	
}
function updateAccel(mass){
	acc = force.multiply(1/mass);
}	
function updateVelo(obj){
	obj.velo2D = obj.velo2D.addScaled(acc,dt);				
}
function calcForce(obj){	
	force = Forces.zeroForce();
	// calculate and add gravity due to all black holes
	var gravity = Forces.zeroForce();
	for (var i=0; i<attractors.length; i++){
		var attractor = attractors[i];	
		var dist = obj.pos2D.subtract(attractor.pos2D);
		if (dist.length() > attractor.radius){
			gravity = Forces.gravity(G,attractor.mass,obj.mass,dist);
			force = Forces.add([force, gravity]);		
		}else{
			updateLives();
			setupScene();
			recycleOrbiter(obj);
		}
	}	
	// calculate and add thrust
	var thrust = Forces.zeroForce();			
	if (applyThrust){
		if (direction=="UP"){
			thrust = dir.para(-vedmdt);
		}else if (direction=="DOWN"){
			thrust = dir.para(vedmdt);
		}else if (direction=="RIGHT"){
			thrust = dir.perp(vedmdt);
		}else if (direction=="LEFT"){
			thrust = dir.perp(-vedmdt);
		}else{
			thrust = new Vector2D(0,0);
		}
		force = Forces.add([force, thrust]);
	}	
}
function updateScore(){
	score += attractors.length;
}
function updateLives(){
	numLives--;
}
function stop(){
	cancelAnimationFrame(animId);
}
