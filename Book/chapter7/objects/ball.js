// dependencies: Vector2D
function Ball(radius,color,mass,charge,gradient){
	if(typeof(radius)==='undefined') radius = 20;
	if(typeof(color)==='undefined') color = '#0000ff';
	if(typeof(mass)==='undefined') mass = 1;
	if(typeof(charge)==='undefined') charge = 0;
	if(typeof(gradient)==='undefined') gradient = false;	
	this.radius = radius;
	this.color = color;
	this.mass = mass;
	this.charge = charge;
	this.gradient = gradient;
	this.x = 0;
	this.y = 0;
	this.vx = 0;
	this.vy = 0;	
}		

Ball.prototype = {
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
		if (this.gradient){
			grad = context.createRadialGradient(this.x,this.y,0,this.x,this.y,this.radius);
			grad.addColorStop(0,'#ffffff');
			grad.addColorStop(1,this.color);
			context.fillStyle = grad;
		}else{
			context.fillStyle = this.color;
		}	
		context.beginPath();
		context.arc(this.x, this.y, this.radius, 0, 2*Math.PI, true);
		context.closePath();
		context.fill();		
	}
};
