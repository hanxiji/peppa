/**
 * 
 */

$(function () {
    //全局的checkbox选中和未选中的样式
    var $allCheckbox = $('input[type="checkbox"]'),     //全局的全部checkbox
        $wholeChexbox = $('.whole_check'),
        $cartBox = $('.cartBox'),                       //每个商铺盒子
        $shopCheckbox = $('.shopChoice'),               //每个商铺的checkbox
        $sonCheckBox = $('.son_check');                 //每个商铺下的商品的checkbox
    $allCheckbox.click(function () {
        if ($(this).is(':checked')) {
            $(this).next('label').addClass('mark');
        } else {
            $(this).next('label').removeClass('mark')
        }
    });

    //===============================================全局全选与单个商品的关系================================
    $wholeChexbox.click(function () {
        var $checkboxs = $cartBox.find('input[type="checkbox"]');
        if ($(this).is(':checked')) {
            $checkboxs.prop("checked", true);
            $checkboxs.next('label').addClass('mark');
        } else {
            $checkboxs.prop("checked", false);
            $checkboxs.next('label').removeClass('mark');
        }
        totalMoney();
    });


    $sonCheckBox.each(function () {
        $(this).click(function () {
            if ($(this).is(':checked')) {
                //判断：所有单个商品是否勾选
                var len = $sonCheckBox.length;
                var num = 0;
                $sonCheckBox.each(function () {
                    if ($(this).is(':checked')) {
                        num++;
                    }
                });
                if (num == len) {
                    $wholeChexbox.prop("checked", true);
                    $wholeChexbox.next('label').addClass('mark');
                }
            } else {
                //单个商品取消勾选，全局全选取消勾选
                $wholeChexbox.prop("checked", false);
                $wholeChexbox.next('label').removeClass('mark');
            }
        })
    })

    //=======================================每个店铺checkbox与全选checkbox的关系/每个店铺与其下商品样式的变化===================================================

    //店铺有一个未选中，全局全选按钮取消对勾，若店铺全选中，则全局全选按钮打对勾。
    $shopCheckbox.each(function () {
        $(this).click(function () {
            if ($(this).is(':checked')) {
                //判断：店铺全选中，则全局全选按钮打对勾。
                var len = $shopCheckbox.length;
                var num = 0;
                $shopCheckbox.each(function () {
                    if ($(this).is(':checked')) {
                        num++;
                    }
                });
                if (num == len) {
                    $wholeChexbox.prop("checked", true);
                    $wholeChexbox.next('label').addClass('mark');
                }

                //店铺下的checkbox选中状态
                $(this).parents('.cartBox').find('.son_check').prop("checked", true);
                $(this).parents('.cartBox').find('.son_check').next('label').addClass('mark');
            } else {
                //否则，全局全选按钮取消对勾
                $wholeChexbox.prop("checked", false);
                $wholeChexbox.next('label').removeClass('mark');

                //店铺下的checkbox选中状态
                $(this).parents('.cartBox').find('.son_check').prop("checked", false);
                $(this).parents('.cartBox').find('.son_check').next('label').removeClass('mark');
            }
            totalMoney();
        });
    });


    //========================================每个店铺checkbox与其下商品的checkbox的关系======================================================

    //店铺$sonChecks有一个未选中，店铺全选按钮取消选中，若全都选中，则全选打对勾
    $cartBox.each(function () {
        var $this = $(this);
        var $sonChecks = $this.find('.son_check');
        $sonChecks.each(function () {
            $(this).click(function () {
                if ($(this).is(':checked')) {
                    //判断：如果所有的$sonChecks都选中则店铺全选打对勾！
                    var len = $sonChecks.length;
                    var num = 0;
                    $sonChecks.each(function () {
                        if ($(this).is(':checked')) {
                            num++;
                        }
                    });
                    if (num == len) {
                        $(this).parents('.cartBox').find('.shopChoice').prop("checked", true);
                        $(this).parents('.cartBox').find('.shopChoice').next('label').addClass('mark');
                    }

                } else {
                    //否则，店铺全选取消
                    $(this).parents('.cartBox').find('.shopChoice').prop("checked", false);
                    $(this).parents('.cartBox').find('.shopChoice').next('label').removeClass('mark');
                }
                totalMoney();
            });
        });
    });


    //=================================================商品数量==============================================
    //增加购买书籍数量
    var $plus = $('.plus'),
        $reduce = $('.reduce'),
        $all_sum = $('.sum');
    $plus.click(function () {
        var $inputVal = $(this).prev('input'),
            $count = parseInt($inputVal.val())+1,
            $obj = $(this).parents('.amount_box').find('.reduce'),
            $priceTotalObj = $(this).parents('.order_lists').find('.sum_price'),
            $price = $(this).parents('.order_lists').find('.price').html();  //单价
            //$priceTotal = $count*parseInt($price.substring(1));
        var $bookid = $inputVal.attr('id');
        var params={"bookid":$bookid,"bookcount":$count};
        $.post("./update/", params,function(data){
            //console.log(data);
            if(data.notexist==true){
                alert("所选的书籍不存在！");
                window.location.reload();
            }
            else{
                $inputVal.val(data.bookcount);
                $priceTotalObj.html('￥'+data.price);
            }
            //totalMoney();
        },"json");
        // $.getJSON("./update/", function(json){
        //     alert("JSON Data: " + json.price);
        // });
        //$inputVal.val($count);
        //$priceTotalObj.html('￥'+$priceTotal);
        if($inputVal.val()>1 && $obj.hasClass('reSty')){
            $obj.removeClass('reSty');
        }
        totalMoney();
    });

    //减少购买的书籍数量。
    $reduce.click(function () {
        var $inputVal = $(this).next('input'),
            $count = parseInt($inputVal.val())-1,
            $priceTotalObj = $(this).parents('.order_lists').find('.sum_price'),
            $price = $(this).parents('.order_lists').find('.price').html();  //单价
            //$priceTotal = $count*parseInt($price.substring(1));
        if($inputVal.val()>1){
            var $bookid = $inputVal.attr('id');
            var params={"bookid":$bookid,"bookcount":$count};
            $.post("./update/", params,function(data){
                //console.log(data);
                if(data.notexist==true){
                    alert("所选的书籍不存在！");
                    window.location.reload();
                }
                else{
                    $inputVal.val(data.bookcount);
                    $priceTotalObj.html('￥'+data.price);
                }
                //totalMoney();
            },"json");
        }
        if($inputVal.val()==1 && !$(this).hasClass('reSty')){
            $(this).addClass('reSty');
        }
        totalMoney();
    });

    //在输入框手动输入购买的书籍数量。
    $all_sum.keyup(function () {
        var $count = 0,
            $priceTotalObj = $(this).parents('.order_lists').find('.sum_price'),
            $price = $(this).parents('.order_lists').find('.price').html(),  //单价
            $priceTotal = 0;
        if($(this).val()==''){
            $(this).val('1');
        }
        $(this).val($(this).val().replace(/\D|^0/g,''));
        $count = $(this).val();
        // $priceTotal = $count*parseInt($price.substring(1));
        // $(this).attr('value',$count);
        // $priceTotalObj.html('￥'+$priceTotal);
        var $bookid = $(this).attr('id');
        var params={"bookid":$bookid,"bookcount":$count};
        $.post("./update/", params,function(data){
            //console.log(data);
            //$inputVal.val(data.bookcount);
            if(data.notexist==true){
                alert("所选的书籍不存在！");
                window.location.reload();
            }
            else{
                $(this).attr('value',data.bookcount);
                $priceTotalObj.html('￥'+data.price);
            }
            //totalMoney();
        },"json");
        totalMoney();
    })

    //==========================================结算======================================
    $('.calBtn').click(function(){
        var total_money = 0;
        var total_count = 0;
        var bookidList = [];
        //遍历选中的CheckBox讲选中的书籍ID发送给后端处理代码。
        $sonCheckBox.each(function () {
            if ($(this).is(':checked')) {
                // var goods = parseFloat($(this).parents('.order_lists').find('.sum_price').html().substring(1));
                // var num =  parseFloat($(this).parents('.order_lists').find('.sum').val());
                // total_money += goods;
                // total_count += num;
                bookidList.push($(this).parents('.order_lists').attr('id'));
            }
        });
        var book = {'bookid':bookidList};
        $.post("/cart/settlement/", book,function(data){
            console.log(data);
            if(data.status==true){
                if(data.stock==false){
                    alert("库存不足");
                    window.location.href = "/cart/";  
                }
                else{
                    window.location.href = "/pay/"+data.purchase_id;
                }
            }
        },"json");
    })
    //======================================移除商品========================================

    var $order_lists = null;
    var $order_content = '';
    $('.delBtn').click(function () {
        $order_lists = $(this).parents('.order_lists');
        $order_content = $order_lists.parents('.order_content');
        $('.model_bg').fadeIn(300);
        $('.my_model').fadeIn(300);
    });

    //关闭模态框
    $('.closeModel').click(function () {
        closeM();
    });
    $('.dialog-close').click(function () {
        closeM();
    });
    function closeM() {
        $('.model_bg').fadeOut(300);
        $('.my_model').fadeOut(300);
    }
    //确定按钮，移除商品
    $('.dialog-sure').click(function () {
        //$order_lists.remove();
        //var $bookid = $inputVal.attr('id');
        var $bookid = $order_lists.attr('id');
        var params={"bookid":$bookid};
        $.post("/cart/delete/", params,function(data){
                //console.log(data);
                if(data.remove==true)
                {
                    $order_lists.remove();
                    window.location.reload();
                    //totalMoney();
                }
                else
                {
                    window.location.reload();
                }
                if($order_content.html().trim() == null || $order_content.html().trim().length == 0){
                    $order_content.parents('.cartBox').remove();
                }
            },"json");
        if($order_content.html().trim() == null || $order_content.html().trim().length == 0){
            $order_content.parents('.cartBox').remove();
        }
        closeM();
        $sonCheckBox = $('.son_check');
        totalMoney();
    })

    //======================================总计==========================================

    function totalMoney() {
        var total_money = 0;
        var total_count = 0;
        var calBtn = $('.calBtn a');
        var bookidList = [];
        var book = {};
        $sonCheckBox.each(function () {
            if ($(this).is(':checked')) {
                bookidList.push($(this).parents('.order_lists').attr('id'));
                book = {'bookid':bookidList}
                // var goods = parseFloat($(this).parents('.order_lists').find('.sum_price').html().substring(1));
                // var num =  parseFloat($(this).parents('.order_lists').find('.sum').val());
                // total_money += goods;
                // total_count += num;
            }
        });
        if(bookidList==null){
            return;
        }
        $.post("/cart/totalmoney/",book,function(data){
            if(data.total.notexist==true)
            {
                alert("书籍不存在");
                window.location.reload();
            }
            else
            {
                // for (var i = data.length - 1; i >= 0; i--) {
                // total_money += data[i].total;
                // total_count += data[i].bookamount;
                // };  
                total_money = data.totalmoney;
                total_count = data.totalamount;
            }
            $('.total_text').html('￥'+total_money.toFixed(2));
            $('.piece_num').html(total_count);
            if(total_money!=0 && total_count!=0){
                if(!calBtn.hasClass('btn_sty')){
                    calBtn.addClass('btn_sty');
                }
            }else{
                if(calBtn.hasClass('btn_sty')){
                    calBtn.removeClass('btn_sty');
                }
            }
        },"json")

        // console.log(total_money,total_count);

    }


});