function Vector3D(x,y,z) {
	this.x = x;
	this.y = y;	
	this.z = z;	
}		

// PUBLIC METHODS	
Vector3D.prototype = {		
	lengthSquared: function(){
		return this.x*this.x + this.y*this.y + this.z*this.z;
	},
	length: function(){
		return Math.sqrt(this.lengthSquared());
	},	
	clone: function() {
		return new Vector3D(this.x,this.y,this.z);
	},
	negate: function() {
		this.x = - this.x;
		this.y = - this.y;
		this.z = - this.z;		
	},
	unit: function() {
		var length = this.length();	
		if (length > 0) {
			return new Vector3D(this.x/length,this.y/length,this.z/length);
		}else{
			return new Vector3D(0,0,0);
		}
	},		
	normalize: function() {
		var length = this.length();
		if (length > 0) {
			this.x /= length;
			this.y /= length;
			this.z /= length;			
		}
		return this.length();
	},
	add: function(vec) {
		return new Vector3D(this.x + vec.x,this.y + vec.y,this.z + vec.z);
	},
	incrementBy: function(vec) {
		this.x += vec.x;
		this.y += vec.y;
		this.z += vec.z;		
	},		
	subtract: function(vec) {
		return new Vector3D(this.x - vec.x,this.y - vec.y,this.z - vec.z);
	},
	decrementBy: function(vec) {
		this.x -= vec.x;
		this.y -= vec.y;
		this.z -= vec.z;		
	},		
	multiply: function(k) {
		return new Vector3D(k*this.x,k*this.y,k*this.z);
	},		
	addScaled: function(vec,k) {
		return new Vector3D(this.x + k*vec.x, this.y + k*vec.y, this.z + k*vec.z);
	},	
	scaleBy: function(k) {
		this.x *= k;
		this.y *= k;
		this.z *= k;		
	},
	dotProduct:	function(vec) {
		return this.x*vec.x + this.y*vec.y + this.z*vec.z;
	},
	crossProduct: function(vec) {
		return new Vector3D(this.y*vec.z-this.z*vec.y,this.z*vec.x-this.x*vec.z,this.x*vec.y-this.y*vec.x);
	},
	prod: function(vec) {
		return new Vector3D(this.x*vec.x,this.y*vec.y,this.z*vec.z);
	},	
	div: function(vec) {
		return new Vector3D(this.x/vec.x,this.y/vec.y,this.z/vec.z);
	}	
};		

// STATIC METHODS
Vector3D.distance =  function(vec1,vec2){
	return (vec1.subtract(vec2)).length(); 
}
Vector3D.angleBetween = function(vec1,vec2){
	return Math.acos(vec1.dotProduct(vec2)/(vec1.length()*vec2.length()));
}
Vector3D.scale = function(vec,sca){
	vec.x *= sca;
	vec.y *= sca;
	vec.z *= sca;	
}