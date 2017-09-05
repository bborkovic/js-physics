﻿var Universe = (function(){   function Universe(){      // this.allObjects = [];      this.balls = [];      this.shapes = [];      this.gravity;      this.canvas;      this.context;      this.width;      this.height;   }   Universe.prototype= {      animate: function( canvas, duration ){         var self = this;         var animDuration = duration || 60; // default is 60         var animTime = 0;         t0 = new Date().getTime();         animFrame();                  function animFrame(){            if(animTime < animDuration) {               animId = requestAnimationFrame(animFrame,canvas);                 onTimer();            } else { stop(); }         }         function onTimer(){            var t1 = new Date().getTime();            var t_diff = t1-t0;            dt = 0.001*(t1-t0); // get seconds             animTime += dt;            t0 = t1;            // if (dt > 0.2) { dt=0; };            move(dt);         }         function move(dt){            moveObjects(dt);            // calcForce();            // updateAccel();            // updateVelo();            // updateMass();            // monitor();         }         function moveObjects(dt){            // context.clearRect(0, 0, width, height);            self.clear();            // move balls            self.balls.map( function(el) { el.move(dt, self.gravity); } );            // check ball/shape collisions            self.shapes.forEach( function(shape){               self.balls.forEach( function(ball){                  shape.checkConstraint(ball);               } );            } );            // self.Collision.resolveCollisions( self.balls, "all", self.shapes);            for (var i = 0; i < self.balls.length; i++) {               var ball1 = self.balls[i];               for (var j = i+1; j < self.balls.length; j++) {                  var ball2 = self.balls[j];                  ball1.checkCollision(ball2);               }            }            // Draw balls and shapes            self.balls.map( function(ball) { ball.draw(self.context); } );            self.shapes.map( function(el) { el.draw(self.context); } );         }      },      setCanvas: function(canvas) {         this.canvas = document.getElementById(canvas);         this.context = this.canvas.getContext('2d');         this.width = this.canvas.width = window.innerWidth;         this.height = this.canvas.height = window.innerHeight;      },      clear: function(){          this.context.fillStyle="gray";         this.context.clearRect(0, 0, this.width, this.height);         // for (var i = 0; i < this.obstacles.length; i++) {         //    this.obstacles[i].draw(this.context, "black", 2);         // }      },      addObject: function( obj, objType ) {         if ( objType == "ball" ) {            this.balls.push( obj );         }         if ( objType == "rect" ) {            this.shapes.push( obj );         }      },      setGravity: function( g ) {         this.gravity = g || ( new Vector(0,1000) );      },   };   Universe.create = function(){      return new Universe();   };   var univ = new Universe();   return univ;})();