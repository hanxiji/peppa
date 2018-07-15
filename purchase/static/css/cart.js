$(document).ready(
    function () {
        $('.add-cart,#addCart,.btn-danger').on('click', function () {
            var parent_li = $(this).parents('li');
            var items = {
                0: {
                    'pid': parent_li.attr('pid'),
                    'ppid': parent_li.attr('ppid'),
                    'type': parent_li.attr('type'),
                    'qty': '1'
                }
            };
            var $ths = $(this);

            Cart.add(items, function (resp) {
                if (resp.code == 200) {
                    $('.shop-cart').find('.row2').html('购物车中共<em>' + resp.data.cartcount + '</em>件商品 | 商品小计<em>￥' + resp.data.cart.total_amount + '</em>');
                } else {
                    //MessageBox.errorFadeout(resp.msg);
                }
            });
        });

        $('.add-gifts').on('click', function () {

            var parent_li = $(this).parents('li');

            var items = {
                0: {
                    'pid': parent_li.attr('pid'),
                    'ppid': parent_li.attr('ppid'),
                    'type': "user_gift",
                    'qty': parent_li.attr('qty'),
                    'pno': parent_li.attr('pno'),
                    'gift_send_id': parent_li.attr('gift_send_id'),
                    'gift_active_type': parent_li.attr('gift_active_type')
                }
            };
            var $ths = $(this);

            Cart.add(items, function (resp) {
                window.location.href = "/user/giftsget";

            });
            return false;
        });

        /*
         * cart btn
         */
        $('.cartspage').delegate('.deC', 'click', function (event) {
            var $num, _val;
            var timeout;
            event.stopPropagation();

            var parent_li = $(this).parents('li');
            $num = $('.list-unstyled').find('.deC').filter(function (i) {
                return $(this).parents('li').attr('ppid') == parent_li.attr('ppid') ? true : false;
            }).prev('input');

            //alert($num.val());
            _val = parseInt($num.val());
            if (_val <= 1) {
                _val = 1;
            }
            _val++;
            $num.val(_val);

            var data = {
                'pid': parent_li.attr('pid'),
                'ppid': parent_li.attr('ppid'),
                'type': parent_li.attr('type'),
                'qty': _val,
                'ik': parent_li.attr('id')
            };

            if (timeout) {
                clearTimeout(timeout);
            }

            timeout = setTimeout(function () {
                Cart.update(data);
            }, 20);

        });

        /*
         * cart-mini  btn
         */
        $('.p-common-minicart').delegate('.deC', 'click', function (event) {
            var $num, _val;
            var timeout;
            event.stopPropagation();

            var parent_li = $(this).parents('li');
            $num = $('.list-unstyled').find('.deC').filter(function (i) {
                return $(this).parents('li').attr('ppid') == parent_li.attr('ppid') ? true : false;
            }).prev('input');

            //alert($num.val());
            _val = parseInt($num.val());
            if (_val <= 1) {
                _val = 1;
            }
            _val++;
            $num.val(_val);

            var data = {
                'pid': parent_li.attr('pid'),
                'ppid': parent_li.attr('ppid'),
                'type': parent_li.attr('type'),
                'qty': _val,
                'ik': parent_li.attr('id')
            };
            Cart.miniupdate(data);
        });

        /*
         * cart  btn
         */
        $('.cartspage').delegate('.inC', 'click', function (event) {
            var $num, _val;
            var timeout;
            event.stopPropagation();

            var parent_li = $(this).parents('li');
            $num = $('.list-unstyled').find('.inC').filter(function (i) {
                return $(this).parents('li').attr('ppid') == parent_li.attr('ppid') ? true : false;
            }).next('input');

            _val = parseInt($num.val());

            if (_val == 1) return;
            _val--;
            if (_val > 1) {
                $num.val(_val);
            } else {
                $num.val(1);
            }

            var data = {
                'pid': parent_li.attr('pid'),
                'ppid': parent_li.attr('ppid'),
                'type': parent_li.attr('type'),
                'qty': $num.val(),
                'ik': parent_li.attr('id')
            };

            if (timeout) {
                clearTimeout(timeout);
            }
            timeout = setTimeout(function () {
                Cart.update(data);
            }, 20);

        });

        /*
         * cart-mini  btn
         */
        $('.p-common-minicart').delegate('.inC', 'click', function (event) {
            var $num, _val;
            var timeout;
            event.stopPropagation();

            var parent_li = $(this).parents('li');
            $num = $('.list-unstyled').find('.inC').filter(function (i) {
                return $(this).parents('li').attr('ppid') == parent_li.attr('ppid') ? true : false;
            }).next('input');

            _val = parseInt($num.val());

            if (_val == 1) return;
            _val--;
            if (_val > 1) {
                $num.val(_val);
            } else {
                $num.val(1);
            }

            var data = {
                'pid': parent_li.attr('pid'),
                'ppid': parent_li.attr('ppid'),
                'type': parent_li.attr('type'),
                'qty': $num.val(),
                'ik': parent_li.attr('id')
            };

            Cart.miniupdate(data);
        });

        $('.cartspage').delegate('.m-cartlist-delete', 'click', function (event) {
            event.stopPropagation();
            var $this = $(this);
            $.ajax({
                type: 'GET',
                url: "/cart/confirm",
                dataType: 'html'
            }).done(function (data) {
                $('#p-dialog').empty().append(data).fadeIn(100).removeClass().addClass('dialog-open');
                $('.dialog-til>span').on('click', diaClose);
                $('.btn-default').on('click', diaClose);
                $('#del-submit').on('click', function () {
                    var parent_li = $this.parents('li');
                    var pdata = {
                        'pid': parent_li.attr('pid'),
                        'ppid': parent_li.attr('ppid'),
                        'type': parent_li.attr('type'),
                        'ik': parent_li.attr('id')
                    };
                    diaClose();
                    Cart.remove(pdata);

                });
            })
        });

        $('.p-common-minicart').delegate('.mini-cartlist-delete', 'click', function (event) {
            event.stopPropagation();
            var parent_li = $(this).parents('li');
            var pdata = {
                'pid': parent_li.attr('pid'),
                'ppid': parent_li.attr('ppid'),
                'type': parent_li.attr('type'),
                'ik': parent_li.attr('id')
            };
            Cart.miniremove(pdata);
        });


        $('.fruit-kinds .good-list ul li .wrap a span').click(
            function () {

                //$('.zhezhao').fadeIn(800);
                //$('.shop-cart').fadeIn(800);
                return false;
            }
        );


        $('.shop-cart .shop-content .choosed ul li .buy .fr-buy').click(
            function () {
                $('.shop-cart').fadeOut(800);
                $('.zhezhao').fadeOut(800);
                $('.fruit-kinds .good-list ul li .s-info .s-che.cur').animate({
                    "background-position-x": "-517px",
                    "background-position-y": "-243px"
                }, 500);
            }
        );
    }
);


var Cart = {
    sessid: '',
    url: 'http://localhost',
    add: function () {
        var items = arguments[0];
        var callback = arguments[1];

        var data = {
            'items': items
        };
        $.ajax('/ajax/cart/add', {
            'type': 'POST',
            'data': data,
            'dataType': 'json',
            'beforeSend': function (XHR) {
            },
            'success': function (resp, textStatus, jqXHR) {
                if (resp.msg == "请先登录") {
                    window.location.href = "/login";
                }

                if (resp.code == 200) {
                    localStorage['cartcount'] = resp.cart_items_count;
                }

                if ($.isFunction(callback)) {
                    callback(resp);
                    return;
                }

                if (resp.code == 200) {
                    // MessageBox.show('恭喜您，商品已成功加入购物车');
                } else {

                    // MessageBox.errorFadeout(resp.msg);
                }
            }
        });
    },
    update: function () {
        var item = arguments[0];

        item.ik = item.ik.substr(2);
        var data = {
            'item': item
        };

        var _this = this;
        $.ajax('/ajax/cart/update#!', {
            'type': 'POST',
            'data': data,
            'dataType': 'json',
            'success': function (resp, textStatus, jqXHR) {
                //MessageBox.unloading();
                if (resp.code == 200) {
                    localStorage['cartcount'] = resp.cart_items_count;

                    //$('.cartspage').load(location.href+'/rescart' + " .cartspage>*");
                    //var url = "http://"+window.location.host;
                    //$('.p-common-minicart').load(url+'/cart/resminicart' + " .p-common-minicart>*", function(){
                    //    $(this).find('.cart-order').css('display','block');
                    //});

                    _this.body(resp.cart);

                } else {
                     //MessageBox.errorFadeout(resp.msg);
                    var parent_li = $('.cartspage').parents('li');
                    var num = $('.list-unstyled').find('.inC').filter(function (i) {
                        return $('.cartspage').parents('li').attr('ppid') == parent_li.attr('ppid') ? true : false;
                    }).next('input');
                    _val = parseInt(num.val());
                    if(_val == 1)
                    {
                        num.val(_val);
                    }
                    else
                    {
                        num.val(_val - 1);
                    }
                    gdialog_info(resp.msg);

                }
            }
        });
    },
    miniupdate: function () {
        var item = arguments[0];

        item.ik = item.ik.substr(2);
        var data = {
            'item': item
        };

        var _this = this;
        $.ajax('/ajax/cart/update#!', {
            'type': 'POST',
            'data': data,
            'dataType': 'json',
            'success': function (resp, textStatus, jqXHR) {
                //MessageBox.unloading();
                if (resp.code == 200) {
                    localStorage['cartcount'] = resp.cart_items_count;

                    //$('.cartspage').load(location.href+'/rescart' + " .cartspage>*");
                    //var url = "http://"+window.location.host;
                    //$('.p-common-minicart').load(url+'/cart/resminicart' + " .p-common-minicart>*", function(){
                    //    $(this).find('.cart-order').css('display','block');
                    //});

                    _this.minibody(resp.cart);

                } else {
                    //MessageBox.errorFadeout(resp.msg);
                }
            }
        });
    },
    remove: function () {
        var item = arguments[0];

        item.ik = item.ik.substr(2);
        var data = {
            'item': item
        };

        var _this = this;
        $.ajax('/ajax/cart/remove#!', {
            'type': 'POST',
            'data': data,
            'dataType': 'json',
            'success': function (resp, textStatus, jqXHR) {
                if (resp.code == 200) {
                    localStorage['cartcount'] = resp.cart_items_count;

                    //$('.cart-body').html(resp.cartbody);
                    //console.log(resp.cart);
                    if (resp.cart.total_amount == 0.00 && resp.cart.goods_cost == 0.00) {
                        $('.cart-order').html('<div class="cart-empty">购物车中还没有商品，<a href="/prolist/index/40" class="VI-color2">继续逛逛</a>吧！</div>');
                        $('.cartfooter').remove();
                        _this.body(resp.cart);
                    }
                    else {
                        _this.body(resp.cart);
                    }

                    //$('.cartspage').load(location.href+'/rescart' + " .cartspage>*");
                    //var url = "http://"+window.location.host;
                    //$('.p-common-minicart').load(url+'/cart/resminicart' + " .p-common-minicart>*", function(){
                    //    $(this).find('.cart-order').css('display','block');
                    //});
                } else {
                    MessageBox.errorFadeout(resp.msg, function () {
                    });
                }
            }
        });

    },
    miniremove: function () {
        var item = arguments[0];

        item.ik = item.ik.substr(2);
        var data = {
            'item': item
        };

        var _this = this;

        $.ajax('/ajax/cart/remove#!', {
            'type': 'POST',
            'data': data,
            'dataType': 'json',
            'success': function (resp, textStatus, jqXHR) {
                if (resp.code == 200) {
                    localStorage['cartcount'] = resp.cart_items_count;

                    //$('.cart-body').html(resp.cartbody);

                    if ($.isEmptyObject(resp.cart)) {
                        //$('.cart-order').html('<div class="cart-empty">购物车中还没有商品，<a href="/prolist/index/40" class="VI-color2">继续逛逛</a>吧！</div>');
                        $('.cartfooter').remove();
                    } else {
                        _this.minibody(resp.cart);
                    }

                    //$('.cartspage').load(location.href+'/rescart' + " .cartspage>*");
                    //var url = "http://"+window.location.host;
                    //$('.p-common-minicart').load(url+'/cart/resminicart' + " .p-common-minicart>*", function(){
                    //    $(this).find('.cart-order').css('display','block');
                    //});
                } else {
                    MessageBox.errorFadeout(resp.msg, function () {
                    });
                }
            }
        });

    },
    empty: function () {
        localStorage.removeItem('cartcount');
    },
    index: function () {
        var cart = localStorage['cartitems'];
        var form = $('<form action="/cart" method="post"><input type="hidden" name="carttmp" value="' + cart + '"></input></form>');
        form.submit();
    },
    body: function (cart) {
        var total_qty = 0;
        this.itemT(cart);
        this.pmtT(cart);
    },
    minibody: function (cart) {
        var total_qty = 0;
        this.miniitemT(cart);
    },
    pmtT: function (cart) {
        /*优惠提醒*/
        if ($('.m-carttips').length > 0) {
            $('.m-carttips').remove();
        }
        if (cart.pmt_alert != null) {
            var tipEl = $('<div class="m-carttips"><ul class="list-unstyled"></ul></div>');
            $.each(cart.pmt_alert, function (i, p) {

                var title = p.solution.title;
                var pt = '<div class="cartbox2 clearfix">';
                pt += '<div class="send-free pull-left">';
                if (p.solution.tag != '') {
                    pt += '<p>' + p.solution.tag + '</p>';
                    pt += '</div>';
                    pt += '<p class="pull-left title">';
                    if (p.solution.type == 'exchange') {
                        if (p.solution.tag == '换') {
                            pt += '<a onclick=\'changePurchase("' + p.solution.pmt_id + '");\' href=\'javascript:void(0);\' >' + title + '</a>';
                        } else {
                            pt += '<a target="_blank" href="/" >' + title + '</a>';
                        }
                    } else {
                        pt += '<a href="/">' + title + '</a>';
                    }
                    pt += ' </p>';
                    pt += '</div>';
                }
                else {
                    pt += '<p>' + '赠品' + '</p>';
                    pt += '</div>';
                    pt += '<p class="pull-left title">';
                    pt += '<a href="/user/giftsget">' + title + '</a>';
                    pt += ' </p>';
                    pt += '</div>';
                }

                tipEl.find('ul').append(pt);
            });
            $('.cart-order').append(tipEl);
        }
    },
    itemT: function (cart) {

        $('.cart-order .list-unstyled li').remove();

        if ($('.cart-order .list-unstyled').length) {
            var cEl = $('.cart-order .list-unstyled');
            var total_qty = 0;
            var cartnum = 0;
            var domidlist = [];

            if (cart.items != null) {
                $.each(cart.items, function (k, i) {
                    var map = {
                        'domid': 'c_' + k,
                        'item_type': i.item_type,
                        'product_id': i.product_id,
                        'sku_id': i.sku_id,
                        'href': (i.item_type == 'normal' || i.item_type == 'exch') ? "/detail/index/" + i.product_id : 'javascript:void(0);',
                        'product_photo': i.photo.thum_promotion ? i.photo.thum_promotion : i.photo.thum,
                        'name': i.name,
                        'spec': i.spec ? i.spec : '',
                        'sale_price': '￥' + i.sale_price,
                        'price': (parseFloat(i.price) > parseFloat(i.sale_price)) ? '<del>￥' + i.price + '</del>' : '',
                        //'endtime':(i.item_type=='user_gift' || i.item_type=='coupon_gift') ? '<span class="pull-right">截至 '+i.endtime+'</span>' :'',
                        'qty': i.qty,
                        'pmt_details': '',
                        'src': i.photo.thum_promotion ? i.photo.thum_promotion : i.photo.thum,
                        'total_amount': i.amount,
                        's_price': '￥' + i.price,
                        'endtime': i.endtime
                    };
                    cartnum++;

                    var li = '<li id=' + map.domid + ' type=' + map.item_type + ' pid=' + map.product_id + ' ppid=' + map.sku_id + '>';

                    li += '<div class="cartbox clearfix"><div class="cartorder-select pull-left clearfix"></div>';
                    li += '<div class="cart-imgs pull-left">';
                    li += '<a href="/prodetail/index/' + map.product_id + '" target="_blank">';
                    li += '<img class="pull-left" src="' + map.product_photo + '" alt="">';
                    li += '</a></div>';
                    li += '<div class="cart-name pull-left">';
                    li += '<p><a href="/prodetail/index/' + map.product_id + '" target="_blank">' + map.name + '</a></p>';
                    if (map.item_type == 'gift' || map.item_type == 'user_gift') {
                        li += '<div class="others">';
                        li += '<p>赠品</p>';
                        if (map.endtime != undefined) {
                            li += '<p class="end-time">截至' + map.endtime + '</p>';
                        }
                        li += '</div>';
                    }
                    if (map.item_type == 'exch') {
                        li += '<div class="others">';
                        li += '<p>换购</p>';
                        if (map.endtime != undefined) {
                            li += '<p class="end-time">截至' + map.endtime + '</p>';
                        }
                        li += '</div>';
                    }
                    li += '</div>';
                    li += '<div class="spec-num pull-left">';
                    li += '<p>' + map.spec + '</p>';
                    li += '</div>';
                    li += '<div class="price-singular pull-left">';
                    li += '<p>' + map.s_price + '</p>';
                    li += '</div>';
                    if (map.item_type == 'gift' || map.item_type == 'user_gift' || map.item_type == 'exch') {
                        li += '<div class="num_sel_lage cart-goods pull-left clearfix free-goods">';
                        li += '<input class="pull-left" type="tel" disabled="" name="qty" autocomplete="on" value="' + map.qty + '">';
                        li += '</div>';
                    }
                    else {
                        li += '<div class="num_sel_lage cart-goods pull-left clearfix">';
                        li += '<span class="inC num pull-left btn-minus">-</span>';
                        li += '<input class="pull-left" type="tel" disabled="" name="qty" autocomplete="on" value="' + map.qty + '">';
                        li += '<span class="deC num pull-left btn-plus">+</span>';
                        li += '</div>';
                    }
                    li += '<div class="sum pull-left">';
                    li += '<p>' + map.s_price + '</p>';
                    li += '</div>';

                    if (map.item_type != 'gift') {
                        li += '<div class="delete pull-left"><p class="m-cartlist-delete deleteCartpro">删除</p></div>';
                        li += '</div>';
                    }

                    li += '<div class="cl"></div>';
                    li += '</li>';

                    $('.cart-order .list-unstyled').append(li);

                    total_qty = parseInt(i.qty) + parseInt(total_qty);
                    domidlist.push(map.domid);

                    var iEl = cEl.find('li#' + map.domid);

                    iEl.find('.sum').html('<p>￥' + map.total_amount + '</p>');
                });
            }

            if (cartnum != 0) {
                $('.cartnum').html(cartnum);
                $('.cart-pay').html('<span>已选择 <em>' + total_qty + '件</em> 商品  |  订单金额</span><span class="all-order">￥' + cart.total_amount + '</span><a id="btngopay" class="go-pay">去结算</a>');

                $('.mcart-pay').html('<div class="pull-left">共<span class="VI-color2"> ' + total_qty + '</span> 件商品</div><div class="pull-right">商品小计 <span class="fs-3 VI-color2">' + cart.total_amount + '</span></div><button id="btncart" type="button" class="btn btn-success btn-lg btn-block">立即结算</button>');

                if ($('#cart_page').val() == '2') {
                    var notli = cEl.find('li').filter(function (i) {
                        return $.inArray($(this).attr('id'), domidlist) == -1 ? true : false;
                    }).remove();

                    if (notli.length) {
                        notli.slideUp(150, function () {
                            $(this).remove();
                        });
                    }
                }
            }

        }
    },
    miniitemT: function (cart) {

        $('.cart-order .list-unstyled li').remove();

        if ($('.cart-order .list-unstyled')) {
            var cEl = $('.cart-order .list-unstyled');
            var total_qty = 0;
            var cartnum = 0;
            var domidlist = [];

            if (cart.items != null) {
                $.each(cart.items, function (k, i) {
                    var map = {
                        'domid': 'c_' + k,
                        'item_type': i.item_type,
                        'product_id': i.product_id,
                        'sku_id': i.sku_id,
                        'href': (i.item_type == 'normal' || i.item_type == 'exch') ? "/detail/index/" + i.product_id : 'javascript:void(0);',
                        'product_photo': i.photo.thum_promotion ? i.photo.thum_promotion : i.photo.thum,
                        'name': i.name,
                        'spec': i.spec ? i.spec : '',
                        'sale_price': '￥' + i.sale_price,
                        'price': (parseFloat(i.price) > parseFloat(i.sale_price)) ? '<del>￥' + i.price + '</del>' : '',
                        'endtime': (i.item_type == 'user_gift' || i.item_type == 'coupon_gift') ? '<span class="pull-right">截至 ' + i.endtime + '</span>' : '',
                        'qty': i.qty,
                        'pmt_details': '',
                        'src': i.photo.thum_promotion ? i.photo.thum_promotion : i.photo.thum,
                        'total_amount': i.amount,
                        's_price': i.price
                    };
                    cartnum++;

                    //console.log(map);
                    var li = '<li id=' + map.domid + ' type=' + map.item_type + ' pid=' + map.product_id + ' ppid=' + map.sku_id + '>';
                    li += '<a href="/prodetail/index/' + map.product_id + '" target="_blank">';
                    li += '<img class="pull-left" src="' + map.product_photo + '" alt="">';
                    li += '<div class="p-minicart-info">';
                    li += '<h5>' + map.name + '</h5>';
                    if (map.s_price > 0) {
                        li += '<h5>' + '￥' + map.s_price + '/' + map.spec + '</h5>';
                    }
                    else {
                        li += '<h5>' + '￥0.00' + '/' + map.spec + '</h5>';
                    }
                    li += '</div></a>';

                    if (map.item_type == 'gift') {
                        li += '<div class="num_sel_lage p-mincart-modify">';
                        li += '<input type="text" class="set-num-in set-num-zping" value="' + map.qty + '" readonly="true">';
                        li += '</div></li>';
                    }
                    else {
                        if (map.item_type == 'user_gift' || map.item_type == 'exch') {
                            li += '<div class="num_sel_lage p-mincart-modify">';
                            li += '<input type="text" class="set-num-in set-num-zping" value="' + map.qty + '" readonly="true">';
                            li += '</div><span class="mini-cartlist-delete p-mincart-delete">删除</span></li>';
                        }
                        else {
                            li += '<div class="num_sel_lage p-mincart-modify">';
                            li += '<span class="inC p-mincart-act btn-minus">-</span>';
                            li += '<input type="text" class="set-num-in" value="' + map.qty + '" readonly="true">';
                            li += '<span class="deC p-mincart-act btn-plus">+</span>';
                            li += '</div><span class="mini-cartlist-delete p-mincart-delete">删除</span></li>';
                        }
                    }

                    $('.cart-order .list-unstyled').append(li);

                    total_qty = parseInt(i.qty) + parseInt(total_qty);
                    domidlist.push(map.domid);

                    var iEl = cEl.find('li#' + map.domid);

                    iEl.find('.sum').html('<p>￥' + map.total_amount + '</p>');
                });
            }

            if (cartnum != 0) {
                $('.cartnum').html(cartnum);
                $('.cart-pay').html('<span>已选择 <em>' + total_qty + '件</em> 商品  |  订单金额</span><span class="all-order">￥' + cart.total_amount + '</span><a id="btngopay" class="go-pay">去结算</a>');

                $('.mcart-pay').html('<div class="pull-left">共<span class="VI-color2"> ' + total_qty + '</span> 件商品</div><div class="pull-right">商品小计 <span class="fs-3 VI-color2">' + cart.total_amount + '</span></div><button id="btncart" type="button" class="btn btn-success btn-lg btn-block">立即结算</button>');

                if ($('#cart_page').val() == '2') {
                    var notli = cEl.find('li').filter(function (i) {
                        return $.inArray($(this).attr('id'), domidlist) == -1 ? true : false;
                    }).remove();

                    if (notli.length) {
                        notli.slideUp(150, function () {
                            $(this).remove();
                        });
                    }
                }
            }
            else {
                $('.cartnum').html(0);
                $('.mcart-pay').html('<h5 class="text-center font-color">购物车中还没有商品，赶紧选购吧！</h5>');
            }
        }
    }
};
function substitute(template, map, transform, thisObject) {
    thisObject = thisObject || $.noop;
    transform = transform || thisObject["transform"] || function (v) {
        return v;
    };

    return template.replace(/\$\{([^\s\:\}]+)(?:\:([^\s\:\}]+))?\}/g, function (match, key, format) {
        var value = map[key] || ("undefined" === typeof map[key] ? match : map[key]);
        format && (value = thisObject[format](value, key));
        return transform(value, key).toString();
    });
}