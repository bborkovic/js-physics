var Universe = (function(){

   function Universe(){
      // this.allObjects = [];
      this.balls = [];
      this.shapes = [];
      this.boundaries = [];
      this.springs = [];
      this.gravity = 0;
      this.canvas = null;
      this.context = null;
      this.width = 0;
      this.height= 0;
      this.toCheckCollisions = true;
   }

   Universe.prototype= {
      animate: function( canvas, duration ){
         var self = this;
         var animDuration = duration || 60; // default is 60
         var animTime = 0;
         t0 = new Date().getTime();
         animFrame();
         
         function animFrame(){
            if(animTime < animDuration) {
               animId = requestAnimationFrame(animFrame,canvas);
               onTimer();
            } else { stop(); }
         }

         function onTimer(){
            var t1 = new Date().getTime();
            var t_diff = t1-t0;
            dt = 0.001*(t1-t0); // get seconds 
            animTime += dt;
            t0 = t1;
            // if (dt > 0.2) { dt=0; };
            if ( dt > 0.01 ) {
               animateOneStep(dt);
            }
         }

         function animateOneStep(dt){
            calcForce();
            if ( self.toCheckCollisions ) {
            	checkCollisions();
            }
            updateVelocity(dt);
            moveObjects(dt);
            drawObjects();
            draw();
         }

         function drawObjects() {
            // Draw balls and shapes
            self.balls.map( function(ball) { ball.draw(self.context); } );
            self.shapes.map( function(el) { el.draw(self.context); } );
         }

         function checkCollisions(){

            self.boundaries.forEach( function(boundary){
               self.balls.forEach( function(ball){
                  boundary.checkConstraint(ball);
               } );
            } );
            
            self.shapes.forEach( function(shape){
               self.balls.forEach( function(ball){
                  shape.checkConstraint(ball);
               } );
            } );

            for (var i = 0; i < self.balls.length; i++) {
               var ball1 = self.balls[i];
               for (var j = i+1; j < self.balls.length; j++) {
                  var ball2 = self.balls[j];
                  ball1.checkCollision(ball2);
               }
            }
         }

         function moveObjects(dt){
            // context.clearRect(0, 0, width, height);
            self.clear();
            // move balls
            self.balls.map( function(el) { el.move(dt); } );
            // check ball/shape collisions
         }

         function calcForce() {
         	for(var i = 0; i < self.balls.length; i++){
         		var ballA = self.balls[i];
         		var totalForce = Vector.create(0,0);

         		// force from pulling Springs
         		var forceFromOtherBalls = ballA.getSpringPullback();

         		// force from other charges
         		var forceFromCharges = Vector.create(0,0);
         		for(var j = 0; j < self.balls.length; j++){
         			ballB = self.balls[j];
        				forceFromCharges.incrementBy( ballA.getForceFromOtherBall(ballB) );
         		}

         		totalForce.incrementBy(forceFromCharges);
         		totalForce.incrementBy(forceFromOtherBalls);

         		var accel = totalForce.multiply( 1/ballA.mass ).add( self.gravity );
         		ballA.setaccel( accel );
         	}
            // self.balls.forEach( function(ball){
            //    var forceFromOtherBalls = ball.getSpringPullback();
            //    var accel = forceFromOtherBalls.multiply( 1/ball.mass ).add( self.gravity );
            //    ball.setaccel( accel );
            // } );
         }

         function updateVelocity(dt){
            self.balls.forEach( function(ball){
               if( ! ball.fixed ) {
                  var accel = ball.getaccel();
                  var vel = ball.getvel();
                  accel = accel.subtract( vel.multiply(airDrag/ball.mass) );
                  vel = ball.getvel().addScaled(accel,dt);
                  ball.setvel(vel);
               }
            } );
         }
      },

      setCanvas: function(canvas) {
         this.canvas = document.getElementById(canvas);
         this.context = this.canvas.getContext('2d');
         this.width = this.canvas.width = window.innerWidth;
         this.height = this.canvas.height = window.innerHeight;
      },

      clear: function(){
         this.context.fillStyle="gray";
         this.context.clearRect(0, 0, this.width, this.height);
         // for (var i = 0; i < this.obstacles.length; i++) {
         //    this.obstacles[i].draw(this.context, "black", 2);
         // }
      },

      addObject: function( obj, objType ) {

         if ( objType == "ball" ) {
            this.balls.push( obj );
         }

         if ( objType == "rect" ) {
            this.shapes.push( obj );
         }

         if ( objType == "spring" ) {
            this.springs.push( obj );
         }
      },

      setGravity: function( g ) {
         this.gravity = g || ( new Vector(0,1000) );
      },

      addBoundary: function(boundary) {
         this.boundaries.push(boundary);
      }

   };

   Universe.create = function(){
      return new Universe();
   };

   var univ = new Universe();
   return univ;

})();
