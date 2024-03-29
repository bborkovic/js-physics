// dependencies: Vector2D
function Satellite(radius,color,mass){	
	this.radius = radius;
	this.color = color;
	this.mass = mass;
	this.x = 0;
	this.y = 0;	
	this.vx = 0;
	this.vy = 0;	
	this.angVelo = 0;
}		
Satellite.prototype = {
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
		var r = this.radius; 
		var m = this.mass;
		var color = this.color;
		context.save();
		context.strokeStyle = color;
		context.lineWidth = 2;
		context.beginPath();
		context.moveTo(this.x,this.y);
		context.lineTo(this.x-2*r,this.y-r);
		context.moveTo(this.x,this.y);
		context.lineTo(this.x-2*r,this.y+r);
		context.moveTo(this.x,this.y);
		context.lineTo(this.x-1.5*r,this.y);		
		context.closePath();	
		context.stroke();	
		context.fillStyle = color;	
		context.beginPath();
		context.arc(this.x, this.y, r, 0, 2*Math.PI, true); 
		context.closePath();
		context.fill();			
		context.restore();	
	}
};
