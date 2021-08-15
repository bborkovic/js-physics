(function(){

   var Vector = Universe.Vector;
   var Common = Universe.Common;

   function Spring(k,L) {
      this.k = k;
      this.L = L;

      // auto generated!
      this.id = Common.seqNextValue();
   }

   // PUBLIC METHODS 
   Spring.prototype = {
   };

   // STATIC METHODS
   Spring.create = function(k,L){
      return new Spring(k,L);
   };

   // Attach to Universe
   Universe.Spring = Spring;

})();



