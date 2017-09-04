(function() {
   
   function Common(){
      this.seqCurrValue = 0;
   }

   Common.prototype = {
      seqNextValue: function(){
         this.seqCurrValue++;
         return( this.seqCurrValue );
      }
   };

   var common = new Common();
   Universe.Common = common;

})();