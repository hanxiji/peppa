//配置页面加载模块参数
require.config({
	paths: {
		"jquery"		:['lib/jquery-1.11.0.min','lib/jquery-2.1.1.min'],
		//"zepto"			: 'lib/zepto/zepto',
		"bootstrap"		:['lib/bootstrap.min'],
		"sly"     		:'lib/sly.min',
		"lazyload"      :['lib/jquery.lazyload.min'],
		"dialog"        :'lib/dialog',
		"rose"          :'rose',
		"back"          :'lib/back',
        "base64"        :['lib/jquery.base64'],
        "evaluate"      :'evaluate',
        "ajax"          :'lib/ajax',
        "index"         :'lib/index',
        "topindex"      :'lib/topindex'
	},
	shim: {//模块依赖关系
		jquery			: {exports: '$'},
        'lazyload' : {deps: ['jquery']},        
        'bootstrap' : {deps: ['jquery']},
        'sly' : {deps: ['jquery']},
        'dialog' : {deps: ['jquery']},
        'rose' : {deps: ['bootstrap', 'lazyload', 'sly', 'jquery']},
        'back' : {deps: ['jquery']},
        'base64' : {deps: ['jquery']},
        'evaluate' : {deps: ['jquery']},
        'ajax' : {deps: ['jquery']},
        'index' : {deps: ['jquery']},
        'topindex' : {deps: ['jquery']}
	}
});

var commonJs = ['dialog','rose',"back","base64","evaluate","ajax","topindex"];
var urlPath = window.location.pathname;
urlPath = urlPath.replace(/\/$/,"");
urlPath = urlPath.split("\/",3).join("\/");

switch(urlPath){
    case '':
        commonJs.push('index');
        break;
}

require(commonJs);