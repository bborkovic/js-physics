// dependencies: Vector2D
function Wheel(innerRadius,outerRadius,numSpokes){	
	this.ir = innerRadius;
	this.or = outerRadius;
	this.nums = numSpokes;
	this.x = 0;
	this.y = 0;	
	this.vx = 0;
	this.vy = 0;	
	this.rotation = 0;
}		
Wheel.prototype = {
	get pos2D (){
		return new Vector2D(this.x,this.y);			
	},
	set pos2D (pos){
		this.x = pos.x;
		this.y = pos.y;
	},
	get velo2D (){
		return new Vector2D(this.vx,this.vy);			
	},
	set velo2D (velo){
		this.vx = velo.x;
		this.vy = velo.y;
	},
	draw: function (context) {  
		var ir = this.ir; 
		var or = this.or;
		var nums = this.nums;
		context.save();
		context.fillStyle = '#000000';	
		context.beginPath();
		context.arc(this.x, this.y, or, 0, 2*Math.PI, true); 
		context.closePath();
		context.fill();	
		context.fillStyle = '#ffffaa';	
		context.beginPath();
		context.arc(this.x, this.y, ir, 0, 2*Math.PI, true); 
		context.closePath();
		context.fill();
		context.strokeStyle = '#000000';
		context.lineWidth = 4;
		context.beginPath();
		for (var n=0; n<nums; n++){
			context.moveTo(this.x,this.y);
			context.lineTo(this.x+ir*Math.cos(2*Math.PI*n/nums+this.rotation),this.y+ir*Math.sin(2*Math.PI*n/nums+this.rotation));
		}		
		context.closePath();	
		context.stroke();	
		context.restore();	
	}
};
