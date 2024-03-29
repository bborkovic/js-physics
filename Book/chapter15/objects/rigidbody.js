// dependencies: Vector2D
function RigidBody(mass,momentOfInertia){
	if(typeof(mass)==='undefined') mass = 1;
	if(typeof(momentOfInertia)==='undefined') momentOfInertia = 1;		
	this.mass = mass;
	this.im = momentOfInertia;
	// x and y also define the center of mass
	this.x = 0;
	this.y = 0;
	this.vx = 0;
	this.vy = 0;	
}		

RigidBody.prototype = {
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
