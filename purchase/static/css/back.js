(function($) {
     $.fx.step["backgroundPosition"] = function(fx) {
         if (typeof fx.end == 'string') {
             fx.start = getBgPos(fx.elem);
             //fx.end原本是一个string，这里将它转换成数组，就不会再进入这个if，也方便我们下面的计算
             //例 "0px -21px"
             fx.end = [parseFloat(fx.end.split(" ")[0]), parseFloat(fx.end.split(" ")[1])];
         }
         //这里fx.pos是根据传入的时间参数，从0到1变化的浮点数
         var nowPosX = ((fx.end[0] - fx.start[0]) * fx.pos) + fx.start[0] + fx.unit;
         var nowPosY = ((fx.end[1] - fx.start[1]) * fx.pos) + fx.start[1] + fx.unit;
         fx.elem.style.backgroundPosition = nowPosX + ' ' + nowPosY;
         
         /**
          * 获取backgroundPosition数组[top, left]，没有单位
          */
         function getBgPos(elem) {
             var top  = 0.0;
             var left = 0.0;
             if ($(elem).css("backgroundPosition")) {
                 //例 "0px -21px"
                 top  = parseFloat($(elem).css("backgroundPosition").split(" ")[0]);
                 left = parseFloat($(elem).css("backgroundPosition").split(" ")[1]);
             }else{
                 top  = parseFloat($(elem).css("backgroundPositionX"));
                 left = parseFloat($(elem).css("backgroundPositionY"));
             }
             return [top, left];
         }
     }
 })(jQuery);