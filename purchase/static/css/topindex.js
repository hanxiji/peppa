/**
 * Created by chenzhicheng on 16/1/26.
 */
var have_bigImg = $('.bigImg').length;
var have_smallImg = $('.smallImg').length;
var type = "";
if((have_bigImg == 1) && (have_smallImg == 0) ){
    type = 1;
}
if((have_bigImg == 0) && (have_smallImg == 1) ){
    type = 2;
}
if((have_bigImg > 0) && (have_smallImg > 0) ){
    type = 3;
}
//type状态 后台同志提供
switch(type){
    case 1:
        // 1，只有一张大图 就显示一张大图
        break;
    case 2:
        // 2，只有一张小图 就是显示一张小图
        break;
    case 3:
        // 3，大小图同时出现，3秒钟之后 大图渐渐消失，小图出来并一直在顶部显示了
    {
        setTimeout(function(){
            $('#bI').fadeOut('800',function(){

                $('#sI').fadeIn(300);
            })

        },3000);
    }
        break;
}

//ie 侧边导航条兼容
var a=document.getElementById('tooft');
var kf=document.getElementById('kf');

if(a != undefined && kf!=undefined && a.style != null && kf.style != null)
{
    //ie11
    var u =window.navigator.userAgent.toLocaleLowerCase(),
        ie11 = /(trident)\/([\d.]+)/,
        b = u.match(ie11);
       
    if(b){
        a.style.right="16px";
        kf.style.right='16px';
    }
    else{
        a.style.right="0";
        kf.style.right="0";
    }
    // ie10
    if (window.ActiveXObject) {
       reg = /10\.0/,
        str = navigator.userAgent;
       if(reg.test(str)){
          a.style.right="16px";
          kf.style.right='16px';
       }
        else{
        a.style.right="0";
        kf.style.right="0";
    }
};
}

