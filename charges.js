var Ball = Universe.Ball;
var Vector = Universe.Vector;
var Shapes = Universe.Shapes;
var Boundary = Universe.Boundary;
var Spring = Universe.Spring;
var Line = Universe.Line;
var velK = 1;
var airDrag = 0;

Universe.setCanvas('canvas');
Universe.addBoundary( Boundary.createRect("top",0, velK) );
Universe.addBoundary( Boundary.createRect("left",0, velK) );
Universe.addBoundary( Boundary.createRect("right",Universe.width, velK));
Universe.addBoundary( Boundary.createRect("bottom",Universe.height, velK));
var s1 = Shapes.createRectangle( Vector.create(Universe.width*2/3, -10), 20, Universe.height, 0);
var s2 = Shapes.createRectangle( Vector.create(Universe.width*2/3, Universe.height+10), 20, Universe.height, 0);
Universe.addObject(s1,"rect");
Universe.addObject(s2,"rect");
Universe.setGravity( new Vector(0,0) );

var nr_balls = 100;
var charge = 100;
var vel_initial_close = 500;
var vel_initial_close2 = 500;
var vel_initial_far = 0;
var ball_mass = 4;
var ball_radius = 2;
var distance_close = 40;
var distance_far = 0;

for(var i = 0; i < nr_balls; i++){
	var ball = new Ball(ball_radius, "black", ball_mass);
	ball.setpos( new Vector( Universe.width/3 + 50 * (Math.random()-1/2), Universe.height/2 + 50 * (Math.random()-1/2)));
	ball.setvel( new Vector(  vel_initial_close * (Math.random()-1/2) , vel_initial_close * (Math.random()-1/2)));
	// ball.setDrawTails(true, 10);
	Universe.addObject(ball,"ball");
}

// var ball = new Ball(ball_radius, "red", ball_mass);
// ball.setpos( new Vector( Universe.width/2 - distance_far + distance_close, Universe.height/2));
// ball.setvel( new Vector( 0 , - vel_initial_far - vel_initial_close2));
// // ball.setDrawTails(true, 4000);
// Universe.addObject(ball,"ball");

// var ball = new Ball(ball_radius, "green", ball_mass);
// ball.setpos( new Vector( Universe.width/2 - distance_far - distance_close, Universe.height/2));
// ball.setvel( new Vector( 0 , - vel_initial_far + vel_initial_close2));
// Universe.addObject(ball,"ball");

// var ball = new Ball(ball_radius, "blue", ball_mass);
// ball.setpos( new Vector( Universe.width/2 - distance_far, Universe.height/2  + distance_close));
// ball.setvel( new Vector( + vel_initial_close , - vel_initial_far ));
// Universe.addObject(ball,"ball");

// var ball = new Ball(ball_radius, "black", ball_mass);
// ball.setpos( new Vector( Universe.width/2 - distance_far, Universe.height/2 - distance_close));
// ball.setvel( new Vector( - vel_initial_close , - vel_initial_far));
// Universe.addObject(ball,"ball");



frameNo = 0;
function draw(){
	frameNo ++;
	if ( frameNo%50 == 0) {
		console.log('Total kinetic energy = ' + getKineticEnergy());
	}
}

function getKineticEnergy() {
	var tot = 0;
	for(var i = 0; i < Universe.balls.length; i++){
		tot += Universe.balls[i].getvel().lengthSquared();
	}
	return Math.round(tot/1000,2);
}

// var nrBalls = 40;
// var ball_radius = 10;
// var ball_mass = 2;
// var hor_begin = Universe.width*1/10;
// var hor_end = Universe.width*9/10;
// var distance = ( hor_end - hor_begin )/nrBalls;
// console.log(distance);

// var balls = [];
// for( var i = 0; i <= nrBalls; i++){
//    var ball = new Ball(ball_radius, "black", ball_mass);
//    balls.push(ball);
//    ball.setpos( new Vector( hor_begin + (i*distance), Universe.height/20 ) );
//    Universe.addObject(ball,"ball");
// }

// balls[0].fixed = true;
// balls[nrBalls].fixed = true;

// var heavy_ball1 = new Ball(ball_radius*3, "black", ball_mass*20);
// heavy_ball1.setpos( new Vector( balls[Math.floor(nrBalls/3)].x , balls[Math.floor(nrBalls/3)].y + 3*distance)) ;
// Universe.addObject(heavy_ball1, "ball");


// var s = Spring.create(1000, distance); // (k, L, dumping)
// var s2 = Spring.create(1000, distance*3); // (k, L, dumping)
// for( var i = 0; i < nrBalls; i++ ){
//    balls[i].connectTo( balls[i+1], s, true );
// }
// balls[ Math.floor(nrBalls*1/3)].connectTo( heavy_ball1, s2, true );







// // var top_left  = Spring.create(1000, 200); // (k, L, dumping)
// // var left_right = Spring.create(1000, 200); // (k, L, dumping)

// // ball_top.connectTo(ball_right, s, true);
// // ball_top.connectTo(ball_left, s, true);
// // ball_left.connectTo(ball_right, s, true);


// // b = new Ball(20, "black", 30);
// // b.setpos( new Vector( 300 , Universe.height/2 ) );
// // b.setvel( new Vector(0,0) );
// // Universe.addObject(b,"ball");

// // Add balls
// // var nrBalls = 15;
// // for (var i = 0; i < nrBalls; i++) {
// //    var b = new Ball(20, "black", 30);
// //    b.setpos( new Vector( 60 * (i+1) , 100 ) );
// //    b.setvel( new Vector(200,i*40) );
// //    Universe.addObject(b,"ball");
// // }



Universe.animate('canvas', 1000);
