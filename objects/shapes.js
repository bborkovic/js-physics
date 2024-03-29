(function(){

   // Shapes is generator class

   if ( typeof Universe == 'function') {
      Universe = new Universe();
   }
   var Line = Universe.Line;
   var ObstacleGeneral = Universe.ObstacleGeneral;

   function Shapes() {
   }

   // PUBLIC METHODS 
   Shapes.prototype = {
   };

   // STATIC METHODS

   Shapes.createRectangle = function(center, width, height, angle) {
      if( !angle ) { angle = 0; }
      var p1 = new Vector( center.x + width/2 , center.y - height/2);
      var p2 = new Vector( center.x - width/2 , center.y - height/2);
      var p3 = new Vector( center.x - width/2 , center.y + height/2);
      var p4 = new Vector( center.x + width/2 , center.y + height/2);

      p1 = center.add( p1.subtract(center).rotate(angle) );
      p2 = center.add( p2.subtract(center).rotate(angle) );
      p3 = center.add( p3.subtract(center).rotate(angle) );
      p4 = center.add( p4.subtract(center).rotate(angle) );

      var obstacle = new ObstacleGeneral();
      obstacle.addLine( Line.create( p1,p2 ));
      obstacle.addLine( Line.create( p2,p3 ));
      obstacle.addLine( Line.create( p3,p4 ));
      obstacle.addLine( Line.create( p4,p1 ));
      return obstacle;
   },

   Shapes.createSquare =  function(center, size, angle){
      if( !angle ) { angle = 0; }
      // center is vector
      var p1 = new Vector( center.x + size/2 , center.y - size/2);
      var p2 = new Vector( center.x - size/2 , center.y - size/2);
      var p3 = new Vector( center.x - size/2 , center.y + size/2);
      var p4 = new Vector( center.x + size/2 , center.y + size/2);

      p1 = center.add( p1.subtract(center).rotate(angle) );
      p2 = center.add( p2.subtract(center).rotate(angle) );
      p3 = center.add( p3.subtract(center).rotate(angle) );
      p4 = center.add( p4.subtract(center).rotate(angle) );

      
      var obstacle = new ObstacleGeneral();
      obstacle.addLine( Line.create( p1,p2 ));
      obstacle.addLine( Line.create( p2,p3 ));
      obstacle.addLine( Line.create( p3,p4 ));
      obstacle.addLine( Line.create( p4,p1 ));

      return obstacle;
   };

   Shapes.createCircle =  function(center, radius, approx ){
      approx = approx || 16;
      var obstacle = new ObstacleGeneral();
      var p1 = center.add( Vector.createPolar(0, radius) );
      for (var i = approx-1; i >= 0; i--) {
         var p2 = center.add( Vector.createPolar( i * 2*Math.PI/approx, radius) );
         obstacle.addLine( Line.create(p1,p2) );
         p1 = p2;
      }
      return obstacle;
   };

   Universe.Shapes = Shapes;

})();



