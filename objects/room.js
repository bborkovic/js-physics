(function(window,document){

   if ( typeof Universe == 'function') {
      Universe = new Universe();
   }

   function Room(id){
      this.canvas = document.getElementById(id);
      this.context = this.canvas.getContext('2d');
      this.width = this.canvas.width = window.innerWidth;
      this.height = this.canvas.height = window.innerHeight;
      this.obstacles = [];

      this.addObstacle = function(obstacle){
         this.obstacles.push(obstacle);
      };

      this.clear = function(){
         this.context.fillStyle="gray";
         // this.context.fillRect(0, 0, this.width, this.height);
         this.context.clearRect(0, 0, this.width, this.height);
         for (var i = 0; i < this.obstacles.length; i++) {
            this.obstacles[i].draw(this.context, "black", 2);
         }
      };

      this.checkConstraint = function(ball){
         this.checkRoomConstraint(ball);
         for (var i = 0; i < this.obstacles.length; i++) {
            this.obstacles[i].checkConstraint(ball);
         }
      };

      this.checkRoomConstraint = function(ball) {
         var x = ball.x;
         var y = ball.y;
         var vel_x = ball.vx;
         var vel_y = ball.vy;
         var over;
         
         if ( x  > this.width-ball.radius ) {
            over = x - (this.width-ball.radius);
            ball.x = (this.width-ball.radius) - over;
            ball.setvel( new Vector( - vel_x*velK, vel_y*velK2) );
         } 
         if ( x < ball.radius ) {
            over = ball.radius - x;
            ball.x = ball.radius + over;
            ball.setvel( new Vector( - vel_x*velK, vel_y*velK2) );
         }
         if ( y  > this.height-ball.radius ) {
            over = y - (this.height-ball.radius);
            ball.y = (this.height-ball.radius) - over;
            ball.setvel( new Vector( vel_x*velK2, - vel_y*velK) );
         } 
         if ( y < ball.radius ) {
            over = ball.radius - y;
            ball.y = ball.radius + over;
            ball.setvel( new Vector( vel_x*velK2, - vel_y*velK) );
         }
      };
   }

   Universe.Room = Room;

})(window,document);
