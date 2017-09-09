var Ball = Universe.Ball;
var Vector = Universe.Vector;
var Shapes = Universe.Shapes;
var Boundary = Universe.Boundary;
var Spring = Universe.Spring;
var Line = Universe.Line;
var velK = 0.9;
var airDrag = 2;

Universe.setCanvas('canvas');
Universe.addBoundary( Boundary.createRect("top",0, velK) );
Universe.addBoundary( Boundary.createRect("left",0, velK) );
Universe.addBoundary( Boundary.createRect("right",Universe.width, velK));
Universe.addBoundary( Boundary.createRect("bottom",Universe.height, velK));

// var sh = Shapes.createRectangle( new Vector(800,Universe.height/2),40,300);
// sh.transparent = true;
// Universe.addObject(sh, "rect");
// console.log(Universe.shapes);


Universe.setGravity( new Vector(0,100) );
var nrBalls = 40;
var ball_radius = 10;
var ball_mass = 2;
var hor_begin = Universe.width*1/10;
var hor_end = Universe.width*9/10;
var distance = ( hor_end - hor_begin )/nrBalls;
console.log(distance);

var balls = [];
for( var i = 0; i <= nrBalls; i++){
   var ball = new Ball(ball_radius, "black", ball_mass);
   balls.push(ball);
   ball.setpos( new Vector( hor_begin + (i*distance), Universe.height/20 ) );
   Universe.addObject(ball,"ball");
}

balls[0].fixed = true;
balls[nrBalls].fixed = true;

var heavy_ball1 = new Ball(ball_radius*3, "black", ball_mass*20);
heavy_ball1.setpos( new Vector( balls[Math.floor(nrBalls/3)].x , balls[Math.floor(nrBalls/3)].y + 3*distance)) ;
Universe.addObject(heavy_ball1, "ball");


var s = Spring.create(1000, distance); // (k, L, dumping)
var s2 = Spring.create(1000, distance*3); // (k, L, dumping)
for( var i = 0; i < nrBalls; i++ ){
   balls[i].connectTo( balls[i+1], s, true );
}
balls[ Math.floor(nrBalls*1/3)].connectTo( heavy_ball1, s2, true );







// var top_left  = Spring.create(1000, 200); // (k, L, dumping)
// var left_right = Spring.create(1000, 200); // (k, L, dumping)

// ball_top.connectTo(ball_right, s, true);
// ball_top.connectTo(ball_left, s, true);
// ball_left.connectTo(ball_right, s, true);


// b = new Ball(20, "black", 30);
// b.setpos( new Vector( 300 , Universe.height/2 ) );
// b.setvel( new Vector(0,0) );
// Universe.addObject(b,"ball");

// Add balls
// var nrBalls = 15;
// for (var i = 0; i < nrBalls; i++) {
//    var b = new Ball(20, "black", 30);
//    b.setpos( new Vector( 60 * (i+1) , 100 ) );
//    b.setvel( new Vector(200,i*40) );
//    Universe.addObject(b,"ball");
// }



Universe.animate('canvas', 100);
