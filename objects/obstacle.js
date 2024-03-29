var Obstacle = (function(){

   function Obstacle(middle_x_pos, middle_y_pos, x_width, y_width, velK){
      this.left = middle_x_pos - x_width/2;
      this.right = middle_x_pos + x_width/2;
      this.top = middle_y_pos + y_width/2;
      this.bottom = middle_y_pos - y_width/2;
      this.velK = velK || 1.0;

      this.left_top = new Vector(this.left,this.top);
      this.left_bottom = new Vector(this.left,this.bottom);
      
      this.right_top = new Vector(this.right,this.top);
      this.right_bottom = new Vector(this.right,this.bottom);
      
      this.checkBall = function(ball){};

      this.draw = function(context){
         context.fillStyle="gray";
         context.fillRect(this.left, this.bottom, this.right-this.left, this.top-this.bottom);
      };

      this.clear = function(){
         
         // this.context.fillRect(0, 0, this.width, this.height);
         this.context.clearRect(0, 0, this.width, this.height);
      };

      this.checkConstraint = function(ball) {
         var r = ball.radius;      
         var left = this.left, right = this.right, top = this.top, bottom = this.bottom;
         var x = ball.x, y = ball.y;
         var vel_x = ball.vx, vel_y = ball.vy;
         var over;
         var velK = this.velK;
            
         var left_bottom = new Vector(left-r, bottom-r);
         var left_top = new Vector(left-r, top+r);
         var right_bottom = new Vector(right+r, bottom-r);
         var right_top = new Vector(right+r, top+r);

         if ( x >= left-r && x <= right+r && y >= bottom-r && y <= top+r) {
            // is inside obstacle
            // left side!!
            if( Vector.segment_intersection( ball.getpos(), ball.getprevpos(), left_bottom , left_top)){
               over = x - (left-r);
               ball.setpos( new Vector( (left-r) - over, y) );
               ball.setvel( new Vector( - vel_x*velK, vel_y*velK2) );
               return;
            }
            // right side!!
            if( Vector.segment_intersection( ball.getpos(), ball.getprevpos(), right_bottom , right_top)){
               over = (right+r) - x;
               ball.setpos( new Vector((right+r) + over,y) );
               ball.setvel( new Vector( - vel_x*this.velK, vel_y*velK2) );
               return;
            }
            // bottom side
            if( Vector.segment_intersection( ball.getpos(), ball.getprevpos(), left_bottom , right_bottom)){
               over = y - (bottom-r);
               ball.setpos( new Vector(x, (bottom-r) - over)  );
               ball.setvel( new Vector( vel_x*velK2, - vel_y*velK) );
               return;
            }
            // top_side
            if( Vector.segment_intersection( ball.getpos(), ball.getprevpos(), left_top , right_top)){
               // return Vector.segment_intersection( ball.getpos(), ball.getprevpos(), left_top , right_top);
               over = (top+r) - y;
               ball.setpos( new Vector(x, (top+r) + over) );
               ball.setvel( new Vector( vel_x*velK2, - vel_y*velK) );
               return;
            }
         }
      };
   }

   return Obstacle;

})();

Universe = Universe || {};
Universe.Obstacle = Obstacle;
