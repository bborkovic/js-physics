var room = new Room('canvas');
velK = 1;

var obstacle = new ObstacleGeneral();
var line = Line.create( new Vector(500,200), new Vector(200,300) );
var line_offset = line.getOffsetLine(10);

obstacle.addLine( line );
obstacle.draw(room.context, "red");

var ball = new Ball(10,"red",10);
ball.setpos( new Vector(200,200));
ball.draw(room.context);
ball.setpos( new Vector(300,400));
ball.draw(room.context);

obstacle.checkConstraint(ball);







// var line_obs = Line.create( new Vector(0,0), new Vector(10,0) );
// var line_ball = Line.create( new Vector(4,-1), new Vector(1,1/2) );

// var intersect = line_obs.getIntersect(line_ball); // point

// if( intersect ) {
//    var over = line_ball.p2.subtract(intersect);
//    // console.log(over);
   
//    dot_normal = over.dotProduct(line_obs.normal);
//    dot_direction = over.dotProduct(line_obs.direction);

//    var over_after_bounce_n = line_obs.normal.multiply(dot_normal);
//    var over_after_bounce_d = line_obs.direction.multiply(dot_direction);

//    var over_after_bounce = over_after_bounce_d.add(over_after_bounce_n.multiply(-1));
//    console.log(over_after_bounce);
   
//    var over_after_bounce_norm = over_after_bounce.clone();
//    over_after_bounce_norm.normalize();
//    console.log(over_after_bounce_norm);

//    console.log( intersect.add(over_after_bounce) );


// }


