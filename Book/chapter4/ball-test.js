var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 

var ball = new Ball(20,'#ff0000',1,0,true);
ball.pos2D = new Vector2D(150,50);
ball.draw(context);

var balls = new Array();
var numBalls = 10;
for (var i=1; i<=numBalls; i++){
	var ball;
	var radius = (Math.random()+0.5)*20;
	var color = '#0000ff';
	ball = new Ball(radius,color,1,0,true);
	ball.pos2D = new Vector2D(Math.random()*canvas.width,Math.random()*canvas.height);
	ball.draw(context);
	balls.push(ball);
}