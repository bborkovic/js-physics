// dependencies: Vector2D
function Particle(mass,charge){
	if(typeof(mass)==='undefined') mass = 1;
	if(typeof(charge)==='undefined') charge = 0;		
	this.mass = mass;
	this.charge = charge;
	this.x = 0;
	this.y = 0;
	this.vx = 0;
	this.vy = 0;	
}		

Particle.prototype = {
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
	}
};
