// config
var ball_radius = 10;
var nrBalls = 20;
var accel = new Vector(0,0);
var velK  = 1;
var velK2 = 1;
animTime = 0;
// animDuration = (1800-50)/1000;
animDuration = 60;


// create Room and obstacles
var room = new Room('canvas');
   // array of obstacles
   var obstPerRow = 4;
   for (var i = 0; i <= obstPerRow; i++) {
      for (var j = 0; j <= obstPerRow; j++) {
         obstacle = Shapes.createRectangle( new Vector(room.width*i/obstPerRow, room.height*j/obstPerRow), 80, 80, Math.PI/4 );
         room.addObstacle(obstacle);
      }
   }

var balls = [];
for (var i = 0; i < nrBalls; i++) {
   (function(ii){
      setTimeout(function(){
         var color = "black";
         var ball = new Ball(ball_radius,color,10);
         ball.setpos( new Vector( Math.random()*room.width, Math.random()*room.height ));
         ball.setvel( Vector.createPolar( - (Math.PI/4 + Math.random()*Math.PI/2) , 100));
         balls.push(ball);
      }, 20 * i);
   })(i);
}



init();



function init() {
	t0 = new Date().getTime(); 
	animFrame();
};

function animFrame(){
	if(animTime < animDuration) {
		animId = requestAnimationFrame(animFrame,room.canvas);
        onTimer();
	} else { stop(); }
}

function onTimer(){
	var t1 = new Date().getTime();
   var t_diff = t1-t0;
	dt = 0.001*(t1-t0); // get seconds 
   animTime += dt;
	t0 = t1;
	// if (dt > 0.2) { dt=0; };
	move(dt);
}
function move(dt){
	moveObjects(dt);
	// calcForce();
	// updateAccel();
	// updateVelo();
	// updateMass();
	// monitor();
}

function moveObjects(dt){
   // context.clearRect(0, 0, width, height);
   room.clear();
   for (var i = 0; i < balls.length; i++) {
      var ball = balls[i];
      ball.move(dt, accel);
      room.checkConstraint( ball );
   }

   for (var i = 0; i < balls.length - 1; i++) {
      var ball1 = balls[i];
      for (var j = i+1; j < balls.length; j++) {
         var ball2 = balls[j];
         ball1.checkCollision(ball2);
      }
   }

   for (var i = 0; i < balls.length; i++) {
      balls[i].draw(room.context);
   }
}

function calcForce(){
	var gravity = Forces.gravity(G,massPlanet,rocket.mass,rocket.pos2D.subtract(centerPlanet));	
	var thrust = new Vector2D(0,0);
	var thrustSide = new Vector2D(0,0);			
	if (fuelUsed < fuelMass){
		thrust = ve.multiply(-dmdt);
	}
	if (fuelSideUsed < fuelSideMass && applySideThrust){
		thrustSide = veSide.multiply(-dmdtSide*orientation);		
	}			
	force = Forces.add([gravity, thrust, thrustSide]);	
}	
function updateAccel(){
	acc = force.multiply(1/rocket.mass);
}	
function updateVelo(){
	rocket.velo2D = rocket.velo2D.addScaled(acc,dt);
}
function updateMass(){
	if (fuelUsed < fuelMass){
		fuelUsed += dmdt*dt;
		rocket.mass += -dmdt*dt;							
	}
	if (fuelSideUsed < fuelSideMass && applySideThrust){
		fuelSideUsed += dmdtSide*dt;
		rocket.mass += -dmdtSide*dt;
	}				
}	
function monitor(){	
	if (showExhaust && fuelUsed >= fuelMass){
		showExhaust = false; 
	}
	if (rocket.pos2D.subtract(centerPlanet).lengthSquared() < radiusPlanetSquared){
		stop(); 
	}
}
function startSideThrust(evt){ 
	if (evt.keyCode==39){ // right arrow
		applySideThrust = true;
		orientation = 1;
	}
	if (evt.keyCode==37){ // left arrow
		applySideThrust = true;
		orientation = -1;
	}			
}
function stopSideThrust(evt){ 
	applySideThrust = false;
}
function stop(){
	cancelAnimationFrame(animId);
}
