var Ball = Universe.Ball;
var Vector = Universe.Vector;
var Shapes = Universe.Shapes;
var Boundary = Universe.Boundary;
var Spring = Universe.Spring;
velK = 0.95;

Universe.setCanvas('canvas');
Universe.addBoundary( Boundary.createRect("top",0, velK) );
Universe.addBoundary( Boundary.createRect("left",0, velK) );
Universe.addBoundary( Boundary.createRect("right",Universe.width, velK));
Universe.addBoundary( Boundary.createRect("bottom",Universe.height, velK));

// 
var b1 = new Ball(20, "black", 30);
b1.setpos( new Vector( 300 , Universe.height/2 ) );
b1.setvel( new Vector(200,0) );
Universe.addObject(b1,"ball");
//
var b2 = new Ball(20, "black", 30);
b2.setpos( new Vector( 500 , Universe.height/2 ) );
b2.setvel( new Vector(200,0) );
Universe.addObject(b2,"ball");

// b1.connectTo(b2, s1);

var s1 = Spring.create(10,10);
var s2 = Spring.create(20,20);



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


Universe.setGravity( new Vector(0,1000) );
Universe.animate('canvas', 30);
