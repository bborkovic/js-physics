var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 
var canvas_bg = document.getElementById('canvas_bg');
var context_bg = canvas_bg.getContext('2d');

var ball;
var xA=new Array();
var yA=new Array();
var n=0;		
var xmin=-2;
var xmax=2;		
var ymin=-2;
var ymax=2;		
var xorig=275;
var yorig=210;
var xwidth=350;
var ywidth=350;		
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
	graph.drawgrid(1,0.2,1,0.2);			
	graph.drawaxes('x','y');	
	xscal=(xmax-xmin)/xwidth;
	yscal=(ymax-ymin)/ywidth;			
	for (var i=0; i<=1000; i++){
		//	xA[i] = (i-500)*0.02; // goes outside range for which function is defined
		xA[i] = (i-500)*0.002;				
		yA[i] = f(xA[i]);							   
	}
	graph.plot(xA,yA,'#ff0000',false,true);			
}

function f(x){
	var y;
	y = -Math.sqrt(1-x*x);
	return y;
}

function placeBall(){
	ball = new Ball(6,"#0000ff");
	ball.x = xA[0]/xscal+ xorig;
	ball.y = -yA[0]/yscal + yorig;
	ball.draw(context);			
}

function setupTimer(){
	idInterval = setInterval(moveBall, 1000/60);
}		

function moveBall(){
	ball.x = xA[n]/xscal + xorig;
	ball.y = -yA[n]/yscal + yorig;
	context.clearRect(0, 0, canvas.width, canvas.height);  
	ball.draw(context);
	n++;
	if (n==xA.length){
		clearInterval(idInterval);				
	}
} 
 