!function rose(o){
	var  r=o || {};
	var  _c=$('#miniCart')
		,_r=$('#region')
		,_t=$('.p-common-topsubnav')
		,_nt=$('#navtoggle')
		,_n=$('#navcon')
		,_porder=$('#p-order')
		,_pdialog=$('#p-dialog');

	r.lazyloadimg=function(){

		var _lazy = $("img.lazy, div.lazy, section.lazy");

	    _lazy.lazyload({
	    	//placeholder: 'img/grey.gif',
	        effect: "fadeIn",
	        threshold : 800
	    });

	};

	r.slideBanner=function() {
	    var $frameBanner = $('#frameBanner'),
	    	$selector=$frameBanner.find('li'),
	    	winW=$(window).width();
	    $selector.width(winW);
	    $frameBanner.sly({
	    	horizontal: 1,
	    	itemNav: 'forceCentered',
			itemSelector: $selector,
			smart: true,
			activateMiddle: 1,
			pagesBar: $(".slidebtn"),
			activatePageOn: "click",
			cycleBy: 'pages',
			cycleInterval:3000,
			pauseOnHover: 1,
			touchDragging:1,
			startPaused: 0,
			mouseDragging: 1,
			releaseSwing: 1,
			speed: 800,
			elasticBounds: 1,
			pageBuilder: function () { return '<li>&nbsp;</li>'; }
	    });

		$frameBanner.sly('on','move',function(eventName) {
			$('a.lazy').lazyload({container: $("#frameBanner")});
		});


		$(window).resize(function(e) {
			winW=$(window).width();
			$selector.width(winW);
			$frameBanner.sly('reload');
		});

	};


	r.cartSlide=function(i){
		var $frame = $('.cartSlidee_'+i);
		var $wrap  = $frame.parent();
		$frame.sly({
			horizontal: 1,
			itemNav: 'centered',
			itemSelector: $frame.find('li'),
			smart: 1,
			activateOn: 'click',
			mouseDragging: 1,
			touchDragging: 1,
			releaseSwing: 1,
			startAt: 0,
			scrollBy: 1,
			speed: 300,
			elasticBounds: 1,
			dragHandle: 1,
			dynamicHandle: 1,
			clickBar: 1,
			prevPage: $wrap.find('.prev'),
			nextPage: $wrap.find('.next')
		});
	}
	r.cartTab=function(){
		r.cartSlide(0);
		$('.look-history-menu>li').on('click', function(){
			var i=$(this).index();
			$(this).addClass('looked').siblings().removeClass('looked');
			$('.look-history-con>div').eq(i).fadeIn(300).siblings().hide();
			r.cartSlide(i);
		})
	}

	r.commonRegion=function(){
		// _r.on('mouseover', function(){
		// 	$(this).addClass('select').find('.p-common-regionCon').removeClass('hide');
		// }).on('mouseout', function(){
		// 	$(this).removeClass('select').find('.p-common-regionCon').addClass('hide');
		// });
        _r.hover(function() {
        	$(this).addClass('select').find('.p-common-regionCon').removeClass('hide');
        }, function() {
        	$(this).removeClass('select').find('.p-common-regionCon').addClass('hide');
        });
		_t.on('mouseover', function(){
			$(this).addClass('cur').children('div').removeClass('hide');
		}).on('mouseout', function(){
			$(this).removeClass('cur').children('div').addClass('hide');
		});
		$('#regSel li>.provicesel').on('click', function(){
			var $this=$(this);
			if(!$this.hasClass('cur')){
				$this.addClass('cur').find('.iconfont').html('&#xe60b;').end().next('.citysel').slideDown(200);
			}else{
				$this.removeClass('cur').find('.iconfont').html('&#xe60a;').end().next('.citysel').slideUp(200);
			}
		});
                // select region
                $("#regSel a:not(.provicesel)").on('click', function() {
                    setRegion($(this).data('id'), $(this).text());
                });
	};
        setRegion = function(id, name) {
            var url = "/region/setRegion?region_id=" + id + "&region_name=" + name;
            window.location.href = url;
        };

	r.commonTop=function(){
		
		$('.p-common-minicart').delegate('#miniCart', 'click', function(e){
            e.stopPropagation();
            $('#miniCart').toggleClass('cur').next('.cartcont').slideToggle(300);
            if(_nt.hasClass('cur')){
                _nt.removeClass('cur');
                _n.removeClass('acti');
            }
        });

		
		_nt.on('click', function(e){
			e.stopPropagation();
			$(this).toggleClass('cur');
			_n.toggleClass('acti');
			if(_c.hasClass('cur')){
				_c.removeClass('cur').next('.cartcont').slideUp(300);
			}
		});

		$('body').on('click', function(e){
			if(_c.hasClass('cur') && !$(e.target).parents().is('.cartcont') ){
				_c.removeClass('cur').next('.cartcont').slideUp(300);
			}
		})

		function selectPronum(){
			/*var $num, _val;
			$('.btn-plus').click(function(){
				$num=$(this).prev('input');
				_val=parseInt($num.val());
				if(_val<=1){
					_val=1;
				}
				_val++;
				$num.val(_val);
			});
			$('.btn-minus').click(function(){
				$num=$(this).next('input');
				_val=parseInt($num.val());
				_val--;
				if(_val>1){
					$num.val(_val);
				}else{
					$num.val(1);
				}
			});*/
		}
		return selectPronum();
	};
	r.order=function(){
		$('#orderAddressList').delegate('.tag', 'click', function(){
			$(this).parent().addClass('cur').siblings().removeClass('cur');
		});
		$('#orderPayList>li').on('click', function(){
			$(this).addClass('cur').siblings().removeClass('cur');
			if($(this).hasClass('balancepay')||$(this).children().hasClass('.payways')){
				$(this).find('.paytips').slideDown(200);
				$(this).siblings().find('.paytips').slideUp();
			}else{
				$(this).siblings().find('.paytips').slideUp(100);
			}
		});

		$('.inpRadio').on('change', function(){
			var $this=$(this);
			if($this.is('#need')){
				$this.parent().next('form').slideDown(200);
			}else{
				$this.parent().next('form').slideUp(200);
			}
		});
	
	   // $others.hide();//隐藏获取的jq对象
         $('#orderAddressSwitch').delegate('.more', 'click', function() {
         	var $others=$('#orderAddressList li:gt(0)');
           if($others.is(':visible')){
          	$others.slideUp(300);
           //$('#orderAddressList li:gt(0)').slideUp(300);
             $(this).find('a').removeClass('b-u');
             $(this).find('b').text('更多地址');
             $('#orderAddressList').removeClass('unfold');
           }
           else{
           	$others.slideDown(300);
           // $('#orderAddressList li:gt(0)').slideDown(300);
            $(this).find('a').addClass('b-u');
            $(this).find('b').text('收起地址');
            $('#orderAddressList').addClass('unfold');
          } 
        }); 
	};

	r.recharge=function(){
		$('#recharge-sum>li').on('click', function(){
			$(this).addClass('cur').siblings().removeClass('cur');
		})
	}

	r.usercenter=function(){
		var timeId=null,
			a,
			b=$('#uctabnav').find('.line').css('left');

		$('#uctabnav>ul>li').mouseover(function(e){
			e.stopPropagation;
			var c=$(this).offset().left,
				a=$('#uctabnav>ul>li:eq(0)').offset().left;
			clearTimeout(timeId);
			timeId=setTimeout(function(){
				$('#uctabnav>.wrap-line>.line').animate({left: c-a},200);
			},200);
		}).mouseout(function(e){
			e.stopPropagation;
			clearTimeout(timeId);
			timeId=setTimeout(function(){
				$('#uctabnav>.wrap-line>.line').animate({left: b},200);
			},200);
		});

		$(".recharge-con3 p.icon-bg").on("click",function(){
	      if(!$(this).hasClass("actived")){
	        $(this).addClass("actived");
	      }else{  
	      	$(this).removeClass("actived");	
      	}
    });
}

    r.search = function() {
        $('input[type=search]').on('input propertychange focus', function () {
            var last_keyword = $("#last_keyword").val();
            var keyword = $(this).val();
            if(keyword != "" ){
                $("#last_keyword").val(keyword);
                if(last_keyword!=keyword){
                    $.ajax({
                        type: 'POST',
                        url: "/ajax/search/hint",
                        data: {
                            keyword: keyword
                        },
                        dataType: 'json',
                        success: function(result) {
                            if(result.code=='200'){
                                $(".subsearch").empty();
                                var search_result= eval(result.msg);
                                for(var i=0; i<search_result.length;i++){
                                    $(".subsearch").append("<li onclick='location.href=\"/prolist/search?keyword="+search_result[i].name+"\"'>"+search_result[i].name+"</li>");
                                }
                                $('.subsearch').animate({opacity: 1}, 400).show();
                            }else{
                                $('.subsearch').animate({opacity: 0}, 400).hide(400);
                            }
                        }
                    });
                } else {
                    if($(".subsearch").children().length > 0){
                        $('.subsearch').animate({opacity: 1}, 400).show();
                    }
                }
            }
        })

        $('input[type=search]').blur(function () {
            $('.subsearch').animate({opacity: 0}, 400).hide(400);
        })
    }


	r.init=function(){
		$(function(){

			// $('.toolbarfoot .toolbar-tab').mouseover(function(){
			// 	// console.log(1)
			// 	$(this).addClass('tab-hover').siblings().removeClass('tab-hover');
			// }).mouseleave(function(){ 
			//  // console.log(2)
			// 	$(this).removeClass('tab-hover');
			// });


			r.lazyloadimg();
			r.commonTop();
			r.commonRegion();
			r.cartTab();

			r.usercenter();
			r.recharge();

			r.slideBanner();
			if(_porder.length){
				r.order();
			}

            r.search();
		//gdialog_comf("你好你好你好你好你好你好你好你好你好你好你好你好好你好你好你好你好你好你好你好你好你好你好你好你好你好你好",460);

		//gdialog_info('testiadnkfadlfkamf',400)



			$('#arr').on('click',function(e){
				e.stopPropagation();
				$(this).parent().toggleClass('s_ani');
			})


		});
	};
	return r.init();
}()