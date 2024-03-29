// dependencies: Vector2D
function Spark(radius,r,g,b,alpha,mass){
	if(typeof(radius)==='undefined') radius = 2;
	if(typeof(r)==='undefined') r = 255;
	if(typeof(g)==='undefined') g = 255;
	if(typeof(b)==='undefined') b = 255;	
	if(typeof(alpha)==='undefined') alpha = 1;	
	if(typeof(mass)==='undefined') mass = 1;	
	this.radius = radius;
	this.r = r;
	this.g = g;
	this.b = b;
	this.alpha = alpha;
	this.mass = mass;
	this.x = 0;
	this.y = 0;
	this.vx = 0;
	this.vy = 0;		
}		

Spark.prototype = {
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
		context.fillStyle = "rgba("+ this.r +","+ this.g +","+ this.b +","+ this.alpha +")";
		context.beginPath();
		context.arc(this.x, this.y, this.radius, 0, 2*Math.PI, true);
		context.closePath();
		context.fill();		
	}
};
