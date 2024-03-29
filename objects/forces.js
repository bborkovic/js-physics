function Forces(){
}

// STATIC METHODS
Forces.zeroForce = function() {
	return (new Vector2D(0,0));
}
Forces.constantGravity = function(m,g){
	return new Vector2D(0,m*g);
}
Forces.gravity = function(G,m1,m2,r){
	return r.multiply(-G*m1*m2/(r.lengthSquared()*r.length()));
}
Forces.linearDrag = function(k,vel){
	var force;
	var velMag = vel.length();
	if (velMag > 0) {
		force = vel.multiply(-k);
	}else {
		force = new Vector2D(0,0);
	}
	return force;
}
Forces.add = function(arr){
		var forceSum = new Vector2D(0,0);
		for (var i=0; i<arr.length; i++){
		var force = arr[i];
		forceSum.incrementBy(force);
	}
	return forceSum;
}
