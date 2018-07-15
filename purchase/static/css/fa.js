$(function() {
    var params = {};

    //防止缓存
    params.pc = new Date().getTime();

    //Document对象数据
    if(parent.document) {
        var pd = parent.document; //官网通过iframe引入此js文件的，故需要操作父窗口才行
        // params.domain = document.domain || '';
        params.url = pd.URL || '';
        // params.title = document.title || '';
        params.referrer = pd.referrer || '';

        //获取提交订单金额
        if (pd.location.href.indexOf('/order/payDesk/') >= 0) {
            params.om = $('#money', pd).val() || 0;
            params.pt = $('#pay_type', pd).val() || '';
            params.oid = $('#order_id', pd).val() || 0;
        }

        //获取支付订单金额
        if (pd.location.href.indexOf('/order/succ') >= 0) {
            params.pm = $('#utrace_money', pd).val() || 0;
            params.oid = $('#order_id', pd).val() || 0;
        }
    }

    //Window对象数据
    // if(window && window.screen) {
        // params.sh = window.screen.height || 0;
        // params.sw = window.screen.width || 0;
        // params.cd = window.screen.colorDepth || 0;
    // }

    //navigator对象数据
    // if(navigator) {
        // params.lang = navigator.language || '';
    // }

    //解析_maq配置
    if(_maq) {
        for(var i in _maq) {
            switch(_maq[i][0]) {
                case '_setChannel':
                    params.channel = _maq[i][1];
                    break;
                default:
                    break;
            }
        }
    }

    //通过Image对象请求后端脚本
    request_utrace(params);

    //关闭购物车弹框时
    $('.shop-cart .shop-top .cha', window.parent.document).click(function(){
            params.ac = $('.shop-cart .shop-content .row2 .cartcount', window.parent.document).text() || 0;
            request_utrace(params);
        }
    );

    //继续购物
    $('.shop-cart .shop-content .choosed ul li .buy .fr-buy a', window.parent.document).click(function(){
            params.ac = $('.shop-cart .shop-content .row2 .cartcount', window.parent.document).text() || 0;
            request_utrace(params);
        }
    );

    //去结算
    /*
    $('.shop-cart .shop-content .choosed ul li .buy .fr-add a').click(function(){
            params.ac = $('.shop-cart .shop-content .row2 .cartcount').text() || 0;
            request_utrace(params);
        }
    );
    */
});

/**
 * Request backend image
 */
function request_utrace(params) {

    //拼接参数串
    var args = 'sn=575acc9b9106626d95aa59694e2fd1af';
    for(var i in params) {
        if(args != '') {
            args += '&';
        }
        args += i + '=' + encodeURIComponent(params[i]);
    }
    //window.onload = function() { //预加载在window.onload之后触发
        var img = new Image(1, 1);

        /* 防止被浏览器的垃圾回收机制回收img临时变量 */
        var rnd_id = "_img_" + Math.random();
        window[rnd_id] = img; //全局变量引用
        img.onload = img.onerror = function () {
            window[rnd_id] = null; //删除全局变量引用
            img.onload = null;
            img = null;
        }

        img.src = 'https://statistics.fruitday.com/api/track?' + args;
    //};
}