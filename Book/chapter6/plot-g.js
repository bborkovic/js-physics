var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 

var graph = new Graph(context,0,10,0,10,50,350,450,300);			
graph.drawgrid(1,0.2,2,0.4);					
graph.drawaxes('r / R','g');

var rA = new Array();
var gA = new Array();		
for (var i=0; i<=100; i++){
	var r;
	rA[i] = i*0.1;
	r = rA[i];
	if (r<=1){
		gA[i] = 9.81*r;
	}else{
		gA[i] = 9.81/(r*r);
	}
}
graph.plot(rA, gA, '#ff0000', false, true);
