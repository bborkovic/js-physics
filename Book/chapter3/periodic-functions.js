var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d'); 

var graph1 = new Graph(context,0,10,0,2,50,180,450,100);			
graph1.drawgrid(1,0.2,1,0.2);					
graph1.drawaxes('x','y');	
var graph2 = new Graph(context,0,10,0,2,50,380,450,100);			
graph2.drawgrid(1,0.2,1,0.2);			
graph2.drawaxes('x','y');	

var xA = new Array();
var y1A = new Array();
var y2A = new Array();
for (var i=0; i<=1000; i++){
	xA[i] = i*0.01;
	y1A[i] = f1(xA[i]);	
	y2A[i] = f2(xA[i]);					
}
graph1.plot(xA,y1A,0x0000ff,false,true);
graph2.plot(xA,y2A,0x0000ff,false,true);		
			
function f1(x){
	var y;
	y = x%2;
	return y;
}		
function f2(x){
	var y;
	if (x%1<0.5){
		y = 0;
	}else{
		y = 1;
	}
	return y;
}