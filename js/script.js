/* Author: xonecas

   this file needs to be cleaned up and organized

*/

(function (window, undefined) {

   var document = window.document;

   $(window).load(function () {
      $('#fontLoader').remove();

      if (Modernizr.canvas) {

         var canvas = document.createElement('canvas'),
            canvasWidth = $(window).width() - 38,
            canvasHeight = $(window).height(),
            center = Math.ceil(canvasWidth / 2),
            currentX = center + 10,
            currentY = canvasHeight - 58,
            aliens = [];


         $(canvas).attr({
            'height': canvasHeight,
            'width': canvasWidth
         });

         $('#main').html(canvas);

         var ctx = canvas.getContext('2d');
         var alien = $("#alien").get(0),
            laser = $('#laser').get(0);

         ctx.fillStyle = '#fff';

         ctx.drawImage(laser, currentX, currentY, 38, 38);

         var x = 5, z = 11, startx = center - 279, starty = 20;
         while (x--) {
            while (z--) {
               ctx.drawImage(alien, startx, starty, 38, 38);
               aliens.push({ x: startx, y: starty });
               startx += 58;
            }
            z = 11;
            startx = center -279;
            starty += 58;
         }

         function isHit (aliens, missile) {
            var hit = false,
               i = aliens.length;

            while (!hit && --i > -1) {
               var alien = aliens[i];
               if (missile.y >= alien.y && missile.y <= (alien.y +38)) {
                  if (missile.x >= alien.x && missile.x <= (alien.x +38)) {
                     if (!alien.isDead) {
                        hit = { x: alien.x, y: alien.y };
                        alien.isDead = true;
                     }
                  }
               }
            }

            if (hit) return hit;
         }

         $(document).keydown(function (ev) {
            switch(ev.which) {
               case 37: // left arrow
               case 39: // right arrow
                  var keepMoving = 10;
                  (function animate () {
                     if (currentX <= 38 ||
                        currentX >= (canvasWidth -38))
                        return currentX = (currentX <= 38)? 40: canvasWidth -40;

                     ctx.fillStyle = '#444';
                     ctx.fillRect(currentX -2, currentY , 42, 38);

                     currentX += (ev.which === 37)? -2: 2;

                     ctx.fillStyle = '#ffffff';
                     ctx.drawImage(laser, currentX, currentY, 38, 38);
                     if (--keepMoving)
                        setTimeout(animate, 20);
                  }) ();
               break;
               
               case 32: // space bar
                  var originX = currentX +18,
                     originY = currentY;

                  (function fly () {
                     ctx.fillStyle = '#444';
                     ctx.fillRect(originX, originY, 2, 10);

                     originY -= 22;
                     ctx.fillStyle = '#fff';
                     ctx.fillRect(originX, originY, 2, 10);
                    
                     var hit = isHit(aliens, { x: originX, y: originY });
                     if (originY >= -10 && !hit)
                        setTimeout(fly, 30);
                     else if (hit) {
                        ctx.fillStyle = '#444';
                        ctx.fillRect(hit.x, hit.y, 38, 38);
                        ctx.fillRect(originX, originY, 2, 10);
                     }
                  }) ();
               break;
            }

            //log(ev.which);
         });
      }

      else { // IE or old browser
         var canvas_ = $('#main'),
            testString = 'TEST: Hello world!',
            fillText = document.createElement('div');

         $(fillText).html(testString).css({
            'top': '20px',
            'left': '50px'
         });

         canvas_.html(fillText);
      }
   });


}) (window);























