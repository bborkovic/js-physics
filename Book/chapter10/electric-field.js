var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 
var canvas_bg = document.getElementById('canvas_bg');
var context_bg = canvas_bg.getContext('2d');

var k = 1;
var attractors;
var orbiters;
var t0;
var dt;
var force;
var acc;
var numOrbiters = 3;
var numAttractors = 20;
var graph;

window.onload = init; 

function init() {
	// create attractors
	attractors = new Array();
	for (var i=0; i<numAttractors; i++){	
		var r = 20*(Math.random()+0.5);
		var charge = (Math.random()-0.5)*1000000;
		if (charge<0){
			color = '#ff0000';
		}else if(charge>0){
			color = '#0000ff';
		}else{
			color = '#000000';
		}
		var attractor = new Ball(r,color,1,charge,true);	
		attractor.pos2D = new Vector2D(Math.random()*canvas.width,Math.random()*canvas.height);;
		attractor.draw(context_bg);
		attractors.push(attractor);
	}	
	// create orbiters
	orbiters = new Array();
	//var color = new Array('#0000ff','#ff0000','#00ff00');
	for (var i=0; i<numOrbiters; i++){	
		//var orbiter = new Ball(5,color[i],1,1,true);	
		var orbiter = new Ball(5,'#0000ff',1,1,true);	
		orbiter.pos2D = new Vector2D(Math.random()*canvas.width,Math.random()*canvas.height);
		orbiter.velo2D = new Vector2D((Math.random()-0.5)*100,(Math.random()-0.5)*100);
		orbiter.draw(context);
		orbiters.push(orbiter);
	}  
	setupGraph();
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
	for (var i=0; i<numOrbiters; i++){
		var orbiter = orbiters[i];	
		plotGraph(orbiter);
		moveObject(orbiter);
		calcForce(orbiter);
		updateAccel(orbiter.mass);
		updateVelo(orbiter);				
	}
}
function moveObject(obj){
	obj.pos2D = obj.pos2D.addScaled(obj.velo2D,dt);	
	if (obj.x < 0 || obj.x > canvas.width || obj.y < 0 || obj.y > canvas.height){
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
	var electric;
	force = Forces.zeroForce();
	for (var i=0; i<numAttractors; i++){
		var attractor = attractors[i];	
		var dist = obj.pos2D.subtract(attractor.pos2D);
		if (dist.length() > attractor.radius+obj.radius){
			electric = Forces.electric(k,attractor.charge,obj.charge,dist);
			force = Forces.add([force, electric]);		
		}else{
			recycleOrbiter(obj);
		}
	}			
}
function recycleOrbiter(obj){
	obj.pos2D = new Vector2D(Math.random()*canvas.width,Math.random()*canvas.height);
	obj.velo2D = new Vector2D((Math.random()-0.5)*100,(Math.random()-0.5)*100);
}
function setupGraph(){	
	graph = new Graph(context_bg,0,canvas.width,0,canvas.height,0,0,canvas.width,canvas.height);						
}
function plotGraph(obj){
	graph.plot([obj.x], [-obj.y], obj.color, false, true);		
}
