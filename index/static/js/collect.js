/**
 * ͼ����ҳ
 * @version 2.0 ���߰汾��
 * @author fpf
 * @����gbk
 * ȫ�½ṹ,������ģ������ͬһ���
 */
(function (window, $) {
    /**
     * ʱ���ʽ��
     * @param x Date ʱ��
     * @param y ��ʽ
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
     * ����Ψһid
     */
    var uuid = (function () {
        var random = Math.random().toString().substring(2, 20);
        return date2str(new Date(), "yyyyMMddhhmmssSSS").concat("_").concat(random, "E");
    });

    /**
     * ��ȡcookie
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
        bookhome_guess: "boohome_guess"//ͼ����ҳ
    };
    var perm_id = getCookie("__permanent_id");//�û���ʶ
    var main_pid = 0; //����Ʒid�����ﳵ����ƷΪ0
    // ��������
    var reco_timer = {
        guess_timer: null
    };
    // ��ģ��li��
    var reco_list = {
        guess_list: null
    };
    // ���б��
    var reco_flag = {
        guess_flag: false
    };

    /**
     * ���͵����Ϣ
     * @param strvalue
     */
    function report_click(strvalue) {
        strvalue = config.server + '?' + strvalue + '&type=1&random_id=' + Math.random();
        $(document.body).append("<img style=\"display: none;\" src=\"" + strvalue + "\"/>");
    }

    /**
     * �����ع�����
     * @param li ����
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
                $(li_list[i]).attr("traced", 1); //�ع���
            }
        }
    }


    /**
     * ����Ƿ���������
     * @param page ��ҳ
     * @param clientHeight
     * @param scrollTop
     */
    function trace(li_list, clientHeight, scrollTop) {
        if (li_list != null && li_list.length > 0) {
            for (var i = 0; i < li_list.length; i++) {
                var offsetTop = $(li_list[i]).offset().top;
                var height = $(li_list[i]).height();
                if (offsetTop < scrollTop) {
                    //�Ѿ�����������ȡ�Ϸ�
                    if ((offsetTop + height) > scrollTop && (offsetTop + height) < (clientHeight + scrollTop)) {
                        //¶��β��
                        report(li_list[i]);
                    } else if ((offsetTop + height) < scrollTop) {
                        //�Ϸ����ɼ�λ��
                    }
                } else if (offsetTop < clientHeight + scrollTop) {
                    //���������
                    report(li_list[i]);
                } else {
                    //�ڿ������·�
                }
            }
        }
    }


    /*reco��ҳ�¼�*/
    function reco_trace_page(div_found, page_num, size, all_length) {
        var li_list = get_reco_visible_list(div_found, page_num, size, all_length);
        if (li_list.length > 0) {
            report_list(li_list);
        }
    }


    /*��ȡreco�ɼ�ģ��*/
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
     *recoģ����
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
                //��ȡ���url,���Ի�ȡrecopid
                if (reco_struct.a_class == ""){
                    var url = $(reco_list[reco_struct.list][i]).attr("href");
                }
                else{
                    var url = $(reco_list[reco_struct.list][i]).find(reco_struct.a_class).attr("href");
                    if (url == null) {
                        url = $(reco_list[reco_struct.list][i]).find("a").attr("href");
                    }
                }
                //����Ƿ�Ϊ��
                var img = $(reco_list[reco_struct.list][i]).find(reco_struct.img);//��ƷͼƬ
                if (img.length == 0) {
                    //����û��ͼƬ����Ʒ��ֱ������
                    break;
                }
                //��ȡд��li�ϵ�requestid,����ѡ��requestidΪ��,��λ-1
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
                //����recopid,����
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
                    state: config.state, // ״̬
                    client: "PC"
                };
                var paramsstr = $.param(params);
                $(reco_list[reco_struct.list][i]).attr("position", paramsstr);


                //��ӵ���¼�:0Ϊ����ѡ������
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
                        if ($(this).attr("href") != "javascript:void(0)"){//ȥ����ѡ���
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
                        report_click(position); //���͵������
                    });

                }
            }

            // ����
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

            reco_list[reco_struct.list].splice(i);//�������ݣ����е���Ԫ��
            //��ӷ�ҳ�¼�
            //��ҳ
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
            //�ҷ�ҳ
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
            //Բ����
            if(reco_struct.fanye_id != ""){
                var topage = $(reco_div).find(reco_struct.fanye_id).click(function () {
                    setTimeout(function () {
                        var nowpage = null;
                        reco_trace_page(reco_div, nowpage, reco_struct.pagesize, reco_list[reco_struct.list].length);
                    }, 50);
                });
            }

            //��һҳ�ع�
            var clientHeight = $(window).height();
            var scrollTop = $(document).scrollTop();
            var nowpage = null;
            if (reco_struct.nowpage == true){
                nowpage = 1;
            }
            var first_report_lists = get_reco_visible_list(reco_div, nowpage, reco_struct.pagesize, reco_list[reco_struct.list].length);
            trace(first_report_lists, clientHeight, scrollTop);

            //��ӹ����¼�
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
     * ����ͼ����ҳ
     */
    function bookHome_start() {

        //Ϊ���Ƽ�
        var guess_reco = {
            list: "guess_list", //list����
            reco_div_id: "div.book_reco_area", //div��id
            reco_list_id: "#book_reco ul.list_aa", //liԪ��id
            li_element: "li", //����Ԫ��
            mainid: main_pid,
            request_element_name: "request_id", //requsetidԪ������ֵ
            request_element_id: "#book_reco", //requsetidԪ��id
            a_class: "a.img", //����id
            img: "a.img img", //ͼƬid
            a_depth: 1, //������li���
            right_id: "div.con.book_reco_head a", //�ҷ�ҳid
            left_id: "", //��ҳid
            fanye_id: "", //��ҳ��ťid
            flag: "guess_flag", //���б�־
            pagesize: 0, //�Ƿ�ҳ,����ҳ���С
            nowpage: false //�Ƿ���ҳ���ʶ
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
