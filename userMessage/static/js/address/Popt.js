Array.prototype.unique = function () {//去数组重复
    return this.sort().join(",,").replace(/(,|^)([^,]+)(,,\2)+(,|$)/g, "$1$2$4").replace(/,,+/g, ",").replace(/,$/, "").split(",");
}
var Iput = {
    confg: {
        hand: "0", //0对像位置1鼠标位置divID滚动位置
        idIframe: "PoPx", //默认可不用改
        idBox: "PoPy", //默认可不用改
        content: "", //传过来的内容
        ok: null, //弹出框之后执行的函数
        id: null, //不能为空一般传this对像而不是对像ID
        event: window.event, //这个必写一般为e就可以了
        top: 0, //顶部偏移位置
        left: 0, //左部偏移位置
        bodyHeight: 0, //在被position:absolute元素下得到HTML真实高度
        bodyWidth: 0,
        width: 0,
        soll: null,
        pop: null //指定ID点击时不关闭
    },
    get: function (obj) { return document.getElementById(obj); },
    clear: function () {
        Iput.confg.hand = "0"; Iput.confg.ok = null; Iput.confg.top = 0; Iput.confg.left = 0; Iput.confg.bodyHeight = 0; Iput.confg.bodyWidth = 0; Iput.confg.width = 0; Iput.confg.pop = null;
    },
    stopBubble: function (e) {
        if (e && e.stopPropagation) {
            e.stopPropagation();    //w3c
        } else {
            window.event.cancelBubble = true; //IE
        }
    },
    pop: function () {
        var $a = document.getElementsByTagName("body").item(0);
        var $c = document.createElement("iframe");
        var $b = document.createElement("div");
        $c.setAttribute('id', Iput.confg.idIframe);
        $c.setAttribute("src", "about:blank");
        $c.style.zindex = '100';
        $c.frameBorder = "0";
        $c.style.width = "0px";
        $c.style.height = "0px";
        $c.style.position = 'absolute';
        $b.setAttribute('id', Iput.confg.idBox);
        $b.setAttribute('align', 'left');
        $b.style.position = 'absolute';
        $b.style.background = 'transparent';
        $b.style.zIndex = '20000';
        if ($a) {
            if (Iput.get(Iput.confg.idIframe)) {
                Iput.colse();
            }
            $a.appendChild($c);
            if ($c) {
                $c.ownerDocument.body.appendChild($b);
            }
            Iput.get(Iput.confg.idBox).innerHTML = Iput.confg.content;
            Iput.drice(Iput.confg.event);
        }

        if (!document.all) {
            window.document.addEventListener("click", Iput.hide, false);
        }
        else {
            window.document.attachEvent("onclick", Iput.hide);
        }
    },
    drice: function (e) {
        if (!e) e = window.event;
        var a = Iput.get(Iput.confg.idBox);
        var b = Iput.get(Iput.confg.idIframe);
        var c = "60%";
        var w = "100%";
        if (Iput.get(Iput.confg.idIframe)) {
            if (Iput.confg.hand == "1") {
                b.style.top = 0 + "px";
                a.style.left = 0 + "px";
                a.style.bottom = 0 + "px";
                b.style.left = 0 + "px";
            }
            else if (Iput.confg.hand == "0") {
                w = "100%";
                a.style.width = w;
                b.style.width = w;
                a.style.height = c;
                b.style.top = 0 + "px";
                b.style.left = 0 + "px";
                a.style.left = 0 + "px";
                a.style.bottom = 0 + "px";
            }
            else {
                a.style.height = c;
                b.style.top = 0 + "px";
                b.style.left = 0 + "px";
                a.style.left = 0 + "px";
                a.style.bottom = 0 + "px";
            }
        }
    },
    show: function () {
        var config = arguments[0]; var that = Iput.confg;
        Iput.clear();
        for (var i in that) { if (config[i] != undefined) { that[i] = config[i]; } };
        Iput.pop();
        if (Iput.confg.ok != null) {
            Iput.action(Iput.confg.ok());
        }
    },
    colse: function () {
        if (Iput.get(Iput.confg.idIframe)) {
            document.body.removeChild(Iput.get(Iput.confg.idBox));
            document.body.removeChild(Iput.get(Iput.confg.idIframe));
        }
        if (Iput.get(Iput.confg.pop)) {
            Iput.get(Iput.confg.pop).style.display = "none";
        }
    },
    hide: function (e) {//点击任何处关闭层
        e = window.event || e;
        var srcElement = e.srcElement || e.target;
        if (Iput.confg.event == undefined) {//输入时用,般在没传入Iput.confg.event请况下使用
            Iput.colse();
        }
        else {
            var a = Iput.confg.event.srcElement || Iput.confg.event.target;
            var b = Iput.get(Iput.confg.pop);
            console.log(a);
            console.log(srcElement);
            if (a != srcElement) { Iput.colse(); }
            if (b != null) {
                if (b != srcElement && a != srcElement) { Iput.colse(); }
            }
        }
        if (Iput.get(Iput.confg.idIframe)) {
            Iput.get(Iput.confg.idIframe).onclick = function (e) { Iput.stopBubble(e); };
            Iput.get(Iput.confg.idBox).onclick = function (e) { Iput.stopBubble(e); };
        }
        if (Iput.get(Iput.confg.pop)) {
            Iput.get(Iput.confg.pop).onclick = function (e) { Iput.stopBubble(e); };
        }

    },
    action: function (obj) {
        eval(obj);
    },
    contains: function (star, end, isIgnoreCase) {
        if (isIgnoreCase) {
            star = star.toLowerCase();
            end = end.toLowerCase();
        }
        var startChar = end.substring(0, 1);
        var strLen = end.length;
        for (var j = 0; j < star.length - strLen + 1; j++) {
            if (star.charAt(j) == startChar)//如果匹配起始字符,开始查找
            {
                if (star.substring(j, j + strLen) == end)//如果从j开始的字符与str匹配，那ok
                {
                    return true;
                }
            }
        }
        return false;
    }
}
