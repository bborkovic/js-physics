function Vector2D(x,y) {
	this.x = x;
	this.y = y;		
}		

// PUBLIC METHODS	
Vector2D.prototype = {		
	lengthSquared: function(){
		return this.x*this.x + this.y*this.y;
	},
	length: function(){
		return Math.sqrt(this.lengthSquared());
	},	
	clone: function() {
		return new Vector2D(this.x,this.y);
	},
	negate: function() {
		this.x = - this.x;
		this.y = - this.y;
	},
	normalize: function() {
		var length = this.length();
		if (length > 0) {
			this.x /= length;
			this.y /= length;
		}
		return this.length();
	},
	add: function(vec) {
		return new Vector2D(this.x + vec.x,this.y + vec.y);
	},
	incrementBy: function(vec) {
		this.x += vec.x;
		this.y += vec.y;
	},		
	subtract: function(vec) {
		return new Vector2D(this.x - vec.x,this.y - vec.y);
	},
	decrementBy: function(vec) {
		this.x -= vec.x;
		this.y -= vec.y;
	},		
	multiply: function(k) {
		return new Vector2D(k*this.x,k*this.y);
	},		
	addScaled: function(vec,k) {
		return new Vector2D(this.x + k*vec.x, this.y + k*vec.y);
	},	
	scaleBy: function(k) {
		this.x *= k;
		this.y *= k;
	},
	dotProduct:	function(vec) {
		return this.x*vec.x + this.y*vec.y;
	}
};		

// STATIC METHODS
Vector2D.distance =  function(vec1,vec2){
	return (vec1.subtract(vec2)).length(); 
}
Vector2D.angleBetween = function(vec1,vec2){
	return Math.acos(vec1.dotProduct(vec2)/(vec1.length()*vec2.length()));
}