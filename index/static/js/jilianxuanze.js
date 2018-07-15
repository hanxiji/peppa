$(function(){
    var $carta = $('#part_buy_button');
    var $plus = $('#num_add'),
        $reduce = $('#num_del'),
        $all_sum = $('#buy-num');
    var $href = $carta.attr('href');
    $carta.attr('href',$href+'/'+$all_sum.val());
    $plus.click(function () {
        var $inputVal = $(this).prev('input'),
            $count = parseInt($inputVal.val())+1;
        $inputVal.val($count);
        $carta.attr('href',$href+'/'+$all_sum.val());
    });
    $reduce.click(function () {
        var $inputVal = $(this).next('input'),
            $count = parseInt($inputVal.val())-1;
        if($count >0){
            $inputVal.val($count);
            $carta.attr('href',$href+'/'+$all_sum.val());
        }
    });
    $all_sum.keyup(function () {
        var $count = 0;
        if($(this).val()==''){
            $(this).val('1');
        }
        $(this).val($(this).val().replace(/\D|^0/g,''));
        $count = $(this).val();
        $carta.attr('href',$href+'/'+$count);
    })
});