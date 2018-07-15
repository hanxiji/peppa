/**
 * 图书首页
 * @version 2.0 上线版本号
 * @author fpf
 * @编码gbk
 * 全新结构,将所有模块整理到同一入口
 */
(function (window, $) {
    /**
     * 时间格式化
     * @param x Date 时间
     * @param y 样式
     * @returns {XML|string|void}
     */
    function date2str(x, y) {
        var z = {
            y: x.getFullYear(),
            M: x.getMonth() + 1,
            d: x.getDate(),
            h: x.getHours(),
            m: x.getMinutes(),
            s: x.getSeconds(),
            S: x.getTime()
        };
        return y.replace(/(y+|M+|d+|h+|m+|s+|S+)/g, function (v) {
            return ((v.length > 1 ? "0" : "") + eval('z.' + v.slice(-1))).slice(-(v.length > 2 ? v.length : 2))
        });
    }

    /**
     * 生产唯一id
     */
    var uuid = (function () {
        var random = Math.random().toString().substring(2, 20);
        return date2str(new Date(), "yyyyMMddhhmmssSSS").concat("_").concat(random, "E");
    });

    /**
     * 获取cookie
     **/
    function getCookie(name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg))
            return unescape(arr[2]);
        else
            return null;
    }

    var config = {server: "http://recosys.dangdang.com/realdata/collect.jpg", intervalTime: 400, state: 'dev'};
    var MODULE = {
        bookhome_guess: "boohome_guess"//图书首页
    };
    var perm_id = getCookie("__permanent_id");//用户标识
    var main_pid = 0; //主商品id，购物车主商品为0
    // 运行周期
    var reco_timer = {
        guess_timer: null
    };
    // 各模块li表
    var reco_list = {
        guess_list: null
    };
    // 运行标记
    var reco_flag = {
        guess_flag: false
    };

    /**
     * 发送点击信息
     * @param strvalue
     */
    function report_click(strvalue) {
        strvalue = config.server + '?' + strvalue + '&type=1&random_id=' + Math.random();
        $(document.body).append("<img style=\"display: none;\" src=\"" + strvalue + "\"/>");
    }

    /**
     * 发送曝光数据
     * @param li 数据
     */
    function report(li) {
        var position = $(li).attr("position");
        var traced = $(li).attr("traced");
        if (position != null && traced != 1) {
            var src = config.server + "?" + position + "&type=0&random_id=" + Math.random();
            $(document.body).append("<img style=\"display: none;\" src=\"" + src + "\"/>");
            $(li).attr("traced", 1)
        }
    }

    function report_list(li_list) {
        for (var i = 0; i < li_list.length; i++) {
            var position = $(li_list[i]).attr("position");
            var traced = $(li_list[i]).attr("traced");
            if (position != null && traced != 1) {
                var src = config.server + "?" + position + "&type=0&random_id=" + Math.random();
                $(document.body).append("<img style=\"display: none;\" src=\"" + src + "\"/>");
                $(li_list[i]).attr("traced", 1); //曝光标记
            }
        }
    }


    /**
     * 监测是否进入可视区
     * @param page 翻页
     * @param clientHeight
     * @param scrollTop
     */
    function trace(li_list, clientHeight, scrollTop) {
        if (li_list != null && li_list.length > 0) {
            for (var i = 0; i < li_list.length; i++) {
                var offsetTop = $(li_list[i]).offset().top;
                var height = $(li_list[i]).height();
                if (offsetTop < scrollTop) {
                    //已经滚动到可视取上方
                    if ((offsetTop + height) > scrollTop && (offsetTop + height) < (clientHeight + scrollTop)) {
                        //露出尾部
                        report(li_list[i]);
                    } else if ((offsetTop + height) < scrollTop) {
                        //上方不可见位置
                    }
                } else if (offsetTop < clientHeight + scrollTop) {
                    //进入可视区
                    report(li_list[i]);
                } else {
                    //在可视区下方
                }
            }
        }
    }


    /*reco分页事件*/
    function reco_trace_page(div_found, page_num, size, all_length) {
        var li_list = get_reco_visible_list(div_found, page_num, size, all_length);
        if (li_list.length > 0) {
            report_list(li_list);
        }
    }


    /*获取reco可见模块*/
    function get_reco_visible_list(div_found, page_num, size, all_length) {
        var ul_list = $(div_found).find("ul.list_aa");
        for (var i = 0; i < ul_list.length; i++) {
            var display = $(ul_list[i]).css('display');
            if (display != 'none') {
                visible_list =  $(ul_list[i]).find("li:visible");
                if (visible_list.length == all_length) {
                    return visible_list.slice(0, 10);
                }
                return visible_list;
            }
        }
    }


    /*
     *reco模块监控
     */
    function test_recoData(timer, reco_struct, moudle_name) {
        var reco_div = $(reco_struct.reco_div_id);
        reco_list[reco_struct.list] = $(reco_div).find(reco_struct.reco_list_id).find(reco_struct.li_element);

        if (reco_list[reco_struct.list].length > 0) {
            var prelist = null;
            var lastlist = null;
            if (reco_struct.pagesize != 0){
                if (reco_list[reco_struct.list].length > reco_struct.pagesize) {
                    prelist = reco_list[reco_struct.list].slice(0, reco_struct.pagesize);
                    lastlist = reco_list[reco_struct.list].slice(reco_list[reco_struct.list].length - reco_struct.pagesize);
                    reco_list[reco_struct.list] = reco_list[reco_struct.list].slice(reco_struct.pagesize, reco_list[reco_struct.list].length - reco_struct.pagesize);
                }
            }
            clearInterval(timer);
            if (reco_flag[reco_struct.flag] == true){
                return;
            }
            reco_flag[reco_struct.flag] = true;
            var i = 0;
            for (i = 0; i < reco_list[reco_struct.list].length; i++) {
                //获取点击url,用以获取recopid
                if (reco_struct.a_class == ""){
                    var url = $(reco_list[reco_struct.list][i]).attr("href");
                }
                else{
                    var url = $(reco_list[reco_struct.list][i]).find(reco_struct.a_class).attr("href");
                    if (url == null) {
                        url = $(reco_list[reco_struct.list][i]).find("a").attr("href");
                    }
                }
                //检测是否为空
                var img = $(reco_list[reco_struct.list][i]).find(reco_struct.img);//产品图片
                if (img.length == 0) {
                    //遇到没有图片的商品就直接跳过
                    break;
                }
                //获取写在li上的requestid,关联选购requestid为空,定位-1
                var request_id;
                if(reco_struct.request_element_name == ""){
                    request_id = "-1";
                }
                else{
                    request_id = $(reco_list[reco_struct.list][i]).attr(reco_struct.request_element_name);
                }
                if (request_id == null){
                    request_id = $($(reco_div).find(reco_struct.request_element_id)).attr(reco_struct.request_element_name);
                    if (request_id == null){
                        request_id = "-1";
                    }
                }
                //解析recopid,定义
                var reco_pid = /\d+/.exec(url)[0];
                if (url == 'javascript:void(0);' && reco_struct.flag == "relate_flag") {
                    reco_pid = main_pid;
                }
                var position = i + 1;
                var params = {
                    request_id: request_id,
                    perm_id: perm_id,
                    module: moudle_name,
                    main_pid: reco_struct.mainid,
                    reco_pid: reco_pid,
                    position: position,
                    state: config.state, // 状态
                    client: "PC"
                };
                var paramsstr = $.param(params);
                $(reco_list[reco_struct.list][i]).attr("position", paramsstr);


                //添加点击事件:0为关联选购条件
                if (reco_struct.a_depth == 1){
                    $(reco_list[reco_struct.list][i]).find("a").click(function () {
                        var position = $(this).parent().attr("position");
                        if (position == null) {
                            position = $($(this).parent()).parent().attr("position");
                        }
                        report_click(position);
                    });
                }
                else if(reco_struct.a_depth == 2){
                    $(reco_list[reco_struct.list][i]).find("a").click(function () {
                        if ($(this).attr("href") != "javascript:void(0)"){//去除勾选点击
                            var position = $($(this).parent()).parent().attr("position");
                            if (position == null) {
                                position = $(this).parent().attr("position");
                            }
                            report_click(position);
                        }
                    });
                }
                else if(reco_struct.a_depth == 0){
                    $(reco_list[reco_struct.list][i]).click(function () {
                        var position = $(this).attr("position");
                        report_click(position); //发送点击数据
                    });

                }
            }

            // 边沿
            if (reco_struct.pagesize != 0){
                if (prelist != null && lastlist != null && reco_list[reco_struct.list].length >= reco_struct.pagesize) {
                    for (var j = 0; j < prelist.length; j++) {
                        var index = reco_list[reco_struct.list].length - reco_struct.pagesize + j;
                        var p = $(reco_list[reco_struct.list][index]).attr("position");
                        $(prelist[j]).attr("position", p);
                        $(prelist[j]).find("a").click(function () {
                            var position = $($(this).parent()).parent().attr("position");
                            report_click(position);
                        })
                    }
                    for (var k = 0; k < lastlist.length; k++) {
                        var index = k;
                        var p = $(reco_list[reco_struct.list][index]).attr("position");
                        $(lastlist[k]).attr("position", p);
                        $(lastlist[k]).find("a").click(function () {
                            var position = $($(this).parent()).parent().attr("position");
                            report_click(position);
                        })
                    }
                }
            }

            reco_list[reco_struct.list].splice(i);//剪切数据，剪切掉空元素
            //添加分页事件
            //左翻页
            if(reco_struct.left_id != ""){
                var prev = $(reco_div).find(reco_struct.left_id).click(function () {
                    setTimeout(function () {
                        var nowpage = null;
                        if (reco_struct.nowpage == true){
                            nowpage = parseInt($(reco_div).find("#now_page").html());
                        }
                        reco_trace_page(reco_div, nowpage, reco_struct.pagesize, reco_list[reco_struct.list].length);
                    }, 50);
                });
            }
            //右翻页
            if(reco_struct.right_id != ""){
                var next = $(reco_div).find(reco_struct.right_id).click(function () {
                    setTimeout(function () {
                        var nowpage = null;
                        if (reco_struct.nowpage == true){
                            nowpage = parseInt($(reco_div).find("#now_page").html());
                        }
                        reco_trace_page(reco_div, nowpage, reco_struct.pagesize, reco_list[reco_struct.list].length);
                    }, 50);
                });
            }
            //圆点点击
            if(reco_struct.fanye_id != ""){
                var topage = $(reco_div).find(reco_struct.fanye_id).click(function () {
                    setTimeout(function () {
                        var nowpage = null;
                        reco_trace_page(reco_div, nowpage, reco_struct.pagesize, reco_list[reco_struct.list].length);
                    }, 50);
                });
            }

            //第一页曝光
            var clientHeight = $(window).height();
            var scrollTop = $(document).scrollTop();
            var nowpage = null;
            if (reco_struct.nowpage == true){
                nowpage = 1;
            }
            var first_report_lists = get_reco_visible_list(reco_div, nowpage, reco_struct.pagesize, reco_list[reco_struct.list].length);
            trace(first_report_lists, clientHeight, scrollTop);

            //添加滚动事件
            $(window).scroll(function () {
                var clientHeight = $(window).height();
                var scrollTop = $(document).scrollTop();
                var nowpage = null;
                if (reco_struct.nowpage == true){
                    nowpage = parseInt($(reco_div).find("#now_page").html());
                }
                var report_lists = get_reco_visible_list(reco_div, nowpage, reco_struct.pagesize, reco_list[reco_struct.list].length);
                trace(report_lists, clientHeight, scrollTop);
            });
        }

    }


    /**
     * 当当图书首页
     */
    function bookHome_start() {

        //为你推荐
        var guess_reco = {
            list: "guess_list", //list名称
            reco_div_id: "div.book_reco_area", //div层id
            reco_list_id: "#book_reco ul.list_aa", //li元素id
            li_element: "li", //查找元素
            mainid: main_pid,
            request_element_name: "request_id", //requsetid元素属性值
            request_element_id: "#book_reco", //requsetid元素id
            a_class: "a.img", //链接id
            img: "a.img img", //图片id
            a_depth: 1, //链接离li深度
            right_id: "div.con.book_reco_head a", //右翻页id
            left_id: "", //左翻页id
            fanye_id: "", //翻页按钮id
            flag: "guess_flag", //运行标志
            pagesize: 0, //是否翻页,剪切页面大小
            nowpage: false //是否有页码标识
        };
        reco_timer.guess_timer = setInterval(function () {
            test_recoData(reco_timer.guess_timer, guess_reco, MODULE.bookhome_guess);
        }, config.intervalTime);


    }

    window.CC = {
        bookHome: function () {
            bookHome_start();
        }
    }
})(window, jQuery);
