// dependencies: Vector2D
function PolygonRB(vertices,color,mass,momentOfInertia){
	if(typeof(color)==='undefined') color = '#0000ff';
	if(typeof(mass)==='undefined') mass = 1;	
	if(typeof(momentOfInertia)==='undefined') momentOfInertia = 1;	
	this.vertices = vertices;
	this.color = color;
	this.mass = mass;
	this.im = momentOfInertia;
	// x and y also define the center of mass
	this.x = 0;
	this.y = 0;
	this.vx = 0;
	this.vy = 0;	
	this.angVelo = 0;	
	this.theta = 0;
}		

PolygonRB.prototype = {
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
	get rotation (){
		return this.theta;
	},	
	set rotation (angle){ 
		this.theta = angle;
		for (var i=0; i<this.vertices.length; i++){
			this.vertices[i] = this.vertices[i].rotate(angle);
		}
	},	
	// returns the vertex furthest from the center of mass
	get maxVertex(){
		var vertex = 0;
		for(var i=1;i<this.vertices.length;i++){
			if(this.vertices[i].length()>vertex){
				vertex = this.vertices[i].length();
			}
		}
		return vertex;
	},	
	get sides(){
		var sidesArr = new Array();
		var side;
		for(var i=0; i<this.vertices.length-1; i++){
			side = this.vertices[i+1].subtract(this.vertices[i]);
			sidesArr.push(side);
		}
		side = this.vertices[0].subtract(this.vertices[i]);
		sidesArr.push(side);	
		return sidesArr;	
	},
	draw: function (ctx) {  
		var v = new Array();
		for (var i=0; i<this.vertices.length; i++){
			v[i] = this.vertices[i].add(this.pos2D);
		}
		ctx.save();
		ctx.fillStyle = this.color;
		ctx.beginPath();	
		ctx.moveTo(v[0].x,v[0].y);
		for (var i=1; i<v.length; i++){
			ctx.lineTo(v[i].x,v[i].y);
		}
		ctx.lineTo(v[0].x,v[0].y);
		ctx.closePath();
		ctx.fill();	
		ctx.restore();
	}
};
