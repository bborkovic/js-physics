(function(){

   var Vector = Universe.Vector;

   function Boundary(where, limit, velK){
      this.where = where;
      this.limit = limit;
      this.velK = velK;
   }

   Boundary.prototype= {
      checkConstraint: function(ball){
         if( this.where == "bottom") {
            if( ball.y + ball.radius >= this.limit ) {
               // console.log( "Bouncing from " + this.where);
               var over = ball.y + ball.radius - this.limit;
               ball.setpos( new Vector( ball.x , ball.y - 2*over ) );
               ball.setvel( new Vector( this.velK * ball.getvel().x, -1 * this.velK * ball.getvel().y ) );
            }
         }
         if( this.where == "right") {
            if( ball.x + ball.radius >= this.limit ) {
               // console.log( "Bouncing from " + this.where);
               var over = ball.x + ball.radius - this.limit;
               ball.setpos( new Vector( ball.x - 2*over , ball.y ) );
               ball.setvel( new Vector( -1 * this.velK * ball.getvel().x, this.velK * ball.getvel().y ) );
            }
         }
         if( this.where == "left") {
            if( ball.x <= this.limit + ball.radius) {
               // console.log( "Bouncing from " + this.where);
               var over = this.limit + ball.radius - ball.x;
               ball.setpos( new Vector( ball.x + 2*over , ball.y ) );
               ball.setvel( new Vector( -1 * this.velK * ball.getvel().x, this.velK * ball.getvel().y ) );
            }
         }
         if( this.where == "top") {
            if( ball.y <= this.limit + ball.radius) {
               // console.log( "Bouncing from " + this.where);
               var over = this.limit + ball.radius - ball.y;
               ball.setpos( new Vector( ball.x , ball.y + 2*over ) );
               ball.setvel( new Vector( this.velK * ball.getvel().x, -1 * this.velK * ball.getvel().y ) );
            }
         }
      }
   };

   Boundary.createRect = function( where_to, limit, velK ){
      // where_to = top, bottom, left, right
      var b = new Boundary(where_to, limit, velK);
      return b;
   };

   Universe.Boundary = Boundary;
})();
