var Ball = Universe.Ball;
var Vector = Universe.Vector;
var Shapes = Universe.Shapes;
velK = 0.99;

Universe.setCanvas('canvas');

// Add balls
// var b = new Ball(20, "black", 30);
// b.setpos( new Vector( 100,100 ) );
// b.setvel( new Vector(200,0) );
// Universe.addObject(b,"ball");

// var a = new Ball(20, "black", 30);
// a.setpos( new Vector( 300,100 ) );
// a.setvel( new Vector(200,0) );
// Universe.addObject(a,"ball");

var nrBalls = 5;
for (var i = 0; i < nrBalls; i++) {
   var b = new Ball(20, "black", 30);
   b.setpos( new Vector( 60 * (i+1) , 100 ) );
   b.setvel( new Vector(200,i*40) );
   Universe.addObject(b,"ball");
}




// Add shapes
var sh = Shapes.createRectangle(new Vector(Universe.width/2,Universe.height+10) , Universe.width, 20);
Universe.addObject(sh,"rect");
sh = Shapes.createRectangle(new Vector(0-10,Universe.height/2) , 10, Universe.height);
Universe.addObject(sh,"rect");
sh = Shapes.createRectangle(new Vector(Universe.width+10,Universe.height/2) , 10, Universe.height);
Universe.addObject(sh,"rect");




Universe.setGravity( new Vector(0,1000) );
Universe.animate('canvas', 30);
