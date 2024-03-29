var dt = 0.05;
var numSteps = 20;
var t = 0;
var g = 10;		
var v = new Vector3D(0,0,0);			
var s = new Vector3D(0,0,0);	

window.onload = init;	
	
function init(){
	simulate();
}
function simulate(){
	console.log(t,s.y);
	for (var i=0; i<numSteps; i++){
		t += dt; 				
		RK4();
		console.log(t,s.y);
	}
}
function RK4(){			
	// step 1
	var pos1 = s;
	var vel1 = v;
	var acc1 = getAcc(pos1,vel1); 
	// step 2
	var pos2 = pos1.addScaled(vel1,dt/2); 
	var vel2 = vel1.addScaled(acc1,dt/2);
	var acc2 = getAcc(pos2,vel2); 
	// step 3
	var pos3 = pos1.addScaled(vel2,dt/2); 
	var vel3 = vel1.addScaled(acc2,dt/2);
	var acc3 = getAcc(pos3,vel3); 
	// step 4
	var pos4 = pos1.addScaled(vel3,dt); 
	var vel4 = vel1.addScaled(acc3,dt);
	var acc4 = getAcc(pos4,vel4); 
	// sum vel and acc
	var velsum = vel1.addScaled(vel2,2).addScaled(vel3,2).addScaled(vel4,1);
	var accsum = acc1.addScaled(acc2,2).addScaled(acc3,2).addScaled(acc4,1);
	// update pos and velo
	s = pos1.addScaled(velsum,dt/6);
	v = vel1.addScaled(accsum,dt/6);			
	//acc = accsum.multiply(1/6);
}
function getAcc(ppos,pvel){
	return new Vector3D(0,g,0);
}
		