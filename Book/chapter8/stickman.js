// dependencies: Vector2D
function StickMan(radius,color,mass){
	if(typeof(radius)==='undefined') radius = 20;
	if(typeof(color)==='undefined') color = '#0000ff';
	if(typeof(mass)==='undefined') mass = 1;	
	this.radius = radius;
	this.color = color;
	this.mass = mass;
	this.x = 0;
	this.y = 0;
	this.vx = 0;
	this.vy = 0;	
}		
StickMan.prototype = {
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
		var r = this.radius; // radius of body
		var rh = 0.5*r; // radius of head
		context.save();
		context.fillStyle = this.color;	
		context.beginPath();
		context.arc(this.x, this.y, r, 0, 2*Math.PI, true); // body
		context.arc(this.x, this.y-r-rh, rh, 0, 2*Math.PI, true); // head
		context.closePath();
		context.fill();
		context.restore();	
	}
};
