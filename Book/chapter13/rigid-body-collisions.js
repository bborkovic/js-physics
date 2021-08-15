var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 
var canvas_bg = document.getElementById('canvas_bg');
var context_bg = canvas_bg.getContext('2d');

var blocks;
var wall;
var rho = 0.1; // density of blocks
var g = 10;
var cr = 0.4;
var k = 1;
var acc, force;	
var alp, torque;
var t0, dt;
var animId;

window.onload = init; 

function init() {
	// create a number of blocks
	blocks = new Array();
	setupBlock(6,6,45,200,90);
	setupBlock(10,10,0,240,25);
	setupBlock(20,20,30,320,40);
	setupBlock(14,6,60,380,40);
	setupBlock(10,10,-70,210,40);	
	setupBlock(20,20,-30,150,40);
	setupBlock(20,20,-130,190,70);
	setupBlock(20,20,-130,230,70);
	setupBlock(40,20,-130,300,70);
	setupBlock(20,20,-10,200,110);	
	// create a wall		
	wall = new Wall(new Vector2D(0,350),new Vector2D(canvas.width,350));	
	wall.draw(context_bg);
	// make the block move
	t0 = new Date().getTime(); 
	animFrame();
}
function setupBlock(w,h,angle,x,y){
	var m = rho*w*h;
	var im = m*(w*w+h*h)/12;
	var block = makeBlock(w,h,'#0000ff',m,im);
	block.rotation = angle*Math.PI/180;	
	block.pos2D = new Vector2D(x,y);
	blocks.push(block);	
	block.draw(context);
}
function makeBlock(w,h,col,m,im){
	var vertices = new Array();
	var vertex = new Vector2D(-w/2,-h/2);
	vertices.push(vertex);
	vertex = new Vector2D(w/2,-h/2);
	vertices.push(vertex);			
	vertex = new Vector2D(w/2,h/2);
	vertices.push(vertex);
	vertex = new Vector2D(-w/2,h/2);
	vertices.push(vertex);	
	return new PolygonRB(vertices,col,m,im); 
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
	for (var i=0; i<blocks.length; i++){
		var block = blocks[i];
		checkWallBounce(block);	
		for(var j=0;j<blocks.length;j++){
			if(j!==i){
				checkObjectCollision(block,blocks[j]);
			}
		}		
		moveObject(block);
		checkWallBounce(block);
		calcForce(block);
		updateAccel(block);
		updateVelo(block);
	}		
}
function moveObject(obj){
	obj.pos2D = obj.pos2D.addScaled(obj.velo2D,dt);	
	obj.rotation = obj.angVelo*dt;	
	obj.draw(context);	
}	
function checkWallBounce(obj){
	// collision detection
	var testCollision = false, testCollision2 = false;
	var j, j2;
	for (var i=0; i<obj.vertices.length;i++){
		if (obj.pos2D.add(obj.vertices[i].rotate(obj.rotation)).y >= wall.p1.y){
			if (testCollision==false){
				testCollision = true;
				j = i;
			}else{ // that means one vertex is already touching
				//doSomethingClever();
				j2 = i;
				testCollision2 = true; // two vertices are colliding with the wall						
			}
		}
		//console.log(obj.rotation);
	}
	// collision resolution
	if (testCollision == true){
		obj.y += obj.pos2D.add(obj.vertices[j].rotate(obj.rotation)).y*(-1) + wall.p1.y;
		if (testCollision2 == true){ // reposition the other vertex too to prevent it from sinking
			obj.y += obj.pos2D.add(obj.vertices[j2].rotate(obj.rotation)).y*(-1) + wall.p1.y;	
			testCollision2 == false;
		}		
		var normal = wall.normal;
		var rp1 = obj.vertices[j].rotate(obj.rotation);
		var vp1 = obj.velo2D.add(rp1.perp(-obj.angVelo*rp1.length()));
		var rp1Xnormal = rp1.crossProduct(normal);
		var impulse = -(1+cr)*vp1.dotProduct(normal)/(1/obj.mass + rp1Xnormal*rp1Xnormal/obj.im); 
		obj.velo2D = obj.velo2D.add(normal.multiply(impulse/obj.mass));
		obj.angVelo += rp1.crossProduct(normal)*impulse/obj.im;
		testCollision = false;
	}			
}
function checkObjectCollision(obj1,obj2){
	//general condition of nonoverlapping for object boxes
	if(obj1.pos2D.subtract(obj2.pos2D).length() < (obj1.maxVertex+obj2.maxVertex)){
		// detailed evaluation of a possible collision
		var vertex1, vertex2;
		var side2;
		for(var i=0; i< obj1.vertices.length;i++){
			vertex1 = obj1.vertices[i].rotate(obj1.rotation).add(obj1.pos2D);
			for(var j=0; j< obj2.vertices.length;j++){
				vertex2 = obj2.vertices[j].rotate(obj2.rotation).add(obj2.pos2D);
				side2 = obj2.sides[j].rotate(obj2.rotation);
				var displ_vertices = vertex2.subtract(vertex1);
				if(displ_vertices.dotProduct(side2.perp(1,true)) <= 0){
					break;
				}
			}
			if(j==obj2.vertices.length){
			//repositioning
			//calculate distances from the vertex "with problems" from object 1 to the sides of object 2
				var anglRef = 3*Math.PI;
				for(j=0; j< obj2.vertices.length;j++){
					vertex2 = (obj2.vertices[j].rotate(obj2.rotation)).add(obj2.pos2D);
					displ_vertices = vertex2.subtract(vertex1);
					var vectCheck = (displ_vertices.project(obj2.sides[j].rotate(obj2.rotation)));
					var norm2 = displ_vertices.subtract(vectCheck);
					if((Math.abs(Vector2D.angleBetween(obj1.vertices[i].rotate(obj1.rotation).multiply(-1),norm2)) < anglRef) ){
						var displ = norm2;
						anglRef = Math.abs(Vector2D.angleBetween(obj1.vertices[i].rotate(obj1.rotation).multiply(-1),norm2));
					}								
					if(norm2.length() < 1){ // vertex-vertex collision
						displ = norm2;
						break;
					}
				}
				obj1.pos2D = obj1.pos2D.add(displ);
				checkWallBounce(obj1);
				//collision resolution
				var normal = norm2.para(1);
				var rp1 = obj1.vertices[i].rotate(obj1.rotation);
				var rp2 = obj1.pos2D.add(rp1).subtract(obj2.pos2D);
				var vp1 = obj1.velo2D.add(rp1.perp(-obj1.angVelo*rp1.length()));
				var vp2 = obj2.velo2D.add(rp2.perp(-obj2.angVelo*rp2.length()));
				var vr = vp1.subtract(vp2);
				var invm1 = 1/obj1.mass;
				var invm2 = 1/obj2.mass;
				var invI1 = 1/obj1.im;
				var invI2 = 1/obj2.im;
				var rp1Xn = rp1.crossProduct(normal);
				var rp2Xn = rp1.crossProduct(normal);						
				var impulse = -(1+cr)*vr.dotProduct(normal)/(invm1 + invm2 + rp1Xn*rp1Xn*invI1 + rp2Xn*rp2Xn*invI2); 
				obj1.velo2D = obj1.velo2D.add(normal.multiply(impulse*invm1));
				obj1.angVelo += rp1.crossProduct(normal)*impulse*invI1;
				obj2.velo2D = obj2.velo2D.subtract(normal.multiply(impulse*invm2));
				obj2.angVelo += -rp2.crossProduct(normal)*impulse*invI2;
			}
		}
	}
}
function calcForce(obj){
	force = Forces.constantGravity(obj.mass,g);	
	torque = 0; // no external torque since gravity is the only force
	torque += -k*obj.angVelo; // damping	
}	
function updateAccel(obj){
	acc = force.multiply(1/obj.mass);
	alp = torque/obj.im;	
}	
function updateVelo(obj){
	obj.velo2D = obj.velo2D.addScaled(acc,dt);	
	obj.angVelo += alp*dt;		
}
function stop(){
	cancelAnimationFrame(animId);
}
