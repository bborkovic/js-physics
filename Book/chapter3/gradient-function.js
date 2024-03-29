var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 

var numPoints=1001;
var numGrad=50;		
var xRange=6;
var xStep;
		
var graph = new Graph(context,-4,4,-10,10,275,210,450,350);			
graph.drawgrid(1,0.2,2,0.5);			
graph.drawaxes('x','y');
var xA = new Array();
var yA = new Array();
// calculate function
xStep = xRange/(numPoints-1);
for (var i=0; i<numPoints; i++){
	xA[i] = (i-numPoints/2)*xStep;
	yA[i] = f(xA[i]);						   
}
graph.plot(xA,yA,'#ff0000',false,true); // plot function
// calculate gradient function using forward method
var xAr = new Array();			
var gradA = new Array();
for (var j=0; j<numPoints-numGrad; j++){
	xAr[j] = xA[j];
	gradA[j] = grad(xA[j],xA[j+numGrad]);						   
}
graph.plot(xAr,gradA,'#0000ff',false,true); // plot gradient function
// calculate gradient function using centered method
var xArc = new Array();			
var gradAc = new Array();
for (var k=numGrad; k<numPoints-numGrad; k++){
	xArc[k-numGrad] = xA[k];
	gradAc[k-numGrad] = grad(xA[k-numGrad],xA[k+numGrad]);
}
graph.plot(xArc,gradAc,'#00ff00',false,true); // plot gradient function				

function f(x){
	var y;
	y = x*x;
	return y;
}

function grad(x1,x2){
	return (f(x1)-f(x2))/(x1-x2);
}			
