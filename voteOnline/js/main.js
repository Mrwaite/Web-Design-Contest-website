/**
 * Created by mrwaite on 16-5-2.
 */

var teamName = "";


function setCheckInfo (maxNum,inputDec,text){

    var nextDom = inputDec.next();
    var checkNum = /^-?[0-9]*$/g;
    var alertInfo = "";
    if(text === ""){
        inputDec.addClass("has-error").removeClass("has-success");
        nextDom.addClass("checkForm");
        alertInfo = "<span class='checkInfo'>" + "不能为空" + "</span>";
        nextDom.html($(alertInfo));
        return false;
    }
    else if(!checkNum.test(text)){
        inputDec.addClass("has-error").removeClass("has-success");
        nextDom.addClass("checkForm");
        alertInfo = "<span class='checkInfo'>" + "请输入数字" + "</span>";
        nextDom.html($(alertInfo));
        return false;
    }
    else if(parseInt(text) > maxNum || parseInt(text) < 0){
        inputDec.addClass("has-error").removeClass("has-success");
        nextDom.addClass("checkForm");
        alertInfo = "<span class='checkInfo'>" + "请输入合理的分数，不能为负数，不能超过分数上限。" + "</span>";
        nextDom.html($(alertInfo));
        return false;
    }
    else{
        inputDec.addClass("has-success").removeClass("has-error");
        nextDom.html("");
        nextDom.removeClass("checkForm");
    }
}


$(function() {
    $.ajax({
       type : "get",
        url : "xxx.jsp",
        success : function(data){
            var Idata = JSON.parse(data);
            teamName = Idata["name"];
            var output = teamName + "团队（" + Idata["num"] + "/15)";
            $(".breadcrumb li.active").html(output);
            $(".panel-heading h3").html(output);
        }
    });
   $(".form-control").each(function(index){
      $(this).on("blur",function(){
            setCheckInfo($(".form-control").eq(index).parent().parent().find("label").find("span").html(),$(this).parent(),$(this).val());
      });
   });
    $("#btnSubmit").on("onclick",function(){
       if($(".checkForm") !== []){
           return false;
       }
       else{
            $.ajax({
                type: "post",
                url: "xxx.jsp",
                data: {
                    teamname : teamName,
                    theme : $(".form-control").eq(0).val(),
                    routine : $(".form-control").eq(1).val(),
                    senior : $(".form-control").eq(2).val(),
                    personal : $(".form-control").eq(3).val(),
                    originality : $(".form-control").eq(4).val()
                },
                success : function(){
                    location.reload();
                }
            })
       }
    });
});