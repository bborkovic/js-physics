// dependencies: Vector2D
function Polygon(vertices,color,mass){
	if(typeof(color)==='undefined') color = '#0000ff';
	if(typeof(mass)==='undefined') mass = 1;	
	this.vertices = vertices;
	this.color = color;
	this.mass = mass;
	this.x = 0;
	this.y = 0;
	this.vx = 0;
	this.vy = 0;	
	this.angVelo = 0;	
}		

Polygon.prototype = {
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
	set rotation (angle){ // value of rotation is not itself of interest; use it to rotate vertices
		for (var i=0; i<this.vertices.length; i++){
			this.vertices[i] = this.vertices[i].rotate(angle);
		}
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
