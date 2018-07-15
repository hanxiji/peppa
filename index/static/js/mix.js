$(function(){

    if(jQuery.browser.version<7) {
        document.execCommand("BackgroundImageCache",false,true);
    }

    $("img[data-original]").lazyload();
    var pageObj=$("#bd").length>0?$("#bd"):$("#bd_auto");
    callAjax(pageObj);//js�¼���
    
   
    $('div[type=defaultajax]').each(function(e){//ҳ��ֱ�Ӽ���ajaxЧ��
        $(this).removeAttr('type');
        var page_id = $(this).attr('page_id');
        var component_map_id  = $(this).attr('component_map_id');
        var domain = $(this).attr('domain');
        var path_name  = $(this).attr('path_name');
        var areaid  = $(this).attr('areaid');
        var page_type  = $(this).attr('page_type');
        var areatype  = $(this).attr('areatype');
        var static_type  = $(this).attr('static_type');
        var obj = $(this);
        $(this).html("<div style='text-align:center;width:100%;'><img src='http://static.dangdang.com/_upload_/benzhiqiang/20100624_151644_57.gif' /></div>");
        var url=mix_ajax_api;
        var postdata={
            isajax:1,
            page_id:page_id,
            component_map_id:component_map_id,
            domain:domain,
            path_name:path_name,
            areaid:areaid,
            page_type:page_type,
            areatype:areatype,
            static_type:static_type,
            mix:1,
            domain_flag:1
        };
        $.get(url,postdata,function(data){
            if(data!=''){
                obj.html(data);
                callAjax(obj,0);
            }
        });        
    });
});
$(window).scroll(function(){
    $('div[type=ajax]').each(function(e){
        var np = $(this).offset().top;
        if(np<=($(window).scrollTop()+$(window).height())){
            $(this).removeAttr('type');
            var page_id = $(this).attr('page_id');
            var component_map_id  = $(this).attr('component_map_id');
            var domain = $(this).attr('domain');
            var path_name  = $(this).attr('path_name');
            var areaid  = $(this).attr('areaid');
            var page_type  = $(this).attr('page_type');
            var areatype  = $(this).attr('areatype');
            var static_type  = $(this).attr('static_type');
            var obj = $(this);
            $(this).html("<div style='text-align:center;width:100%;'><img src='http://static.dangdang.com/_upload_/benzhiqiang/20100624_151644_57.gif' /></div>");
            var url=mix_ajax_api;
            var postdata={
                isajax:1,
                page_id:page_id,
                component_map_id:component_map_id,
                domain:domain,
                path_name:path_name,
                areaid:areaid,
                page_type:page_type,
                areatype:areatype,
                static_type:static_type,
                mix:1,
                domain_flag:1
            };
            $.get(url,postdata,function(data){
                if(data!=''){
                    obj.html(data);
                    callAjax(obj,0);
                }
            });
        }
    });
});
function doclick(bar,ite,barclass){
    bar.each(function(e){
        $(bar.get(e)).bind('click',function(){
            bar.not($(bar.get(e)).addClass(barclass)).removeClass(barclass);
            ite.not($(ite.get(e)).show()).hide();
        });
    });
}
//��ʾtextarea����
function showarea(obj){
    var area = obj.find('textarea');
    if(area!= undefined){
        var str = area.text();
        if(str!=''){
            obj.html('');
            obj.append(str);
            callAjax(obj);
        }
    }
}

//ͳһ��ת ���·��ת����·��
function dd_goto(linkUrl,ref_str){
    var domain_url = String(document.location); 
    var localFlag = domain_url.indexOf("?");
    var refFlag = domain_url.indexOf("ref=");

    //��url�а���ref�����
    if(refFlag>0){
        var refs = domain_url.split('ref=');
        if(localFlag>0){
            if(domain_url.indexOf("&")>0){
                domain_url = domain_url.replace("&ref="+refs[1], '');
            }else{
                domain_url = domain_url.replace("?ref="+refs[1], '');
            }
        }
    }

    //��ȡ��url����#ʱ,��url�а���#�����
    if(domain_url.indexOf("#")>0){
        var anchors = domain_url.split("#");
        domain_url = domain_url.replace("#"+anchors[1], '');
    }

    //ƴ��url��ַ
    if(ref_str){
        if(domain_url.indexOf("?")>0){
            domain_url = domain_url + "&ref="+ref_str;
        }else{
            domain_url = domain_url + "?ref="+ref_str;
        } 
    }
    linkUrl = domain_url + "#" +linkUrl;
    window.location.href = linkUrl;
}

/*
 * @action  ���Ի���װ�б�ҳ������������ͳһ����
 * @param   url php�������url·�����Ѿ���������ɸѡ������
 */
function category_goto(catetory_id,url){
    var domain_url = String("http://"+location.hostname+url); 
    var linkUrl ="";
    //category_id��url���Ѵ��ڣ��滻  
    var reg =  /(category_id=)(\w+)/;
    linkUrl =  domain_url.replace(reg,'$1'+catetory_id);
    window.location.href = linkUrl;
}


$(function(){
    //����ͼƬǽ
    $("div[is_mask=1]").imgMask();
});

(function($){
    $.fn.hoverDelay = function(options){
        var defaults = {
            hoverDuring: 200,
            outDuring: 200,
            hoverEvent: function(){
                $.noop();
            },
            outEvent: function(){
                $.noop();
            }
        };
        var sets = $.extend(defaults,options || {});
        var hoverTimer, outTimer;
        return $(this).each(function(){
            $(this).hover(function(){
                clearTimeout(outTimer);
                hoverTimer = setTimeout(sets.hoverEvent, sets.hoverDuring);
            },function(){
                clearTimeout(hoverTimer);
                outTimer = setTimeout(sets.outEvent, sets.outDuring);
            });
        });
    }
})(jQuery);               
//��ʾ����
$(function(){
    $(".floating_layer").each(function(){
        var that = $(this);
        that.hoverDelay({
            hoverEvent: function(){
                that.find(".info").fadeIn("slow");
            },
            outEvent: function(){
                that.find(".info").hide();
            }
        });
 
    });
    $(".display_solid_colour_alt").each(function(){
        var that = $(this);
        that.hoverDelay({
            hoverEvent: function(){
                that.find("span").fadeIn("slow");
            },
            outEvent: function(){
                that.find("span").hide();
            }
        });
 
    });
});


(function($){
    $.fn.ddslider=function(options){
        var settings={
            affect:'scrollx',
            speed:1200,
            space:6000,
            auto:true,
            trigger:'mouseover',
            conbox:'#conbox',
            ctag:'a',
            switcher:'#switcher',
            stag:'a',
            current:'on',
            rand:false,
            next:'#nextpage',
            prev:'#prevpage',
            iswhile:true,
            pager:'#pager'
        };
        
        settings=$.extend({},settings,options);
        var index=1;
        var old_index=index-1;
        var thiswidth,thisheight;
        var last_index=0;
        var $conli=null;
        var $vimtime;
        var $busy=false;
        var direction='';
        var $conbox=settings.conbox.parent(),$contents=settings.conbox;
        var $switcher=settings.switcher.parent(),$stag=settings.switcher;
        thisheight=$contents.eq(index).height();
        thiswidth=$contents.eq(index).width();
        var $showpager=$(this).find(settings.pager);
        var $nextpage=$(settings.next);
        var $prevpage=$(settings.prev);
        if(settings.rand){
            index=Math.floor(Math.random()*$contents.length);
            slide();
        }
        if(settings.affect=='fade'){
            $.each($contents,function(k,v){
                (k===0)?$(this).css({
                    'position':'absolute',
                    'z-index':9
                }):$(this).css({
                    'position':'absolute',
                    'z-index':1,
                    'opacity':0
                });
            });
        }
        function slide(){
            if(index>=$contents.length){
                index=0;
                if(old_index>=$contents.length){
                    old_index=$contents.length-1;
                }
            }
            $stag.removeClass(settings.current).eq(index).addClass(settings.current);
            switch(settings.affect){
                case'scrollx':
                    var $scrollx_width=$contents.width()>0?$contents.width():0;    
                   
                    if($scrollx_width==0){                          
                        $scrollx_width=$(window).width();
                        $(window).resize(function() {
                            $scrollx_width=$(window).width();
                        });
                    }
                    $contents.css({
                        display:'block',
                        width:$scrollx_width+'px'
                    });
                    $conbox.stop().animate({
                        left:-$contents.width()*index+'px'
                    },settings.speed);
                    break;
                case'scrolly':
                    $contents.css({
                        display:'block'
                    });
                    $conbox.stop().animate({
                        top:-$contents.height()*index+'px'
                    },settings.speed);
                    break;
            }
            $showpager.html(index+1);
            last_index=index;
            if(index>=$contents.length)old_index=$contents.length-1;else old_index=index;
            index++;
        };
    
        if(settings.auto)var Timer=setInterval(slide,settings.space);
        $stag.bind(settings.trigger,function(){
            _pause();
            if($(this).attr("class")=="on")return;
            var now_index=$(this).index();
            $vimtime=setTimeout(_buttonnav(now_index),100);
        }).bind("mouseout",function(){
            clearTimeout($vimtime);
            _continue();
            return false;
        });
        $prevpage.click(function(){
            if($busy)return;
            old_index=last_index;
            if(old_index<0)old_index=$contents.length-1;
            index=last_index-1;
            if(index<0){
                index=$contents.length-1;
                if(!settings.iswhile)return;
            }
            $busy=true;
            direction='left';
            slide();
            return false;
        });
        $nextpage.click(function(){
            if($busy)return;
            old_index=last_index;
            index=last_index+1;
            if(index>=$contents.length){
                index=0;
                if(!settings.iswhile)return;
            }
            $busy=true;
            direction='right';
            slide();
            return false;
        });
        $conbox.hover(_pause,_continue);
        function _pause(){
            clearInterval(Timer);
        }
        function _continue(){
            if(settings.auto){
                clearInterval(Timer);
                Timer=setInterval(slide,settings.space);
            }
        }
        function _buttonnav(nowindex){
            return function(){
                buttonnav(nowindex)
            }
        }
        function buttonnav(nowindex){
            old_index=index-1;
            index=nowindex;
            slide();
        }
    }
})(jQuery);
(function($){
    $.fn.clickAjaxslide = function(options){
        var defaults = {};
        var sets = $.extend(defaults,options || {});                 
        return $(this).each(function(){
            var speed = parseInt(sets.speed); //�ٶ�
            var barclass = sets.barclass; 
            var itemclass = sets.itemclass;
            var area = sets.area;
            var bar = sets.bar;
            var ite = sets.ite;               
            var num = ite.length;
            var i =1;            
            if(speed>0){
                var auto = slide();
            }
            //����ٶȵ���0���Ͳ��Զ���ת���������0�����Զ���ת                       
            ite.each(function(e){
                $(ite.get(e)).hover(function(){                   
                    if(speed>0){
                        auto = window.clearInterval(auto);
                    }
                },function(){
                    if(speed>0){
                        auto = slide();
                    }
                });
            });

            bar.each(function(e){                   
                $(bar.get(e)).hover(function(){                       
                    if(speed>0){
                        auto = window.clearInterval(auto);
                    } //����ٶȵ���0���Ͳ��Զ���ת���������0�����Զ���ת
                    $(this).click(function(){
                        i=e+1;
                        bar.not($(bar.get(e)).addClass(barclass)).removeClass(barclass);                        
                        if(area>0&&e>0){
                            showarea($(ite.get(e)));
                        }                   
                        ite.not($(ite.get(e)).show()).hide();    
                    });                                                                      
                },function(){
                    if(speed>0){
                        auto = slide();
                    }  //����ٶȵ���0���Ͳ��Զ���ת���������0�����Զ���ת
                    if(speed==0){
                        if(itemclass=='hidden'){
                            $(bar.get(e)).removeClass(barclass);
                            $(ite.get(e)).hide();
                        }
                    }//����뿪��������ʽ
                });
            });                                 
            function slide(){
                return window.setInterval(function(){
                    if (i == num){
                        i = 0;                        
                    }
                    bar.not($(bar.get(i)).addClass(barclass)).removeClass(barclass);  //bar��ʽ�л�                    
                    if(area>0&&i>0){
                        showarea($(ite.get(i)));
                    }
                    ite.not($(ite.get(i)).show()).hide();                                       
                    i++;
                }, speed);
            }
        });
    }
})(jQuery);

(function($){
    $.fn.Ajaxslide = function(options){
        var defaults = {};
        var sets = $.extend(defaults,options || {});
        return $(this).each(function(){
            var speed = parseInt(sets.speed);//�ٶ�
            var delay = parseInt(sets.delay);//�л���ʱ
            var barclass = sets.barclass;
            var itemclass = sets.itemclass;
            var area = sets.area;
            var rand = sets.rand;
            var bar = sets.bar;
            var ite = sets.ite;
            var delay_exec = sets.delay_exec;
            var num = ite.length;
            var i =1;
            var ee = 1;
            var eee = 1;
            if(speed>0){
                var auto = slide();
            }  //����ٶȵ���0���Ͳ��Զ���ת���������0�����Զ���ת
            ite.each(function(e){
                $(ite.get(e)).hover(function(){
                    if(speed>0){
                        auto = window.clearInterval(auto);
                    }
                },function(){
                    if(speed>0){
                        auto = slide();
                    }
                });
            });
            bar.each(function(e){
                if(delay_exec>0){//��ʱִ��js�ٷ�
                    var that = $(bar.get(e));
                    that.hoverDelay({
                        hoverDuring: delay_exec,
                        outDuring: delay_exec,
                        hoverEvent: function(){
                            i=e+1;
                            if(speed>0){
                                auto = window.clearInterval(auto);
                            } //����ٶȵ���0���Ͳ��Զ���ת���������0�����Զ���ת
                            bar.not($(bar.get(e)).addClass(barclass)).removeClass(barclass);
                            if(rand>0){
                                if(e==parseInt(num-1)){
                                    ee = parseInt(Math.ceil(Math.random()*10)%num);
                                }
                                if(ee==num){
                                    ee=0;
                                }
                                if(area>0){
                                    showarea($(ite.get(ee)));
                                }
                                if(delay==0){
                                    ite.not($(ite.get(ee)).show()).hide();
                                }
                                if(delay>0){
                                    ite.not($(ite.get(ee)).fadeIn(delay)).fadeOut(delay);
                                }
                                ee++;
                            }else{
                                if(area>0&&e>0){
                                    showarea($(ite.get(e)));
                                }
                                if(delay==0){
                                    ite.not($(ite.get(e)).show()).hide();
                                }
                                if(delay>0){
                                    ite.not($(ite.get(e)).fadeIn(delay)).fadeOut(delay);
                                }
                            }
                        },
                        outEvent: function(){
                            if(speed>0){
                                auto = slide();
                            }  //����ٶȵ���0���Ͳ��Զ���ת���������0�����Զ���ת
                            if(speed==0){
                                if(itemclass=='hidden'){
                                    $(bar.get(e)).removeClass(barclass);
                                    $(ite.get(e)).hide();
                                }
                            }//����뿪��������ʽ
                        }
                    });
                }else{
                    $(bar.get(e)).hover(function(){
                        i=e+1;
                        if(speed>0){
                            auto = window.clearInterval(auto);
                        } //����ٶȵ���0���Ͳ��Զ���ת���������0�����Զ���ת
                        bar.not($(bar.get(e)).addClass(barclass)).removeClass(barclass);
                        if(rand>0){
                            if(e==parseInt(num-1)){
                                ee = parseInt(Math.ceil(Math.random()*10)%num);
                            }
                            if(ee==num){
                                ee=0;
                            }
                            if(area>0){
                                showarea($(ite.get(ee)));
                            }
                            if(delay==0){
                                ite.not($(ite.get(ee)).show()).hide();
                            }
                            if(delay>0){
                                ite.not($(ite.get(ee)).fadeIn(delay)).fadeOut(delay);
                            }
                            ee++;
                        }else{
                            if(area>0&&e>0){
                                showarea($(ite.get(e)));
                            }
                            if(delay==0){
                                ite.not($(ite.get(e)).show()).hide();
                            }
                            if(delay>0){
                                ite.not($(ite.get(e)).fadeIn(delay)).fadeOut(delay);
                            }
                        }
                    },function(){
                        if(speed>0){
                            auto = slide();
                        }  //����ٶȵ���0���Ͳ��Զ���ת���������0�����Զ���ת
                        if(speed==0){
                            if(itemclass=='hidden'){
                                $(bar.get(e)).removeClass(barclass);
                                $(ite.get(e)).hide();
                            }
                        }//����뿪��������ʽ
                    });
                }
            });
            function slide(){
                return window.setInterval(function(){
                    if (i == num){
                        i = 0;
                        eee = parseInt(Math.ceil(Math.random()*10)%num);
                    }
                    bar.not($(bar.get(i)).addClass(barclass)).removeClass(barclass);  //bar��ʽ�л�
                    if(rand>0){
                        if(eee==num){
                            eee=0;
                        }
                        if(area>0){
                            showarea($(ite.get(eee)));
                        }
                        if(delay>0){
                            ite.not($(ite.get(eee)).fadeIn(delay)).fadeOut(delay);
                        }   //���ݵ�������
                        if(delay==0){
                            ite.not($(ite.get(eee)).show()).hide();
                        }   //������ʾ����
                        eee++;
                    }else{
                        if(area>0&&i>0){
                            showarea($(ite.get(i)));
                        }
                        if(delay>0){
                            ite.not($(ite.get(i)).fadeIn(delay)).fadeOut(delay);
                        }   //���ݵ�������
                        if(delay==0){
                            ite.not($(ite.get(i)).show()).hide();
                        }   //������ʾ����
                    }
                    i++;
                }, speed);
            }
        });
    }
})(jQuery);

(function($){
    $.fn.Ajaxmarquee = function(options){
        var defaults = {
            prevnoneclass:'btn_prev_none',
            nextnoneclass:'btn_next_none'
        };
        var sets = $.extend(defaults,options || {});
        return $(this).each(function(){
            var box = sets.box;
            var prevnoneclass=sets.prevnoneclass;
            var nextnoneclass=sets.nextnoneclass;
            var speed = parseInt(sets.speed);
            var delay = parseInt(sets.delay);
            var noend = parseInt(sets.noend);
            var page  = parseInt(sets.page);
            var space = parseInt(box.find('[type=rollbox]').parent().css('width').replace('px',''));
            if(space==318){
                space=321;
            }
            if(space==210){
                space=214;
            }
            var rollLen = box.find('[type=rollitem]').length;
            var itemwidth = parseInt(box.find('[type=rollbox]').find('[type=rollitem]').css('width').replace('px', ''));
            if(noend>0&&(itemwidth*rollLen)>space){
                box.find('[type=rollitem]').eq(0).clone().appendTo(box.find('[type=rollbox]'));
                var tlen = itemwidth * (rollLen+1);
                box.find('[type=rollbox]').css('width', tlen);
                var i = Math.ceil((itemwidth * rollLen-20)/space)+1;
                if(page>0){
                    box.find('.page_len').html(i-1);
                }
            }else{
                box.find('[type=rollbox]').css('width', itemwidth * rollLen);
                var i = Math.ceil((itemwidth * rollLen-20)/space);
                if(page>0){
                    box.find('.page_len').html(i);
                }
            }
            var nowindex=1;
            var direction=0; //0���ң�1������
            box.find("div[type=rollpre]").hover(function(){
                box.find("div[type=rollpre]").addClass('btn_prev_hover');
            },function(){
                box.find("div[type=rollpre]").removeClass('btn_prev_hover');
            });
            box.find("div[type=rollnext]").hover(function(){
                box.find("div[type=rollnext]").addClass('btn_next_hover');
            },function(){
                box.find("div[type=rollnext]").removeClass('btn_next_hover');
            });
            function checkStatus(space,offset,width) {
                var space = parseInt(box.find('[type=rollbox]').parent().css('width').replace('px',''));
                var offset = parseInt(box.find("[type=rollbox]").css('left'));
                var width = parseInt(box.find("[type=rollbox]").css('width'));
                if(space==318){
                    space=321;
                }
                if(space==210){
                    space=214;
                }
                if(offset<0){
                    box.find('[type=rollpre]').unbind('click').one('click',leftClick);
                }
                if(offset>=20-(width-space)){
                    box.find('[type=rollnext]').unbind('click').one('click',rightClick);
                }
                if(offset==0){
                    box.find('[type=rollpre]').addClass(prevnoneclass).unbind();
                }else{
                    box.find('[type=rollpre]').removeClass(prevnoneclass);
                }
                if(offset<=20-(width-space)){
                    box.find('[type=rollnext]').addClass(nextnoneclass).unbind();
                }else{
                    box.find('[type=rollnext]').removeClass(nextnoneclass);
                }
            };
            function changePage(){
                if(page>0){
                    var left_now=parseInt(box.find("[type=rollbox]").css('left').replace('px',''));
                    if(left_now==0){
                        box.find('.page_index').html(1);
                    }else{
                        box.find('.page_index').html((0-left_now)/space+1);
                    }
                }
            }
            function leftClick(){
                box.find("[type=rollbox]").animate({
                    left:'+='+space
                },delay,function(){
                    nowindex--;
                    changePage();
                    checkStatus();
                })
            };
            function rightClick(){
                box.find("[type=rollbox]").animate({
                    left:'-='+space
                },delay,function(){
                    if(noend>0&&nowindex==(i-1)){
                        box.find("[type=rollbox]").css({
                            left:'0px'
                        });
                        nowindex=1;
                    }else{
                        nowindex++;
                    }
                    changePage();
                    checkStatus();
                })
            };

            if(speed>0){
                if(noend>0){
                    nowindex=0;
                }
                function autoroll(){
                    return window.setInterval(function(){
                        if(nowindex==i){
                            if(noend>0&&nowindex==i){
                                nowindex=1;
                            }else{
                                direction=1;
                            }
                        }
                        if(nowindex==1){
                            direction=0;
                        }
                        if(direction==0){
                            box.find("[type=rollbox]").animate({
                                left:'-='+space
                            },delay,function(){
                                if(noend>0&&nowindex==(i-1)){
                                    direction=0;
                                    box.find("[type=rollbox]").css({
                                        left:'0px'
                                    });
                                }
                                changePage();
                                checkStatus();
                            });
                            nowindex++;
                        }
                        if(direction==1){
                            box.find("[type=rollbox]").animate({
                                left:'+='+space
                            },delay,function(){
                                changePage();
                                checkStatus();
                            });
                            nowindex--;
                        }
                    },speed);
                }
                changePage();
                checkStatus();
                var auto = autoroll();
                box.hover(function(){
                    auto = window.clearInterval(auto);
                },function(){
                    auto = autoroll();
                });
            }else{
                changePage();
                checkStatus();
            }
        });
    }
})(jQuery);    

(function($){
    $.fn.AjaxNewmarquee = function(options){
        var defaults = {
                    
        };
        var config = $.extend(defaults,options || {});
        return $(this).each(function(){       
            var $box=config.box;
            var $rollpre=$box.find('[type=rollpre]');
            var $rollnext=$box.find('[type=rollnext]');
            var $inner=$box.find(".over>ul");
            var $stepWidth=parseInt($box.find(".over>ul>li").width());
            var $move_width=parseInt($box.width());
            var $count_type=config.display_count;
            var $is_display_tab=config.is_display_tab;
            var $count=Math.ceil(parseInt($box.find(".over").width())/parseInt($stepWidth));
            if($count_type!=''&&$count_type!=undefined){
                var minsize=1210;
                var screensize=screen.width;
                var $count_arr=$count_type.split('|');
                if (screensize<minsize){
                    $count=$count_arr[1];
                }else{
                    $count=$count_arr[0];
                }         
            }
            var $mv_count=$box.find(".over>ul>li").length/$count;
            if($count>1&&$mv_count>1&&$mv_count<2){
                $cp_count=2*$count-$box.find(".over>ul>li").length;
                $self=$box.find(".over>ul");
                $self.children("li:lt("+($cp_count)+")").clone().appendTo($self); //appendTo��ֱ���ƶ�Ԫ�� 
                $mv_count=2;
            }
            if($mv_count>1&&$is_display_tab==1){
                var $marquee_tab=$box.find('.mix_marquee_tab');                
                for(var mti=1;mti<$mv_count+1;mti++){  
                    if(mti==1){
                        $marquee_tab.append('<li class="current">'+mti+'</li>');  
                    }else{
                        $marquee_tab.append('<li>'+mti+'</li>');                                 
                    }
                }
            }
            if(config.auto>0&&$mv_count>1){
                var flag = setInterval(RightScroll, parseInt(config.speed));
                //��ͣ
                $box.hover(function() {
                    clearInterval(flag)
                }, function() {
                    flag = setInterval(RightScroll, parseInt(config.speed));
                });
            }
            $rollpre.hover(function(){
                $(this).addClass('btn_prev_hover');
            },function(){
                $(this).removeClass('btn_prev_hover');
            });
            $rollnext.hover(function(){
                $(this).addClass('btn_next_hover');
            },function(){
                $(this).removeClass('btn_next_hover');
            });
            if($mv_count>1&&$is_display_tab==1){
                $box.find('.mix_marquee_tab li[class!="current"]').live('click hover', function() {
                    $c_index=$(this).index()+1;
                    $current_index=$box.find('.mix_marquee_tab li[class="current"]').index()+1;
                    if($c_index>$current_index){
                        RightScroll($c_index);
                    }else{
                        LeftScroll($c_index);
                    }                
                });
            }
        
            //�ҹ�
            $rollnext.click(function() {
                RightScroll(0);
            });
            //���
            $rollpre.click(function() {
                LeftScroll(0);
            });
            function RightScroll($c_index){
                if($c_index == undefined){
                    $c_index = 0;
                } 
                
                if( !$inner.is(":animated")&&$mv_count>1 ){           
                    var  r_s=SimpleAutoScroll($c_index);
                    if($mv_count>1&&$is_display_tab==1){
                        var r_c=r_s.getclick();
                        if($c_index==0){
                            $c_index=r_c;
                        }
                        $box.find('.mix_marquee_tab li').eq($c_index-1).addClass('current').siblings().removeClass();
                    }
                    
                }
            }
            function LeftScroll($c_index){
                if($c_index == undefined){
                    $c_index = 0;
                } 
                
                if( !$inner.is(":animated")&&$mv_count>1 ){  
                    var l_s=SimpleLeftScroll($c_index);
                    if($mv_count>1&&$is_display_tab==1){
                        var l_c=l_s.getclick();
                        if($c_index==0){
                            $c_index=l_c;
                        }
                        $box.find('.mix_marquee_tab li').eq($c_index-1).addClass('current').siblings().removeClass();
                    }
                }
            }
            var $c_i=1;
            function SimpleAutoScroll($c_index) {     
                $m_t=1;
                if($c_index>0){
                    $m_t=$c_index-$c_i;
                }
                //var Left = parseInt($inner.css("left"));
                var Left = $inner.css("left") == 'auto' ? 0 : parseInt($inner.css("left"));  //ie78 compatible
                var $self = $box.find(".over>ul"); 
                $inner.stop().animate({
                    "left": parseInt(Left) - $m_t*$move_width
                }, config.delay, function() {
                    $self.children("li:lt("+($m_t*$count)+")").appendTo($self); //appendTo��ֱ���ƶ�Ԫ��     
                    $inner.css("left", 0); //��ʼ��marginleft
                });
                
                return {       
                    getclick : function(){
                        if($c_index>0){
                            $c_i=$c_index;
                        }else{
                            if($c_i==$mv_count){
                                $c_i=1;
                            }else{
                                $c_i++;
                            }
                        }
                        return $c_i;    
                    }    
                } 
            }
            function SimpleLeftScroll($c_index) {
                //������Ҫ��ƴװ���ƶ�
                $m_t=1;
                if($c_index>0){
                    $m_t=$c_i-$c_index;
                }
                //var Left = parseInt($inner.css("left"));
                var Left = $inner.css("left") == 'auto' ? 0 : parseInt($inner.css("left"));  //ie78 compatible
                var $self = $box.find(".over>ul");
                $self.children("li:gt("+(($mv_count-$m_t)*$count-1)+")").prependTo($self); //appendTo��ֱ���ƶ�Ԫ�� 
                $inner.css("left", -$m_t*$move_width);
                $inner.stop().animate({
                    "left": parseInt(Left)
                }, config.delay);
                return {       
                    getclick : function(){
                        if($c_index>0){
                            $c_i=$c_index;
                        }else{
                            if($c_i==1){
                                $c_i=$mv_count;
                            }else{
                                $c_i--;
                            }
                        }
                        return $c_i;    
                    }    
                } 
            }
        });
    }
})(jQuery);   

(function($,window,undefined) {
    $.fn.simplyScroll = function(options) {
        return this.each(function() {
            new $.simplyScroll(this,options);
        });
    };
    var defaults = {
        frameRate: 24, //No of movements per second
        speed: 1, //No of pixels per frame
        orientation: 'horizontal', 
        auto: true,
        autoMode: 'loop',
        manualMode: 'end',
        direction: 'forwards', 
        pauseOnHover: true
    };	
    $.simplyScroll = function(el,options) {	
        var self = this;	
        this.o = $.extend({}, defaults, options || {});    
        this.isAuto = this.o.auto!==false && this.o.autoMode.match(/^loop|bounce$/)!==null;
        this.isHorizontal = this.o.orientation.match(/^horizontal|vertical$/)!==null && this.o.orientation==defaults.orientation; 
        this.isRTL = this.isHorizontal && $("html").attr('dir') == 'rtl';
        this.isForwards = !this.isAuto  || (this.isAuto && this.o.direction.match(/^forwards|backwards$/)!==null && this.o.direction==defaults.direction) && !this.isRTL;
        this.isLoop = this.isAuto && this.o.autoMode == 'loop' || !this.isAuto && this.o.manualMode == 'loop';
	
        this.supportsTouch = false;	
        this.events = {
            start:'mouseenter',
            end:'mouseleave'
        };	
        this.$list = $(el).find('ul'); //called on ul/ol/div etc
        var $items = this.$list.children();	

        //wrap an extra div around the whole lot if elements scrolled aren't equal
        if ($items.length > 1) {		
            var extra_wrap = false,
            total = 0;			
            if (this.isHorizontal) {
                $items.each(function() {
                    total+=$(this).outerWidth(true);
                });
                extra_wrap = $items.eq(0).outerWidth(true) * $items.length !== total;
            } 	
        }		
        this.init();		
    };	
    $.simplyScroll.fn = $.simplyScroll.prototype = {};
    $.simplyScroll.fn.extend = $.simplyScroll.extend = $.extend;
    $.simplyScroll.fn.extend({
        init: function() {
            this.$items = this.$list.children();
            this.$clip = this.$list.parent(); //this is the element that scrolls
            this.$container = this.$clip.parent();
            if (this.isHorizontal) {			
                this.itemMax = this.$items.eq(0).outerWidth(true);
                this.clipMax = this.$clip.width();			
                this.dimension = 'width';
                this.scrollPos = 'Left';
            }		
            this.posMin = 0;		
            this.posMax = this.$items.length * this.itemMax;		
            var addItems = Math.ceil(this.clipMax / this.itemMax);		
            //auto scroll loop & manual scroll bounce or end(to-end)
            if (this.isAuto && this.o.autoMode=='loop') {			
                this.$list.css(this.dimension,this.posMax+(this.itemMax*addItems) +'px');			
                this.posMax += (this.clipMax - this.o.speed);			
                if (this.isForwards) {
                    this.$items.slice(0,addItems).clone(true).appendTo(this.$list);
                    this.resetPosition = 0;				
                }		
            //manual and loop
            }		
            this.resetPos() //ensure scroll position is reset		
            this.interval = null;	
            this.intervalDelay = Math.floor(1000 / this.o.frameRate);		
            if (!(!this.isAuto && this.o.manualMode=='end')) { //loop mode
                //ensure that speed is divisible by item width. Helps to always make images even not odd widths!
                while (this.itemMax % this.o.speed !== 0) {
                    this.o.speed--;
                    if (this.o.speed===0) {
                        this.o.speed=1;
                        break;	
                    }
                }
            }		
            var self = this;
            this.trigger = null;
            this.funcMoveForward = function(e) {
                if (e !== undefined) {
                    e.preventDefault();
                }
                self.trigger = !self.isAuto && self.o.manualMode=='end' ? this : null;
                if (self.isAuto) {
                    self.isForwards ? self.moveForward() : self.moveBack(); 
                } else {
                    self.moveForward();	
                }
            };
            this.funcMovePause = function() {
                self.movePause();
            };
            this.funcMoveResume = function() {
                self.moveResume();
            };
            if (this.isAuto) {
                this.paused = false;
                if (this.isAuto && this.o.pauseOnHover && !this.supportsTouch) {
                    this.$clip.bind(this.events.start,this.funcMovePause).bind(this.events.end,this.funcMoveResume);
                } 
                this.funcMoveForward();
            }
        },
        moveForward: function() {
            var self = this;
            this.movement = 'forward';
            self.interval = setInterval(function() {
                if (self.$clip[0]['scroll' + self.scrollPos] < (self.posMax-self.clipMax)) {
                    self.$clip[0]['scroll' + self.scrollPos] += self.o.speed;
                } else if (self.isLoop) {
                    self.resetPos();
                } else {
                    self.moveStop(self.movement);
                }
            },self.intervalDelay);
        },
        movePause: function() {
            clearInterval(this.interval);	
        },
        moveResume: function() {
            this.movement=='forward' ? this.moveForward() : this.moveBack();
        },
        resetPos: function() {
            this.$clip[0]['scroll' + this.scrollPos] = this.resetPosition;
        }
    });
		  
})(jQuery,window);
function callAjax(obj,flag){
    if(flag==1){
        var target = obj;
    }else{
        var target = obj.find('[js=true]');
    }
    var countdownObj=new Array();
    target.each(function(){
        var action= $(this).attr('action');    //��������
        if(action=='hover'){
            var updown= $(this).attr('updown');      //����
            var rand = $(this).attr('rand');      //�Ƿ����
            var area =$(this).attr('area');       //�Ƿ�textarea�Ż�
            var barclass=$(this).attr('barclass'); //��ǰtab��ʽ
            var itemclass=$(this).attr('itemclass'); //��ǰtab��ʽ
            var level =$(this).attr('level');      //Ƕ�ײ㼶
            var delay_exec = $(this).attr('delay_exec'); //�Ƿ���ʱִ�У�0Ϊ����ִ��
            if(delay_exec==undefined){
                delay_exec=0;
            }
            if(level>1){
                var bar = $(this).find('[type=bar]:first').siblings("[type=bar]").andSelf();  //Ч��������bar
                var ite = $(this).find('[type=item]:first').siblings("[type=item]").andSelf();//�л�����
            }else{
                var bar = $(this).find('[type=bar]');  //��д������ʵ��jsЧ��Ƕ��
                var ite = $(this).find('[type=item]'); //��д������ʵ��jsЧ��Ƕ��
            }
            var delay =parseInt($(this).attr('delay'));      //�л��ӳ�
            var speed= $(this).attr('speed'); 
            var affect='scrolly';
            if(updown==3){
                affect='scrollx';
            }
            var auto=speed>0?true:false;
            var rand= $(this).attr('rand');
            if(rand==undefined){
                rand=false;
            }
            if(ite.length>0&&bar.length>0){
                if(updown>1){
                    if(delay<1){
                        delay=200;
                    }
                    ite.each(function(e){
                        ite.not($(ite.get(0))).css('display',"block");
                    });
                    ite.parent().css('position','relative');
                    $(this).ddslider({
                        affect:affect,//���ҿɸ�Ϊscrollx
                        speed:delay,
                        space:speed,
                        auto:auto,
                        trigger:'mouseover',
                        conbox:ite,//'#slidecontent',//item
                        ctag:'li',
                        switcher:bar,//'#slidelabel_nav',//bar
                        stag:'li',
                        current:'on',
                        rand:rand
                    });
                }else{
                    //�����л�Ч��
                    $(this).Ajaxslide({
                        speed:speed,
                        bar:bar,
                        ite:ite,
                        rand:rand,
                        level:level,
                        area:area,
                        delay:delay,
                        barclass:barclass,
                        itemclass:itemclass,
                        delay_exec:delay_exec
                    });
                }
            }
        }
        if(action =="click"){
            var updown= $(this).attr('updown');      //����           
            var area =$(this).attr('area');       //�Ƿ�textarea�Ż�
            var barclass=$(this).attr('barclass'); //��ǰtab��ʽ
            var itemclass=$(this).attr('itemclass'); //��ǰtab��ʽ
            var level =$(this).attr('level');      //Ƕ�ײ㼶
            
            if(level>1){
                var bar = $(this).find('[type=bar]:first').siblings("[type=bar]").andSelf();  //Ч��������bar
                var ite = $(this).find('[type=item]:first').siblings("[type=item]").andSelf();//�л�����
            }else{
                var bar = $(this).find('[type=bar]');  //��д������ʵ��jsЧ��Ƕ��
                var ite = $(this).find('[type=item]'); //��д������ʵ��jsЧ��Ƕ��
            }
            
            var speed= $(this).attr('speed');      //�л��ٶ�
            if(ite.length>0&&bar.length>0){
                if(updown>1){
                    ite.not($(ite.get(0))).css('display',"block"); 
                    ite.parent().css('position','relative');
                    $(this).ddslider({
                        affect:'scrolly',//���ҿɸ�Ϊscrollx
                        speed:200,
                        space:speed,
                        auto:true,
                        trigger:'click',
                        conbox:ite,//'#slidecontent',//item
                        ctag:'li',
                        switcher:bar,//'#slidelabel_nav',//bar
                        stag:'li',
                        current:'on',
                        rand:false
                    });
                }else{
                    //�����л�Ч��
                    $(this).clickAjaxslide({
                        speed:speed,
                        bar:bar,
                        ite:ite,                        
                        level:level,
                        area:area,                       
                        barclass:barclass,
                        itemclass:itemclass                       
                    });
                }
            }
        }
        if(action=='clickroll'){
            var prevnoneclass=$(this).attr('prevnoneclass');
            var nextnoneclass=$(this).attr('nextnoneclass');
            var delay =$(this).attr('delay');
            var speed= $(this).attr('speed');      //�Զ��ٶ�
            var noend= $(this).attr('noend');
            var page= $(this).attr('page');
            $(this).Ajaxmarquee({
                box:$(this),
                delay:delay,
                prevnoneclass:prevnoneclass,
                nextnoneclass:nextnoneclass,
                speed:speed,
                noend:noend,
                page:page
            });
        }
        if(action=='newclickroll'){
            var prevnoneclass=$(this).attr('prevnoneclass');
            var nextnoneclass=$(this).attr('nextnoneclass');
            var delay =$(this).attr('delay');
            var speed= $(this).attr('speed');      //�Զ��ٶ�
            var display_count=$(this).attr('display_count');//ÿ֡��ʾ����
            var is_display_tab=$(this).attr('is_display_tab');//�Ƿ���ʾtab��ť
            var auto=0;
            if(speed>0){
                auto=1;
            }
            $(this).AjaxNewmarquee({
                box:$(this),
                speed:speed,
                delay:delay,
                auto:auto,
                display_count:display_count,
                is_display_tab:is_display_tab
            });
        }
        if(action=='simplyScroll'){//�������������
            var speed= $(this).attr('speed');      //�Զ��ٶ�
            if(speed<24){
                speed=24
            }
            $(this).simplyScroll({
                frameRate:speed
            });
        }
        if(action=='countdown'){
            var value=$(this).attr('value');
            var endvalue=$(this).attr('endvalue');
            var showtype=$(this).attr('showtype');
            var image = $(this).attr('image'); //�Ƿ���ͼƬ����
            if(image==undefined){
                image=0;
            }
            var overtype =$(this).attr('overtype');//0:���֣�1:���ѽ�������2:��
            if(overtype==undefined){
                overtype=0;
            }
            if(showtype==undefined){
                showtype=0;
            }
            if(value==undefined){
                value=0;
            }
            if(endvalue==undefined){
                endvalue=0;
            }
            countdownObj.push({
                'obj':$(this),
                'lefttime':value,
                'endtime':endvalue,
                'showtype':showtype,
                'image':image,
                'overtype':overtype
            });
        }
    });
    var countdownobjLength = countdownObj.length;
    var countdownSObj=new Array();//�뼶
    var countdownMSObj=new Array();//���뼶
    for(var i=0;i<countdownobjLength;i++){
        var obj = countdownObj[i]['obj'];
        var spanlist = obj.find('>span');
        var showtype = countdownObj[i]['showtype'];
        var image = countdownObj[i]['image'];
        if((image>0&&showtype!=2)||(image==0&&showtype==0&&spanlist.length==4)){//ͼƬ��ʾ����ʾ����ʱ������ͼƬ����ʾ����ʱ
            countdownMSObj.push(countdownObj[i]);
        }else{
            countdownSObj.push(countdownObj[i]);
        }        
    }
    var countdownSObjLength = countdownSObj.length;
    var countdownMSObjLength = countdownMSObj.length;
    if(countdownSObjLength>0){
        countdown(countdownSObj,1000,countdownSObjLength)
    }
    if(countdownMSObjLength>0){
        countdown(countdownMSObj,100,countdownMSObjLength)
    }
    function countdown(countdownObj,speed,objLength){
        var vtimestamp =Date.parse(new Date());
        for(var i=0;i<objLength;i++){
            if(countdownObj[i]['endtime']>0){
                eval("var lefttime" + i + "=parseInt(countdownObj[i]['endtime'])*1000-vtimestamp;");
            }else{
                eval("var lefttime" + i + "=parseInt(countdownObj[i]['lefttime'])*1000;");
            }
        }
        window.setInterval(function() {
            for(var i=0;i<objLength;i++){
                var obj = countdownObj[i]['obj'];
                var spanlist = obj.find('>span');
                var showtype = countdownObj[i]['showtype'];
                var image = countdownObj[i]['image'];
                var overtype = countdownObj[i]['overtype'];
                eval("lefttime=lefttime" + i + "-speed;");
                eval("lefttime" + i + "=lefttime;");                
     
                var nMS = lefttime;
                var nH  = Math.floor(nMS/(1000*60*60));
                if(showtype>1){
                    var nD = parseInt(nH/24);
                    nH = nH % 24;
                    nMS = nMS-(60*60*24*nD*1000);
                }
                var nM  = Math.floor((nMS-(1000*60*60*nH))/(1000*60));
                var nS  = Math.floor((nMS-(1000*60*60*nH)-(1000*60*nM))/1000);
                var nMS = Math.floor(nMS/100%10);
                if(image>0){
                    if(lefttime>0){                 
                        if(showtype>1){
                            var nDarr=(nD+"").split('');
                            var ndstr='';
                            for(var ndi=0;ndi<nDarr.length;ndi++){
                                ndstr=ndstr+"<img src='images/model/sec/"+nDarr[ndi]+".gif'>";
                            }
                            obj.find("[sec=d]").html(ndstr);
                        }
                        if(nH<=9){
                            nH="0"+nH;
                        }
                        var nHarr=(nH+"").split('');
                        var nhstr='';
                        for(var nhi=0;nhi<nHarr.length;nhi++){
                            nhstr=nhstr+"<img src='images/model/sec/"+nHarr[nhi]+".gif'>";
                        }
                        obj.find("[sec=h]").html(nhstr);
                        if(nM<=9){
                            nM="0"+nM;
                        }
                        var nMarr=(nM+"").split('');
                        obj.find("[sec=m]").html("<img src='images/model/sec/"+nMarr[0]+".gif' /><img src='images/model/sec/"+nMarr[1]+".gif' />");
                        if(nS<=9){
                            nS="0"+nS;
                        }
                        var nSarr=(nS+"").split('');
                        obj.find("[sec=s]").html("<img src='images/model/sec/"+nSarr[0]+".gif' /><img src='images/model/sec/"+nSarr[1]+".gif' />")
                        if(showtype!=2){
                            if(nS==0&&nM==0){
                                obj.find("[sec=ms]").html("<img src='images/model/sec/0.gif' /><img src='images/model/sec/0.gif' />");
                            }else{
                                obj.find("[sec=ms]").html("<img src='images/model/sec/"+nMS+".gif' /><img src='images/model/sec/"+Math.abs(nMS-1)+".gif' />");
                            }
                        }
                    }else{
                        spanlist.each(function(e){
                            spanlist.find("[sec]").html("<img src='images/model/sec/0.gif' /><img src='images/model/sec/0.gif' />");
                        });
                    }
                }else{
                    if(lefttime>0){
                        if(showtype==0){
                            if(nH<=9){
                                nH="0"+nH;
                            }
                            spanlist.eq(0).html(""+nH+"");
                            if(nM<=9){
                                nM="0"+nM;
                            }
                            spanlist.eq(1).html(""+nM+"");
                            if(nS<=9){
                                nS="0"+nS;
                            }
                            spanlist.eq(2).html(""+nS+"");
                            spanlist.eq(3).html(nMS+""+Math.abs(nMS-1));
                        }else if (showtype==3){
                            if(nD > 0 ){
                                obj.find("[sec=sep]").html('��ʣ<span>'+nD+'</span>��');
                            }else if(nD<=0 && nH>0){
                                if(nH<=9){
                                    nH="0"+nH;
                                }
                                obj.find("[sec=sep]").html('��ʣ<span>'+nH+'</span>Сʱ');
                            }else if(nD<=0 && nH<=0 && nM>0){
                                if(nM<=9){
                                    nM="0"+nM;
                                }
                                obj.find("[sec=sep]").html('��ʣ<span>'+nM+'</span>��');
                            }else if(nD<=0 && nH<=0 && nM<=0 && nS>0){
                                if(nS<=9){
                                    nS="0"+nS;
                                }
                                obj.find("[sec=sep]").html('��ʣ<span>'+nS+'</span>��');
                            }
                        }else if (showtype==4){
                            if(nD > 0 ){
                                obj.find("[sec=sep]").html('����<span>'+nD+'</span>�쿪ʼ');
                            }else if(nD<=0 && nH>0){
                                if(nH<=9){
                                    nH="0"+nH;
                                }
                                obj.find("[sec=sep]").html('����<span>'+nH+'</span>Сʱ��ʼ');
                            }else if(nD<=0 && nH<=0 && nM>0){
                                if(nM<=9){
                                    nM="0"+nM;
                                }
                                obj.find("[sec=sep]").html('����<span>'+nM+'</span>�ֿ�ʼ');
                            }else if(nD<=0 && nH<=0 && nM<=0 && nS>0){
                                if(nS<=9){
                                    nS="0"+nS;
                                }
                                obj.find("[sec=sep]").html('����<span>'+nS+'</span>�뿪ʼ');
                            }
                        }
                        else{
                            if(showtype>1){
                                obj.find("[sec=d]").html(nD);
                            }
                            if(nH<=9){
                                nH="0"+nH;
                            }
                            obj.find("[sec=h]").html(nH);
                            if(nM<=9){
                                nM="0"+nM;
                            }
                            obj.find("[sec=m]").html(nM);
                            if(nS<=9){
                                nS="0"+nS;
                            }
                            obj.find("[sec=s]").html(nS)
                        }
                    }else{
                        if(showtype==0){
                            spanlist.each(function(e){
                                spanlist.eq(e).html('00');
                            });
                        }else{
                            if(overtype==0){
                                obj.find("[sec]").html('00');
                            }
                            if(overtype==1){
                                obj.html('�ѽ���');
                            }
                            if(overtype==2){
                                obj.html('');
                            }
                            if(overtype==3){
                                obj.html('<span class="closing">��������</span>');
                            }
                            if(overtype==4){
                                obj.html('<span class="v_time_over">��ѽ���</span>');
                            }
                            if(overtype==5){
                                obj.html('<span class="closing">�ѽ���</span>');
                            }
                        }
                    }
                }              
            }
        },
        speed);
    }
    
    return;
}

//����ģ����ʾ
$(function(){
    $(".is_control_show").each(function(e){
        //��ǰdom
        var current_dom = $(this);
        //div�����
        var depth = current_dom.attr("control_depth");
        depth = parseInt(depth);
        var root_dom;
        if(depth>0){
            for(var i=0;i<depth;i++){
                root_dom = current_dom.parent();
                current_dom = root_dom;
            }
            root_dom.hide();
            root_dom.next(".spacer").hide();
        }
        
    })
})