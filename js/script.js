/* Author: xonecas

*/

(function (window, undefined) {

   var document = window.document;

   $(window).load(function () {
      $('#fontLoader').remove();

      if (Modernizr.canvas && Modernizr.canvastext) {

         var canvas = document.createElement('canvas'),
            canvasWidth = $(window).width() - 38,
            canvasHeight = $(window).height(),
            startX = Math.ceil(canvasWidth / 2),
            startY = canvasHeight - 20,
            currentX = startX,
            currentY = startY;


         $(canvas).attr({
            'height': canvasHeight,
            'width': canvasWidth
         });

         $('#main').html(canvas);

         var ctx = canvas.getContext('2d');
         ctx.font = '38px oxy';
         ctx.fillStyle = '#444444';

         ctx.fillText('o', startX, startY);

         $(document).keydown(function (ev) {
            switch(ev.which) {
               case 37:
               case 39:
                  var keepMoving = 10;
                  (function animate () {
                     if (currentX <= 38 ||
                        currentX >= (canvasWidth -38))
                     return currentX = (currentX <= 38)? 40: canvasWidth -40;

                     ctx.fillStyle = '#ffffff';
                     ctx.fillRect(38, 38, currentX, currentY);

                     currentX += (ev.which === 37)? -2: 2;

                     ctx.fillStyle = '#444444';
                     ctx.fillText('o', currentX, currentY);
                     if (--keepMoving)
                        setTimeout(animate, 20);
                  })();
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























