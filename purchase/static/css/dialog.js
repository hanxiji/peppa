/**
 * Created by RoseTong on 15/10/26.
 */


function gdialog_info(data,code){
    var dia='<div class="dialog-mask"></div>' +
            '<div class="dialog dialog_posi" style="width:360px; margin-left:-180px;">' +
            '<h5 class="dialog-til">信息提示<span class="close"><img src="images/common/cha.png" alt="" /></span></h5>' +
            '<div class="dialog-con" style="min-height:80px; padding-top:30px;"><p class="clearfix">' +
            '<span class="icon-g-'+(code==400?'error':'info')+'"></span>' +
            '<span class="tips pull-left">'+data+'</span>' +
            '</p></div></div>';
    $('body').prepend("<div id='gdialog'></div>");
    $('#gdialog').append(dia).addClass('dialog-open').delay(300).show();
    $('#gdialog').find('span.close').on('click',function(){
    $('#gdialog').removeClass().addClass('dialog-close').delay(300).hide(200,function(){
            $(this).remove();
        })
   });
};

function gdialog_comf(message, width , id){
    var dia='<div class="dialog-mask"></div>' +
                '<div class="dialog" style="width:'+(width?width:520)+'px; margin-left:-'+(width?width/2:260)+'px;">' +
                '<h5 class="dialog-til"><span class="pull-right iconfont">&#xe60e;</span>信息提示</h5>' +
                '<div class="dialog-con" style="min-height:80px; padding-top:30px;">' +
                '<p style="margin-bottom:20px;">'+message+'</p> ' +
                '<div class="formitem clearfix" style="text-align:center;"> ' +
                     '<button type="button" class="btn btn-success" id="diaSubmit" style="margin-left:0">确 定</button> ' +
                     '<button type="button" class="btn btn-default" id="diaCancel" style="margin-left:0;">取 消</button>' +
                '</div></div></div>';
    $('body').prepend("<div id='gdialog'></div>");
    $('#gdialog').append(dia).addClass('dialog-open');
    $('.dialog-til>span, #diaCancel').on('click', function(){
                $('#gdialog').removeClass().addClass('dialog-close').delay(200).fadeOut(100,function(){
                    $(this).remove();
                });
            });
	$('.btn-success').on('click', function(){
         do_confirm( id );
		 $('#gdialog').removeClass().addClass('dialog-close').delay(200).fadeOut(100,function(){
			$(this).remove();
		 });
    });
}

function gdialog_comf_redirect(message, href ,width){
    var dia='<div class="dialog-mask"></div>' +
        '<div class="dialog" style="width:'+(width?width:520)+'px; margin-left:-'+(width?width/2:260)+'px;">' +
        '<h5 class="dialog-til"><span class="pull-right iconfont">&#xe60e;</span>信息提示</h5>' +
        '<div class="dialog-con" style="min-height:80px; padding-top:30px;">' +
        '<p style="margin-bottom:20px;">'+message+'</p> ' +
        '<div class="formitem clearfix" style="text-align:center;"> ' +
        '<button type="button" class="btn btn-success" id="diaSubmit" style="margin-left:0">确 定</button> ' +
        '<button type="button" class="btn btn-default" id="diaCancel" style="margin-left:0;">取 消</button>' +
        '</div></div></div>';
    $('body').prepend("<div id='gdialog'></div>");
    $('#gdialog').append(dia).addClass('dialog-open');
    $('.dialog-til>span, #diaCancel').on('click', function(){
        $('#gdialog').removeClass().addClass('dialog-close').delay(200).fadeOut(100,function(){
            $(this).remove();
        });
    });
    $('.btn-success').on('click', function(){
        if(href == null){
            location.reload();
        } else {
            window.location.href = href;
        }
        $('#gdialog').removeClass().addClass('dialog-close').delay(200).fadeOut(100,function(){
            $(this).remove();
        });
    });
}

function gdialog_info_redirect(data,href,code){
    var dia='<div class="dialog-mask"></div>' +
        '<div class="dialog dialog_posi" style="width:360px; margin-left:-180px;">' +
        '<h5 class="dialog-til">信息提示<span class="close"><img src="images/common/cha.png" alt="" /></span></h5>' +
        '<div class="dialog-con" style="min-height:80px; padding-top:30px;"><p class="clearfix">' +
        '<span class="icon-g-'+(code==400?'error':'info')+'"></span>' +
        '<span class="tips pull-left">'+data+'</span>' +
        '</p></div></div>';
    $('body').prepend("<div id='gdialog'></div>");
    $('#gdialog').append(dia).addClass('dialog-open').delay(300).show();
    $('#gdialog').find('span.close').on('click',function(){
        $('#gdialog').removeClass().addClass('dialog-close').delay(300).hide(200,function(){
            $(this).remove();
            if(href == null){
                location.reload();
            } else {
                window.location.href = href;
            }
        })
    });
};