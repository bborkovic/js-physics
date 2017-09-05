var Ball = Universe.Ball;
var Vector = Universe.Vector;
var Shapes = Universe.Shapes;
var Boundary = Universe.Boundary;
velK = 0.9;

Universe.setCanvas('canvas');
Universe.addBoundary( Boundary.createRect("top",0, velK) );
Universe.addBoundary( Boundary.createRect("left",0, velK) );
Universe.addBoundary( Boundary.createRect("right",Universe.width, velK));
Universe.addBoundary( Boundary.createRect("bottom",Universe.height, velK));

var b = new Ball(20, "black", 30);
b.setpos( new Vector( 300 , Universe.height-10 ) );
b.setvel( new Vector(0,0) );
Universe.addObject(b,"ball");

b = new Ball(20, "black", 30);
b.setpos( new Vector( 300 , Universe.height/2 ) );
b.setvel( new Vector(0,0) );
Universe.addObject(b,"ball");

// Add balls
// var nrBalls = 15;
// for (var i = 0; i < nrBalls; i++) {
//    var b = new Ball(20, "black", 30);
//    b.setpos( new Vector( 60 * (i+1) , 100 ) );
//    b.setvel( new Vector(200,i*40) );
//    Universe.addObject(b,"ball");
// }


Universe.setGravity( new Vector(0,1000) );
Universe.animate('canvas', 30);
