var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 

var graph = new Graph(context,-4,4,0,20,275,380,450,350);			
graph.drawgrid(1,0.2,5,1);			
graph.drawaxes('x','y');			
//graph.drawaxes();	// use default axis labels
	
var xvals = new Array(-4,-3,-2,-1,0,1,2,3,4);
var yvals = new Array(16,9,4,1,0,1,4,9,16);
graph.plot(xvals, yvals);
			
var xA = new Array();
var yA = new Array();
for (var i=0; i<=100; i++){
	xA[i] = (i-50)*0.08;
	yA[i] = xA[i]*xA[i];						   
}
graph.plot(xA, yA, "#ff0000", false, true);