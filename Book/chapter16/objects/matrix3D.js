// dependencies: Vector3D
function Matrix3D(v1,v2,v3) { // v1, v2, v3 are of Vector3D type
	this.v1 = v1;
	this.v2 = v2;	
	this.v3 = v3;	
}		

// PUBLIC METHODS	
Matrix3D.prototype = {		
	multiply: function(vec) { // multiply by a Vector3D object
		return new Vector3D(vec.dotProduct(this.v1),vec.dotProduct(this.v2),vec.dotProduct(this.v3));
	},			
	scaleBy: function(k) { // scale by a number
		this.v1.scaleBy(k);
		this.v2.scaleBy(k);
		this.v3.scaleBy(k);
	}	
};		
