/**
 * Created by mrwaite on 16-5-2.
 */

function setCheckInfo (maxNum,inputNum,inputDec,text){
    var nextDom = inputDoc.next();
    var nextDomIdLi = (nextDom.prop("tagName") === "LI");
    var checkNum = /^[0-9]*$/g;
    var alertInfo = "";
    if(!checkNum.test(text)){
        inputDec.addClass("has-error").removeClass("has-success");
        if(nextDomIdLi) {
            alertInfo = "<div id='checkForm'><span class='checkInfo'>" + "请输入数字" + "</span></div>";
            inputDec.after($(alertInfo));
            return false;
        }
    }
    else if(inputNum > maxNum || inputNum < 0){
        inputDec.addClass("has-error").removeClass("has-success");
        if(nextDomIdLi) {
            alertInfo = "<div id='checkForm'><span class='checkInfo'>" + "请输入合理的分数，勿超过分数上限。" + "</span></div>";
            inputDec.after($(alertInfo));
            return false;
        }
        else{
            $("#checkForm span:eq(0)").html("请输入合理的分数，勿超过分数上限。");
            return false;
        }
    }
    else{
        inputDec.addClass("has-success").removeClass("has-error");
        if(nextDomIdLi){
            return true;
        }
        else{
            nextDom.hide();
            return true;
        }
    }
}


$(function() {
   $(".form-control").each(function(index){
      $(this).on("focus",function(){

      });
   });
});