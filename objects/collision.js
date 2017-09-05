(function() {
   
   function Collision(){
      this.recursions = 0;
   }

   Collision.prototype = {
      resolveCollisions: function(balls, which_balls, shapes) {
         var moved_balls = [];
         var balls_to_check = [];
         if ( which_balls == "all" ) {
            for( var i = 0; i < balls.length; i++){ balls_to_check[i] = i; }
         } else {
            balls_to_check = which_balls;
         }

         while( true ) {
            moved_balls = [];

            // Check ball to shape collision
            shapes.forEach( function(shape){
               for( var i = 0; i < balls_to_check.length; i++) {
                  if ( !balls_to_check[i] ) { continue; }
                  var ball_position = balls_to_check[i];
                  var ball = balls[ball_position];
                  var moved = shape.checkConstraint( ball );
                  if(moved) {
                     moved_balls.push(ball_position);
                     balls_to_check[i] = undefined; // move from current loop
                  }
               }
            } );

            // Check ball to ball collision
            for( var i = 0; i < balls_to_check.length; i++ ){
               if ( !balls_to_check[i] ) { continue; }
               var ball_position = balls_to_check[i];
               var ball1 = balls[ball_position];
               for ( var j = 0; j < balls.length; j++ ) {
                  if ( !balls_to_check[j] ) { continue; }
                  if ( ball_position != j ) {
                     var ball2 = balls[j];
                     ball1.checkCollision(ball2);
                     moved_balls.push(ball_position);
                     moved_balls.push(j);
                     balls_to_check[ball_position] = undefined; // move from current loop
                     balls_to_check[j] = undefined; // move from current loop
                  }
               }
            }

         }
      }, // end of resolveCollisions
   };




   var collision = new Collision();
   Universe.Collision = collision;

})();