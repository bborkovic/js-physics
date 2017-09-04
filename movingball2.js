var Ball = Universe.Ball;
var Vector = Universe.Vector;
var Shapes = Universe.Shapes;
velK = 0.9;

Universe.setCanvas('canvas');

// Add balls
var b = new Ball(10, "red", 30);
b.setpos( new Vector(100,350) );
b.setvel( new Vector(100,0) );
Universe.addObject(b,"ball");


// Add shapes
var sh = Shapes.createRectangle(new Vector(Universe.width/2,405) , Universe.width, 50);
Universe.addObject(sh,"rect");
// sh = Shapes.createRectangle(new Vector(0-10,Universe.height/2) , 10, Universe.height);
// Universe.addObject(sh,"rect");
// sh = Shapes.createRectangle(new Vector(Universe.width+10,Universe.height/2) , 10, Universe.height);
// Universe.addObject(sh,"rect");




Universe.setGravity( new Vector(0,100) );
Universe.animate('canvas', 20);
