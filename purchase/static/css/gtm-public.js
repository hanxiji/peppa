$(function(){
    //首页/分类列表页，加入购物车按钮事件
    $('.fruit-kinds .good-list ul li .s-info .s-che,.f-list .leftpart .p-operate .s-che').click(
        function(){
            var pid = $(this).data('pid');
            var price = parseFloat($(this).data('price'));
            dataLayer.push({
              'money': price,
              'items': [{'id':pid, 'count':1, 'price':price}]
            });
        }
    );
    
    //商品详情页，立即购买/加入购物车按钮事件
    $('.price-info .buy .fr-buy,.price-info .buy .fr-add,.anniu').click(
        function(){
            var pid = $("div.zhuang > span[class*=current]").data('pid');
            var count = parseInt($("#add").val());
            var price = parseFloat($("div.zhuang > span[class*=current]").data('price'));
            dataLayer.push({
              'money': price * count,
              'items': [{'id':pid, 'count':count, 'price':price}]
            });
        }
    );
    
    //商品详情页传值
    if (window.location.href.indexOf('/prodetail/index/') >= 0) {
        var product_id = $("div.zhuang > span[class*=current]").data('pid');
        var product_name = $('.huise').text();
        var category = $('span.lvse a:first').text();
        var price = parseFloat($("div.zhuang > span[class*=current]").data('price'));
        var product_photo = $('#MyFocus ul.tuul li:first a img').attr('src');
        var outofstock = $("div.zhuang > span[class*=current]").data('outofstock');
        var sold_out = 0;
        if (outofstock) {
            sold_out = 1;
        }
        dataLayer.push({
          'product_id': product_id,
          'product_name': product_name,
          'category': category,
          'price': price,
          'product_url': window.location.protocol + '//' + window.location.host + '/prodetail/index/' + product_id,
          'product_photo': product_photo,
          'sold_out': sold_out
        });
    }
    
    //提交订单，传值
    if (window.location.href.indexOf('/order/payDesk/') >= 0) {
        var orderNo = $('#order_name').val();
        var money = $('#money').val();
        var items = [];
        if (orderNo) {
            $.get("http://www.fruitday.com/user/viewOrder/" + orderNo, function(result){
                $(result).find('tr.shop-list').each(function(){
                    var pid_href = $(this).find('.shop-img a').attr('href');
                    var pid = pid_href.substr(pid_href.lastIndexOf('/') + 1);
                    var qty = parseInt($(this).find('td:eq(2) p').text());
                    var price = parseFloat($(this).find('td:eq(1) p.logoColor').text());
                    items.push({'id':pid,'count':qty,'price':price});
                });
            });
        }
        dataLayer.push({
          'orderNo': orderNo,
          'money': parseFloat(money),
          'items': items
        });
    }
    
    //查看购物车，传值
    if ((window.location.href.indexOf('/cart') >= 0) && ($('.cart-empty').length == 0)) {
        var money = $('.all-order').html().replace('￥', '');
        var items = [];
        $('.cartmain .cart-order ul.list-unstyled li').each(function(){
            var pid = $(this).attr('pid');
            var qty = $(this).find("input[name='qty']").val();
            var price = parseFloat($(this).find('div.price-singular p').text().replace('￥', ''));
            items.push({'id':pid,'count':qty,'price':price});
        });
        dataLayer.push({
          'money': parseFloat(money),
          'items': items
        });
    }
    
    //支付完成订单，传值
    if ((window.location.href.indexOf('/order/succ') >= 0) || (window.location.href.indexOf('/order/pay/') >= 0)) {
        var orderNo = $('#order_name').val();
        var money = $('#pay_money').val();
        var items = [];
        if (orderNo) {
            $.get("http://www.fruitday.com/user/viewOrder/" + orderNo, function(result){
                $(result).find('tr.shop-list').each(function(){
                    var pid_href = $(this).find('.shop-img a').attr('href');
                    var pid = pid_href.substr(pid_href.lastIndexOf('/') + 1);
                    var qty = parseInt($(this).find('td:eq(2) p').text());
                    var price = parseFloat($(this).find('td:eq(1) p.logoColor').text());
                    items.push({'id':pid,'count':qty,'price':price});
                });
            });
        }
        dataLayer.push({
          'orderNo': orderNo,
          'money': parseFloat(money),
          'items': items
        });
    }
    
    //分类列表或搜索结果列表传值
    if ((window.location.href.indexOf('/prolist/search/') >= 0) || (window.location.href.indexOf('/prolist/index/') >= 0)) {
        var items = [];
        $('div.f-list div.leftpart ul li').each(function(){
            var pid = $(this).find('div.s-che').data('pid');
            var price = $(this).find('div.s-che').data('price');
            items.push({'id':pid,'count':1,'price':price});
        });
        if (items.length > 0) {
            dataLayer.push({'items': items});
        }
    }
});