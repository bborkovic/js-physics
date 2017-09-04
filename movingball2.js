var Ball = Universe.Ball;
var Vector = Universe.Vector;
var Shapes = Universe.Shapes;
velK = 0.99;

Universe.setCanvas('canvas');

var b = new Ball(20, "red", 30);
b.setpos( new Vector(100,100) );
b.setvel( new Vector(200,0) );
Universe.addObject(b,"ball");


var sh = Shapes.createRectangle(new Vector(Universe.width/2,Universe.height+10) , Universe.width, 10);
Universe.addObject(sh,"rect");
sh = Shapes.createRectangle(new Vector(0-10,Universe.height/2) , 10, Universe.height);
Universe.addObject(sh,"rect");
sh = Shapes.createRectangle(new Vector(Universe.width+10,Universe.height/2) , 10, Universe.height);
Universe.addObject(sh,"rect");




Universe.setGravity();

Universe.animate('canvas', 30);
