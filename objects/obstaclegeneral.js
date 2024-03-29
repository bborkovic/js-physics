(function(){
   
   function ObstacleGeneral(){
      this.lines = [];
      this.transparent = false;
   }
   ObstacleGeneral.prototype = {
      addLine: function(line) {
         this.lines.push(line);
      },
      draw: function(context, color, lineWidth){
      	color = color || "black";
         for (var i=0; i < this.lines.length; i++) {
            this.lines[i].draw(context, color, lineWidth);
         }
      },
      checkConstraint: function(ball) {

         if( this.transparent) {
            return;
         }

         var line_ball = Line.create( ball.getpos(), ball.getprevpos() );
         for (var i=0; i < this.lines.length; i++) {
            var line = this.lines[i];
            line = line.getOffsetLine(ball.radius);
            var line_obs = line.getExtendedLine(ball.radius);
              
            // find intersect if there is?
            var intersect = line_obs.getIntersect(line_ball);

            if( intersect ) {
               if( ball.getvel().dotProduct( line_obs.normal ) > 0 ){
                  // no collision when come from other side!!! ( let the ball out)
                  return;
               }
               var over = line_ball.p2.subtract(intersect);
               var dot_normal = over.dotProduct(line_obs.normal);
               var dot_direction = over.dotProduct(line_obs.direction);

               var over_after_bounce_n = line_obs.normal.multiply(dot_normal);
               var over_after_bounce_d = line_obs.direction.multiply(dot_direction);

               // var over_after_bounce = over_after_bounce_d.add(over_after_bounce_n.negate());
               var over_after_bounce = over_after_bounce_n.add(over_after_bounce_d.negate());
               var over_after_bounce_norm = over_after_bounce.clone();
               over_after_bounce_norm.normalize();
               // ball.setpos( intersect.add(over_after_bounce) );
               ball.setpos( intersect.add(over_after_bounce) );
               ball.setvel( over_after_bounce_norm.multiply(ball.getvel().length()*velK));
               // this.draw(room.context, "black", 3);
               return true;
            }
         }
         return false;
      }
   };
   Universe = Universe || {};
   Universe.ObstacleGeneral = ObstacleGeneral;
})();

