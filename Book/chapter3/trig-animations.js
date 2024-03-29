var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 
var canvas_bg = document.getElementById('canvas_bg');
var context_bg = canvas_bg.getContext('2d');

var ball;
var ball1;
var xA=new Array();
var yA=new Array();
var n=0;		
var xmin=0;
var xmax=1440;		
var ymin=-1;
var ymax=1;		
var xorig=50;
var yorig=200;
var xwidth=400;
var ywidth=300;		
var xscal;
var yscal;
var idInterval;

window.onload = init; 
 
function init(){
	plotGraph();
	placeBall();
	setupTimer();
} 
 
function plotGraph(){
	var graph = new Graph(context_bg,xmin,xmax,ymin,ymax,xorig,yorig,xwidth,ywidth);			
	graph.drawgrid(180,45,0.5,0.1);				
	graph.drawaxes('x','y');	
	xscal=(xmax-xmin)/xwidth;
	yscal=(ymax-ymin)/ywidth;			
	for (var i=0; i<=200; i++){
		xA[i] = i*7.2;
		yA[i] = f(xA[i]);						   
	}
	graph.plot(xA,yA,'#ff0000',false,true);			
}

function f(x){
	var y;
	//y = Math.sin(x*Math.PI/180);
	//y = Math.sin(x*Math.PI/180)*Math.exp(-0.002*x);
	//y = Math.sin(x*Math.PI/180) + Math.sin(1.5*x*Math.PI/180);
	//y = 0.5*Math.sin(3*x*Math.PI/180) + 0.5*Math.sin(3.5*x*Math.PI/180);			
	//y = 0.2*Math.sin(x*Math.PI/180) + 0.4*Math.sin(2*x*Math.PI/180) + 0.6*Math.sin(3*x*Math.PI/180);
	//y = Math.sin(x*Math.PI/180) + Math.sin(3*x*Math.PI/180)/3;
	// y = Math.sin(x*Math.PI/180) + Math.sin(3*x*Math.PI/180)/3 + Math.sin(5*x*Math.PI/180)/5;
	//y = Math.sin(x*Math.PI/180) + Math.sin(3*x*Math.PI/180)/3 + Math.sin(5*x*Math.PI/180)/5 + Math.sin(7*x*Math.PI/180)/7;			
	y = fourierSum(10,x);
	//y = fourierSum(1000,x);
	return y;
}

function fourierSum(N,x){
	var fs=0;
	for (var nn=1; nn<=N; nn=nn+2){
		fs += Math.sin(nn*x*Math.PI/180)/nn;
	}
	return fs;
}		

function placeBall(){
	ball = new Ball(6,"#0000ff");
	ball.x = xA[0]/xscal+ xorig;
	ball.y = -yA[0]/yscal + yorig;
	ball.draw(context);	
	// place another ball instance
	ball1 = new Ball(6,"#0000ff");
	ball1.x = ball.x + 450;
	ball1.y = ball.y;	
	ball1.draw(context);		
}

function setupTimer(){
	idInterval = setInterval(moveBall, 1000/60);
}		

function moveBall(){
	ball.x = xA[n]/xscal + xorig;
	ball.y = -yA[n]/yscal + yorig;
	ball1.y = ball.y;
	context.clearRect(0, 0, canvas.width, canvas.height);  
	ball.draw(context);
	ball1.draw(context);	
	n++;
	if (n==xA.length){
		clearInterval(idInterval);				
	}
} 
 