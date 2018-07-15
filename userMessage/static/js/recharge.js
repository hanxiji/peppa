function recharge(){
    var moneylast;
    var moneyadd = null;
    var moneyall;

    moneylast = document.getElementById('balance').value;
    moneyadd = prompt("请输入需要充值的金额");


    if (moneyadd.length == 0){
        alert("金额不能为空");
    }
    else if (isNaN(parseFloat(moneyadd))){
        alert("充值只能是数字");
    }
    else if(parseFloat(moneyadd)<0||parseFloat(moneyadd)>10000){
        alert("请输入正确的金额");
    }
    else{
        moneyall = parseFloat(moneyadd) + parseFloat(moneylast);
        document.getElementById('balance').value = moneyall;
    }         

};
function isPhone(){
    var phoneNumber;

    phoneNumber = document.getElementById('phone').value;
    if (phoneNumber.length != 11) {
        alert("请输入正确的手机号");
        return flase;
    }
}