/* Author: xonecas

*/

(function (window, undefined) {

   var document = window.document;

   $(window).load(function () {
      $('#fontLoader').remove();

      if (Modernizr.canvas && Modernizr.canvastext) {

         var canvas = document.createElement('canvas');
         $(canvas).attr({
            'height': $(window).height(),
            'width': $(window).width()
         });

         $('#main').html(canvas);

         var ctx = canvas.getContext('2d');
         ctx.font = '38px oxy';
         ctx.fillStyle = '#444444';
         ctx.fillText('TEST: hello world', 50, 58);
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























