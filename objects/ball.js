(function(){

   var Vector = Universe.Vector;
   var Common = Universe.Common;

   // dependencies: Vector
   function Ball(radius,color,mass,charge,gradient){
   	if(typeof(radius)==='undefined') radius = 20;
   	if(typeof(color)==='undefined') color = '#0000ff';
   	if(typeof(mass)==='undefined') mass = 1;
   	if(typeof(charge)==='undefined') charge = 0;
   	if(typeof(gradient)==='undefined') gradient = false;
   	this.id = Common.seqNextValue();
      this.connections = [];
      this.fixed = false;
      this.radius = radius;
   	this.color = color;
   	this.mass = mass;
   	this.charge = charge;
   	this.gradient = gradient;
   	this.charge = 0;
   	this.is_charged = false;
   	this.x = 0;
   	this.y = 0;
   	this.vx = 0;
   	this.vy = 0;
   	this.vx_prev = 0;
   	this.vy_prev = 0;
      this.ax = 0;
      this.ay = 0;
      this.x_prev = 0;
      this.y_prev = 0;
      this.x_prev_array = [];
      this.y_prev_array = [];
      this.to_drawTail = false;
      this.attractive = false;
   }		

   Ball.prototype = {

   	setDrawTails: function( to_draw_tail, n_history ) {
   		this.to_drawTail = to_draw_tail;
   		this.drawTailHistoryLength = n_history;
   	}, 

      connectTo: function(ball2, spring, andReverse) {
         andReverse = andReverse || false;
         this.connections.push( { ball: ball2, spring: spring} );
         if ( andReverse ){
            ball2.connectTo( this, spring, false);
         }
      },

      getpos: function(){
   		return new Vector(this.x,this.y);
   	},

      getprevpos: function(){
         return new Vector(this.x_prev,this.y_prev);
      },

   	setpos: function(pos){
         this.x_prev = this.x;
         this.y_prev = this.y;
         this.x = pos.x;
   		this.y = pos.y;
         // this.logposition();
   	},

   	setcharge: function(charge) {
   		// console.log("Charge set to: " + this.charge);
   		// console.log("Is charged: " + this.is_charged);
   		this.charge = charge;
   		if( charge != 0) {
   			this.is_charged = true;   			
   		}
   		// console.log("Charge set to: " + this.charge);
   		// console.log("Is charged: " + this.is_charged);
   	},

      // logposition: function(){
      //    this.x_prev_array.unshift( this.x );
      //    this.y_prev_array.unshift( this.y );
      //    if( this.x_prev_array.length > 10 ){
      //       this.x_prev_array.pop();
      //       this.y_prev_array.pop();
      //    }
      // },

   	getvel: function(){
   		return new Vector(this.vx,this.vy);
   	},
   	setvel: function(velo){
   		this.vx_prev = this.vx;
   		this.vy_prev = this.vy;
   		this.vx = velo.x;
   		this.vy = velo.y;
   	},

      setaccel: function( accel ){
         this.ax = accel.x;
         this.ay = accel.y;
      },

      getaccel: function(){
         return new Vector( this.ax, this.ay );
      },


      move(dt) {
         if( this.fixed ) {
            return;
         }
         // calculate new position
         var pos = this.getpos();
        		
        	// var vel = Vector.create( (this.vx + this.vx_prev)/2 , (this.vy + this.vy_prev)/2 );
        	vel = this.getvel();
         // var newpos = pos.add( vel.multiply(dt).addScaled(accel, (1/2) * dt*dt)); //   .add(accel.multiply( (1/2) * dt*dt)));
         var newpos = pos.add( vel.multiply(dt));
         this.setpos( newpos );
         // var newvel = vel.addScaled(accel,dt * 0.5);
         // this.setvel( newvel );
      },

      getSpringPullback: function() {
         self = this;
         // returns force from other balls and springsi
         var forceTotal = Vector.create(0,0);
         self.connections.forEach( function(connection){
            var ball2 = connection.ball;
            var k = connection.spring.k;
            var L = connection.spring.L;
            var vectFromBall = self.getpos().subtract(ball2.getpos());
            var distance = vectFromBall.length();
            var forceFromBall = vectFromBall.unit().multiply( k * Math.abs(distance-L));
            if ( distance > L ){
               forceFromBall.negate();
            }
            forceTotal.incrementBy(forceFromBall);
         } );
         return forceTotal;
      },

      getForceFromOtherBall: function(otherBall) {
         self = this;
         if ( this.attractive ) {
	         var vectFromBall = self.getpos().subtract(otherBall.getpos());
	         var distance = vectFromBall.length();
	         var dist = ( distance < ( self.radius + otherBall.radius )  ) ? ( self.radius + otherBall.radius ) : distance;
	         var forceFromBall = vectFromBall.unit().multiply( 10000 * (self.mass * otherBall.mass) / (  dist  ^2));
	         return forceFromBall.negate();
         } else {
         	return Vector.create(0,0);
         }

      },


      checkCollision(ball2) {
         var ball1 = this;
         var pos1 = ball1.getpos();
         var pos2 = ball2.getpos();
         var r1 = ball1.radius;
         var r2 = ball2.radius;
         var dist = pos1.subtract(pos2);
         var L = dist.length();
         if( L <= r1 + r2 ) {
            var vel1 = ball1.getvel();
            var vel2 = ball2.getvel();
            var over = r1 + r2 - L;
            var normalVelo1 = vel1.project(dist);
            var normalVelo2 = vel2.project(dist);
            var tangentVelo1 = vel1.subtract(normalVelo1);
            var tangentVelo2 = vel2.subtract(normalVelo2);
            var vrel = normalVelo1.subtract(normalVelo2).length(); // relative normal speeds
            ball1.setpos( pos1.addScaled(normalVelo1.unit(), -1 * over * normalVelo1.length() / vrel ));
            ball2.setpos( pos2.addScaled(normalVelo2.unit(), -1 * over * normalVelo2.length() / vrel ));
            var m1 = ball1.mass;
            var m2 = ball2.mass;
            var u1 = normalVelo1.projection(dist);
            var u2 = normalVelo2.projection(dist);
            var v1 = ((m1-m2)*u1+2*m2*u2)/(m1+m2);
            var v2 = ((m2-m1)*u2+2*m1*u1)/(m1+m2);
            normalVelo1 = dist.para(v1);
            normalVelo2 = dist.para(v2);
            // final velocity vectors after collision
            ball1.setvel( normalVelo1.add(tangentVelo1) );
            ball2.setvel( normalVelo2.add(tangentVelo2) );
         }
      },

      draw: function(context) {
      	if ( !this.to_drawTail ) {
      		this.drawCurrent(context);
      	} else {
				this.drawTail(context, this.drawTailHistoryLength, 3);
      	}
      },

      drawCurrent: function (context, xx, yy, fillstyle) {  
         x = xx || this.x;
         y = yy || this.y;
         // context.fillStyle = this.color;
         context.fillStyle = fillstyle || this.color;
         context.strokeStyle = fillstyle || this.color;
   		context.beginPath();
   		context.arc(x, y, this.radius, 0, 2*Math.PI, true);
   		context.closePath();
   		context.fill();
   	},

   	addCurrentPositionToHistory: function() {
   		this.x_prev_array.unshift(this.x);
   		this.y_prev_array.unshift(this.y);
   	},

   	removeFromHistoryPosition: function(n_history) {
   		for(var i = n_history; i < this.x_prev_array.length; i++){
   			this.x_prev_array.pop();
   			this.y_prev_array.pop();
   		}
   	},

      drawTail: function (context, n_history, every_n) {
			this.addCurrentPositionToHistory();
         for(var i=0; i < this.x_prev_array.length; i = i + every_n ){
         	var gamma;
         	if ( i == 0) { 
         		gamma = 1;
         	} else {
         		gamma = 0.3 * (n_history - i )/n_history;	
         	}
         	var fillStyle = 'rgba(0, 0, 0, ' + gamma + ')';
         	this.drawCurrent(context, this.x_prev_array[i], this.y_prev_array[i], fillStyle);
         }
         this.removeFromHistoryPosition(n_history);
      }
   };

   Universe.Ball = Ball;


})();

