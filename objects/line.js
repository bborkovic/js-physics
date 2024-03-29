var Line = (function(){

   function Line(p1, p2) {
      this.p1 = p1;
      this.p2 = p2;
      this.vector;
      this.direction;
      this.normal;
   }

   // PUBLIC METHODS 
   Line.prototype = {

      getOffsetLine: function( off ){
         var p11 = this.p1.addScaled(this.normal, off);
         var p22 = this.p2.addScaled(this.normal, off);
         return Line.create(p11,p22);
      },

      getExtendedLine: function( extend ){
         return Line.create( this.p1.subtract( this.direction.multiply(extend)) , this.p2.add( this.direction.multiply(extend)) );
      },

      draw: function(context, color, lineWidth) {
         if( color ) { context.strokeStyle = color; }
         if( lineWidth ) { context.lineWidth = lineWidth; }
         context.beginPath();
         context.moveTo( this.p1.x, this.p1.y );
         context.lineTo( this.p2.x, this.p2.y );
         context.stroke();
      },

      getIntersect: function( other_line ){
         var x1 = this.p1.x;
         var x2 = this.p2.x;
         var x3 = other_line.p1.x;
         var x4 = other_line.p2.x;

         var y1 = this.p1.y;
         var y2 = this.p2.y;
         var y3 = other_line.p1.y;
         var y4 = other_line.p2.y;

          var x=((x1*y2-y1*x2)*(x3-x4)-(x1-x2)*(x3*y4-y3*x4)) / ((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4));
          var y=((x1*y2-y1*x2)*(y3-y4)-(y1-y2)*(x3*y4-y3*x4)) / ((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4));
          if (isNaN(x)||isNaN(y)) {
              return false;
          } else {
              if (x1>=x2) {
                  if (!Vector.between(x2, x, x1)) {return false;}
              } else {
                  if (!Vector.between(x1, x, x2)) {return false;}
              }
              if (y1>=y2) {
                  if (!Vector.between(y2, y, y1)) {return false;}
              } else {
                  if (!Vector.between(y1, y, y2)) {return false;}
              }
              if (x3>=x4) {
                  if (!Vector.between(x4, x, x3)) {return false;}
              } else {
                  if (!Vector.between(x3, x, x4)) {return false;}
              }
              if (y3>=y4) {
                  if (!Vector.between(y4, y, y3)) {return false;}
              } else {
                  if (!Vector.between(y3, y, y4)) {return false;}
              }
          }
          return new Vector(x,y);
         },

   };    

   // STATIC METHODS
   Line.create =  function(p1, p2){
      var line = new Line(p1, p2);
      var normal;
      line.vector = p2.subtract(p1);
      line.direction = line.vector.clone();
      line.direction.normalize();
      normal = line.vector.clone();
      normal.rotate(Math.PI/2);
      normal.normalize();
      line.normal = normal;
      return line;
   };

   return Line;
})();

Universe = Universe || {};
Universe.Line = Line;