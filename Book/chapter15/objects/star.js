// dependencies: Vector2D
function Star(radius,color,mass){
	if(typeof(radius)==='undefined') radius = 5;
	if(typeof(color)==='undefined') color = '#ffff00';
	if(typeof(mass)==='undefined') mass = 1;	
	this.radius = radius;
	this.color = color;
	this.mass = mass;
	this.x = 0;
	this.y = 0;
	this.vx = 0;
	this.vy = 0;		
}		

Star.prototype = {
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
		context.fillStyle = this.color;
		context.beginPath();
		context.arc(this.x, this.y, this.radius, 0, 2*Math.PI, true);
		context.closePath();
		context.fill();		
	}
};
