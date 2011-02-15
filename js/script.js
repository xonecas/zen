
/* Author: Sean Caetano Martin
      xonecas 
*/

(function (window, undefined) {

   var document = window.document,
      LEFT = 37, RIGHT = 39, SPACE = 32,
      IMGSIZE = 38, PADSIZE = 20,
      BG = '#444',
      BULL_W = 5, BULL_H = 10, BULL_COLOR = '#FFF';
   
   function get (id) {
      return document.getElementById(id);
   }
   
   // oo approach
   // http://ejohn.org/blog/simple-javascript-inheritance/

   var Shape = Class.extend({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      ctx: undefined,
      fill: undefined,

      // constructor
      init: function (w, h, ctx, fill) {
         this.x = 0;
         this.y = 0;
         this.width = w;
         this.height = h;
         this.ctx = ctx;
         this.fill = fill;
      },

      // draw the shape
      draw: function (x, y) {
         this.x = x;
         this.y = y;
         var c =  this.ctx;
         c.fillStyle = this.fill;
         c.fillRect(x, y, this.width, this.height);
      },

      // erase the shape
      clear: function () {
         var ctx = this.ctx;
         ctx.fillStyle = BG;
         ctx.clearRect(this.x, this.y, this.width, this.height);
      }
   });

   var Image = Shape.extend({
      // call the Shape constructor
      init: function (w, h, ctx, fill) {
         this._super(w, h, ctx, fill);
      },
      
      // override
      // draw the image instead
      draw: function (x, y) {
         this.x = x;
         this.y = y;
         this.ctx.drawImage(this.fill, x, y, this.width, this.height);
      }
   });

   var Bullet = Shape.extend({
      // call up the chain of constructors
      init: function (owner, ctx) {
         this._super(BULL_W, BULL_H, ctx, BULL_COLOR);
         this.owner = owner;
      },

      // trigger method
      fire: function (x, y, targets, limit) {
         // go up or down?
         var direction =  (this.owner instanceof Cannon)? -5: 5,
            that = this;

         (function fly () {

            that.clear();
            that.draw(x, (y += direction));

            if ((!that.isHit(targets) || y <= 0 || y >= limit) &&
               !that.isBlown)
               setTimeout(fly, 50);

         }) ();
            
      },

      // did the bullet hit anything?
      isHit: function (targets) {
         var i = targets.length;

         while (--i > -1) {
            var target = targets[i];
            if (this.y >= target.y && this.y <= (target.y +IMGSIZE)) {
               if (this.x >= target.x && this.x <= (target.x +IMGSIZE)) {
                  if (!target.isDead) {
                     target.isDead = true;
                     target.clear();
                     this.explode();
                     targets.splice(i,1);
                     return true;
                  }
               }
            }
         }
         return false;
      },
   
      // be done with this bullet
      explode: function () {
         this.clear();
         this.isBlown = true;
      }
   });

   var Cannon = Image.extend({
      // use the image constructor
      init: function (size, ctx, src) {
         this._super(size, size, ctx, src);
      },
      
      // fire missile!!!
      shoot: function (targets, limit) {
         if (!this.isDead) {
            var bullet = new Bullet(this, this.ctx);
            bullet.fire(Math.floor((this.x + this.width /2)), this.y, targets, limit);
         }
      },

      // movement controls 
      move: function (ev) {
         if (!this.keepMoving) {

            var that = this;
            this.keepMoving = true;
            this.direction = ev.which;

            (function move () {
               if (that.keepMoving && !that.isDead) {
                  that.clear();
                  that.x += (that.direction === LEFT)? -5: 5;
                  that.draw(that.x, that.y);
                  setTimeout(move, 50);
               }
            }) ();
         }
         else
            this.direction = ev.which;
      },

      stop: function (ev) {
         if (this.keepMoving && this.direction === ev.which)
            this.keepMoving = false;
      }

   });

   var Invader = Image.extend({
      face: '1',
      direction: 1,

      init: function (size, ctx, type) {
         this._super(size, size, ctx, get(type+this.face));
         this.direction = -1;
      },

      // the aliens strike back!
      shoot: function (targets, limit) {

         var bullet = new Bullet(this, this.ctx);
         bullet.fire(Math.floor((this.x + this.width /2)), this.y, targets, limit);

      },

      // give some dancing abilities to the invaders
/*
      live: function (x, y) {
         this.x = x;
         this.y = y;

         var that = this;
         (function dance () {
               
            that.fill = get('skully'+ that.face);
            that.face = (that.face === '1')? '2': '1';            

            if (!that.isDead) {
               if (!that.moving) 
                  that.draw(that.x, that.y);
               setTimeout(dance, 500);
            }
         
         }) ();

      },
*/

      move: function (direction) {
         this.fill = get('skully'+ this.face);
         this.face = (this.face === '1')? '2': '1';            
         this.moving = true;
         this.clear();
         this.x += IMGSIZE * direction;
         if (!this.isDead) 
            this.draw(this.x, this.y);

         this.moving = false;
      }
   });

   SpaceInvaders = Class.extend({
      started: false,
      paused: false,
      lives: 3,
      canvas: {},
      ctx: false,
      invaders: [],
      cannon: {},
      
      // constructor
      init: function (canvas) {

         this.canvas = canvas;
         this.width = canvas.width = $(window).width();
         this.height = canvas.height = $(window).height();
         this.ctx = canvas.getContext('2d');
         this.started = true;
         this.cannon = new Cannon(IMGSIZE, this.ctx, get('cannon'));
         this.cannon.draw(this.width /2, this.height - (IMGSIZE + PADSIZE));

         var rows = 2, cols = 11, index = 0, center = this.width/2,
            x = Math.floor(center - (((IMGSIZE + PADSIZE) * 11) - 20) /2), y = PADSIZE;

         this.formation = {
            width: (IMGSIZE+PADSIZE)*11-20,
            height: (IMGSIZE+PADSIZE)*2-20,
            'x': x, 'y': y,
            direction: 1
         };
         

         while (rows--) {
            while (cols--) {
               index = this.invaders.push(new Invader(IMGSIZE, this.ctx, 'skully')) -1;
               var invader = this.invaders[index];
               invader.draw(x, y);
               x += IMGSIZE + PADSIZE;
            }
            y += IMGSIZE + PADSIZE;
            x = Math.floor(center - (((IMGSIZE + PADSIZE) * 11) - 20) /2);
            cols = 11;
         }

      },

      // Death to HUMANS!
      invade: function () {
         var that = this;

         // open fire!
         (function attack () {
            if (that.invaders.length > 0) {
            var random = Math.floor(Math.random() * that.invaders.length);

            that.invaders[random].shoot([ that.cannon ], that.height);

            if (that.started && !that.paused)
               setTimeout(attack, 3000);
            }
         }) ();
      },

      moveFormation: function () {
         var invaders = this.invaders,
            formation = this.formation,
            block = PADSIZE+IMGSIZE,
            that = this;

         (function attackangle () {
            var x_max = formation.x + formation.width;
            if (x_max >= that.width - block || formation.x <= PADSIZE )
               formation.direction = (formation.direction === -1)? 1: -1;

            for (var z=0; z < invaders.length; z++) {

               var invader = invaders[z];
               invader.move(formation.direction);
            }
            formation.x += (block*formation.direction);

                        
            setTimeout(attackangle, 1000);
         }) ();
      },

      keydown: function (ev) {
         switch(ev.which) {
            case LEFT:
            case RIGHT:
               ev.preventDefault();
               this.cannon.move(ev);
            break;
            
            case SPACE:
               ev.preventDefault();
               this.cannon.shoot(this.invaders, 0);
            break;
         }
      },
      keyup: function (ev) {
         switch(ev.which) {
            case LEFT:
            case RIGHT:
               ev.preventDefault();
               this.cannon.stop(ev);
            break;
         }
      }
      

   });

   window.onload = function () {

      var canvas = document.createElement('canvas');
      $('#fontLoader').remove();
      $('body').append(canvas);
      var game = new SpaceInvaders(canvas);

      document.onkeydown = function (ev) {
         game.keydown.call(game, ev);
      }
      document.onkeyup = function (ev) {
         game.keyup.call(game, ev);
      }

      game.moveFormation();
      game.invade();
   }

}) (window);

