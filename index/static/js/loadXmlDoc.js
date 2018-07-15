//利用ajax同步加载服务器上的文件，返回一个XML的document对象
function loadXMLDoc(dname) {
    var xmlhttp;
    if(window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {
        // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");

    }
    // xmlhttp.load("area.xml");
    xmlhttp.open("GET", dname, false);
    xmlhttp.send();
    var xmlDoc = xmlhttp.responseXML;
    print(xmlhttp)
    return xmlDoc;
}
