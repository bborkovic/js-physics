function Plane(width,height,color,mass){
	if(typeof(width)==='undefined') width = 20;
	if(typeof(height)==='undefined') height = 40;	
	if(typeof(color)==='undefined') color = '#0000ff';
	if(typeof(mass)==='undefined') mass = 1;	
	this.width = width;
	this.height = height;
	this.color = color;
	this.mass = mass;
	this.x = 0;
	this.y = 0;
	this.vx = 0;
	this.vy = 0;	
}
Plane.prototype = {
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
		//var capsule = new Triangle(this.x,this.y,this.width,this.height,this.color);
		context.fillStyle = this.color;
		// fuselage
		context.fillRect(this.x,this.y,this.width,this.height);
		// cockpit
		context.beginPath() ;
		context.moveTo(this.x+this.width,this.y);
		context.lineTo(this.x+1.25*this.width,this.y+this.height);
		context.lineTo(this.x+this.width,this.y+this.height);
		context.lineTo(this.x+this.width,this.y);
		context.fill();
		context.closePath() ;
		// tail
		context.beginPath() ;
		context.moveTo(this.x,this.y);
		context.lineTo(this.x+0.25*this.width,this.y);
		context.lineTo(this.x,this.y-this.height);
		context.lineTo(this.x,this.y);
		context.fill();
		context.closePath() ;		
		// windows
		context.fillStyle = '#ffffff';
		context.beginPath();
		for (var i=1; i<4; i++){
			context.arc(this.x+0.3*i*this.width, this.y+0.5*this.height, 0.25*this.height, 0, 2*Math.PI, true);
			context.fill(); 	
		}		
		context.closePath(); 				
	}
};

		