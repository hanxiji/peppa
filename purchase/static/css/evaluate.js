$(function(){
    var i=0;
    $("input[name=commentStar]").val("5");
    // 立即评价  展开
    $(".fore3 a").click(function(){
      var slideDownFlag = !$(this).hasClass('expanded');
      var $expandedObj;
      $(".fore3 a").each(function(){
        if($(this).hasClass('expanded')){
          $expandedObj = $(this);
          $expandedObj.removeClass('expanded');
        }
      });
      if($expandedObj){
        $expandedObj.parents("ul").siblings(".comment-box").slideUp(500);
      }
      if(slideDownFlag){
        $(this).parents("ul").siblings(".comment-box").slideDown(500);
        $(this).addClass('expanded');
      } 
    
    });
    // 星星
    $(".star a").mouseover(function(){
      $(this).addClass("active");
      $(this).prevAll("a").addClass("active");
    });

    $(".star a").mouseout(function(){
      var $children = $(this).parent().children('a');
      var number = $(this).parents(".scoreEl").find("input[name=commentStar]").prop("value");
      
      $children.eq(number).removeClass("active");
      $children.eq(number).nextAll().removeClass("active");
    });

    $(".star a").click(function(){
      $(this).addClass("active");
      $(this).prevAll("a").addClass("active");
      $(this).nextAll("a").removeClass("active");

      var stars = $(this).parent().children('.active').size();
      $(this).parents(".scoreEl").find("input[name=commentStar]").attr("value",stars);
      // $(this).parent().attr('stars', stars);
       // console.log($(this).parent().attr('stars'));
    });
    //end star

    // 上传图片
    $(".upload-btn div a").on("click",function(e){
       e.preventDefault();
       if($(".pic-msg-promot").length){
          $(".pic-msg-promot").hide();
       }
       
       $(this).parent().siblings(".plupload").children('input[type=file]').trigger("click");
    });
    $(".plupload input").change(function(){
      var _li=$('<img class="up-pic prev" width="80" height="80"><div class="del hide"><em value="删除" onclick="delPic(this)">X</em></div>');
      var oUl=$(this).parents(".img-list-ul");
      var $parent = $(this).parents(".plupload").parent();

      //判断上传的图片个数
      if($(this).parents(".img-list-ul").children("li").length<6){
        var len=$(this).parents(".img-list-ul").children("li").length;
        oUl.append($parent.clone(true));//克隆追加
        $(this).parents(".img-list-ul").siblings("span").children("b").text(len);
        i++;
        $(this).attr("id","pic"+i);
      }else{
        $(this).parents(".img-list-ul").siblings("span").children("b").text(6);
        $(this).parents(".img-list-ul").siblings("span").hide();
        var num=$(this).parents(".upload-btn").prev().find("input").attr("id");
        $(this).attr("id","pic"+num);
      }
      $parent.append(_li);

      //预览
      var pic=$parent.find(".prev")[0];
      var file=$parent.find(".pluploadfile")[0];
      var ext=file.value.substring(file.value.lastIndexOf(".")+1).toLowerCase();
 
     // gif在IE浏览器暂时无法显示
     if(ext!='png'&&ext!='jpg'&&ext!='jpeg'){
         alert("图片的格式必须为png或者jpg或者jpeg格式！"); 
         return;
     }
     var isIE = navigator.userAgent.match(/MSIE/)!= null,
         isIE6 = navigator.userAgent.match(/MSIE 6.0/)!= null;
 
    if (file.files && file.files[0]) {
      var file = file.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(e){
          pic.src=this.result;
        }
    } else{
        file.select();
        file.blur();
        var reallocalpath = document.selection.createRange().text;
 
        // IE6浏览器设置img的src为本地路径可以直接显示图片
         if (isIE6) {

            pic.src = reallocalpath;
         }else {
            // 非IE6版本的IE由于安全问题直接设置img的src无法显示本地图片，但是可以通过滤镜来实现
            pic.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='scale',src=\"" + reallocalpath + "\")";
             // 设置img的src为base64编码的透明图片 取消显示浏览器默认图片
             pic.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';
         }
      }

    });
    
    //删除图片
    $(".img-list-ul li").mouseover(function() {
      $(this).children(".del").removeClass("hide");
    });
    $(".img-list-ul li").mouseout(function() {
      $(this).children(".del").addClass("hide");
    });
    $(".img-list-ul li em").click(function() {
      delPic(this);
    });

    
    //心得框
    $(".cont textarea").each(function() {

      var defaultValue=$(this).val();
      $(this).prop("defaultValue", defaultValue);
      // console.log(defaultValue);
      $(this).focus(function(event) {
        if($(this).val()==defaultValue){
          $(this).val("");
        }
        $(this).removeClass("hasError");
        $(this).siblings(".msg-promot").hide();
      });
      $(this).blur(function(event) {
        if($(this).val().trim().length==0){
          $(this).val(defaultValue);
        }
      });
    });
    

    //字数限制 
    $(".cont textarea").keyup(function(){
      var defaultValue=$(this).prop("defaultValue");
      //console.log(defaultValue);
      //console.log($(this).val());
      //console.log($(this).val().length);
      if($(this).val().length>500){
        $(this).val($(this).val().substring(0,500));
      }
    });

   
});
  function delPic(obj){
    var val=$(obj).parents(".img-list-ul").siblings("span").children("b").text();
    //console.log(val);
    $(obj).parents(".img-list-ul").siblings("span").children("b").text(--val);
    var oUl=$(obj).parents(".img-list-ul");
    var $parentBox=$(obj).parents(".upload-btn");
    $parentBox.remove();
    //console.log($parentBox);
    //console.log(oUl.children("li:last").find("img").attr("src"));
      if(oUl.children("li:last").find("img").attr("src")!=undefined){
        oUl.append(oUl.children("li:first").clone(true));
        oUl.children("li:last").find('.pluploadfile').val('');
        oUl.children("li:last").find('.pluploadfile').removeAttr("id");
        oUl.children("li:last").find('img').remove();
        oUl.children("li:last").find('div.del').remove();
        oUl.siblings('.ar').show();
      }
  }
  String.prototype.trim = function () {
    return this .replace(/^\s\s*/, '' ).replace(/\s\s*$/, '' );
  }