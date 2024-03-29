(function(){

   function Vector(x,y) {
      this.x = x;
      this.y = y;
   }

   // PUBLIC METHODS 
   Vector.prototype = {
      lengthSquared: function(){
         return this.x*this.x + this.y*this.y;
      },
      length: function(){
         return Math.sqrt(this.lengthSquared());
      }, 
      clone: function() {
         return new Vector(this.x,this.y);
      },
      negate: function() {
         this.x = -1 * this.x;
         this.y = -1 * this.y;
         return new Vector(this.x, this.y);
      },

      rotate: function(angle) {
         // modify actual vector
         var x = this.x * Math.cos(angle) - this.y * Math.sin(angle);
         var y = this.x * Math.sin(angle) + this.y * Math.cos(angle);
         this.x = x;
         this.y = y;
         return new Vector(this.x,this.y);
      },

      normalize: function() {
         var length = this.length();
         if (length > 0) {
            this.x /= length;
            this.y /= length;
         }
      },
      unit: function() {
         var length = this.length();
         if (length > 0) {
            var x = this.x/length;
            var y = this.y/length;
            return new Vector(x,y);
         } else {
            return new Vector(0,0);
         }
      },

      add: function(vec) {
         return new Vector(this.x + vec.x,this.y + vec.y);
      },
      incrementBy: function(vec) {
         this.x += vec.x;
         this.y += vec.y;
      },    
      subtract: function(vec) {
         return new Vector(this.x - vec.x,this.y - vec.y);
      },
      decrementBy: function(vec) {
         this.x -= vec.x;
         this.y -= vec.y;
      },    
      multiply: function(k) {
         return new Vector(k*this.x,k*this.y);
      },    
      addScaled: function(vec,k) {
         return new Vector(this.x + k*vec.x, this.y + k*vec.y);
      }, 
      scaleBy: function(k) {
         this.x *= k;
         this.y *= k;
         return this;
      },
      dotProduct: function(vec) {
         return this.x*vec.x + this.y*vec.y;
      },
      projection: function(vec) {
         var length = this.length();
         var lengthVec = vec.length();
         var proj;
         if( (length == 0) || ( lengthVec == 0) ){
            proj = 0;
         }else {
            proj = (this.x*vec.x + this.y*vec.y)/lengthVec;
         }
         return proj;
      },
      project: function(vec) {
         return vec.para(this.projection(vec));
      }, 
      para: function(u,positive){
         if (typeof(positive)==='undefined') positive = true;
         var length = this.length();
         var vec = new Vector(this.x, this.y);
         if (positive){
            vec.scaleBy(u/length);
         }else{
            vec.scaleBy(-u/length);
         }
         return vec;
      },
      perp: function(u,anticlockwise){
         if (typeof(anticlockwise)==='undefined') anticlockwise = true;
         var length = this.length();
         var vec = new Vector2D(this.y, -this.x);
         if (length > 0) {
            if (anticlockwise){ // anticlockwise with respect to canvas coordinate system
               vec.scaleBy(u/length);
            }else{
               vec.scaleBy(-u/length);          
            }
         }else{
            vec = new Vector2D(0,0);
         }  
         return vec;
      }

      // project: function(vec) {
      //    return vec.para(this.projection(vec));
      // }, 
   };    

   // STATIC METHODS
   Vector.distance =  function(vec1,vec2){
      return (vec1.subtract(vec2)).length(); 
   };
   Vector.angleBetween = function(vec1,vec2){
      return Math.acos(vec1.dotProduct(vec2)/(vec1.length()*vec2.length()));
   };
   Vector.between = function(a, b, c) {
      var eps = 0.0000001;
      return a-eps <= b && b <= c+eps;
   };
   Vector.createPolar = function(angle,length){
      return new Vector( Math.cos(angle) * length ,Math.sin(angle) * length);
   };
   Vector.create = function(x, y){
      return new Vector( x, y);
   };

   // Vector.segment_intersection = function(x1,y1,x2,y2, x3,y3,x4,y4) {
   Vector.segment_intersection = function(p1,p2, q1,q2) {
      var x1 = p1.x;
      var x2 = p2.x;
      var x3 = q1.x;
      var x4 = q2.x;

      var y1 = p1.y;
      var y2 = p2.y;
      var y3 = q1.y;
      var y4 = q2.y;

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
       return {x: x, y: y};
   };

   if ( typeof Universe == 'function') {
      Universe = new Universe();
   }
   Universe.Vector = Vector;

})();

