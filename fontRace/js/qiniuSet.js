/*global Qiniu */
/*global plupload */
/*global FileProgress */
/*global hljs */
function qiniuSet(){
    var uploader = Qiniu.uploader({
        filters: {
          mime_types : [
            { title : "Zip files", extensions : "zip,rar,7z" }
          ]
        },
        multi_selection: false,
        runtimes: 'html5,flash,html4',
        browse_button: 'pickfiles',
        container: 'container',
        drop_element: 'container',
        max_file_size: '1000mb',
        flash_swf_url: 'bower_components/plupload/js/Moxie.swf',
        dragdrop: true,
        chunk_size: '4mb',
        uptoken_url: 'http://www.jaylanme.xyz/get!token?',
        domain: "https://portal.qiniu.com/bucket/jaylan",
        get_new_uptoken: true,
  
        auto_start: true,
        log_level: 5,
        init: {
            'FilesAdded': function(up, files) {
                
                    $('table').show();
                    $('#success').hide();
                    
                    plupload.each(files, function(file) {
                        var progress = new FileProgress(file, 'fsUploadProgress');
                        progress.setStatus("等待...");
                        progress.bindUploadCancel(up);
                    });
                
            },
            'BeforeUpload': function(up, file) {
                var progress = new FileProgress(file, 'fsUploadProgress');
                var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
                if (up.runtime === 'html5' && chunk_size) {
                    progress.setChunkProgess(chunk_size);
                }
            },
            'UploadProgress': function(up, file) {
                var progress = new FileProgress(file, 'fsUploadProgress');
                var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
                progress.setProgress(file.percent + "%", file.speed, chunk_size);
            },
            'UploadComplete': function() {
                $("#container").hide();
                $("#checkForm").css({'visibility' : 'visible' ,'background-color' : '#5cb85c', 'border-color' : '#4cae4c','color':'#fff'});
                $("#checkForm .checkInfo").text("请在此平台或者网协微信公众号上及时查询评审结果。");
                $.post("xxx.jsp", {'team_name': $(".form-control").val()});
            },
            'FileUploaded': function(up, file, info) {
                var progress = new FileProgress(file, 'fsUploadProgress');
                progress.setComplete(up, info);
            },
            'Error': function(up, err, errTip) {
                $('table').show();
                var progress = new FileProgress(err.file, 'fsUploadProgress');
                progress.setError();
                progress.setStatus(errTip);
            }
                // ,
                // 'Key': function(up, file) {
                //     var key = "";
                //     // do something with key
                //     return key
                // }
        }
    });

    uploader.bind('FileUploaded', function() {
        console.log('hello man,a file is uploaded');
    });
    $('#container').on(
        'dragenter',
        function(e) {
            e.preventDefault();
            $('#container').addClass('draging');
            e.stopPropagation();
        }
    ).on('drop', function(e) {
        e.preventDefault();
        $('#container').removeClass('draging');
        e.stopPropagation();
    }).on('dragleave', function(e) {
        e.preventDefault();
        $('#container').removeClass('draging');
        e.stopPropagation();
    }).on('dragover', function(e) {
        e.preventDefault();
        $('#container').addClass('draging');
        e.stopPropagation();
    });



    $('#show_code').on('click', function() {
        $('#myModal-code').modal();
        $('pre code').each(function(i, e) {
            hljs.highlightBlock(e);
        });
    });


    $('body').on('click', 'table button.btn', function() {
        $(this).parents('tr').next().toggle();
    });


    var getRotate = function(url) {
        if (!url) {
            return 0;
        }
        var arr = url.split('/');
        for (var i = 0, len = arr.length; i < len; i++) {
            if (arr[i] === 'rotate') {
                return parseInt(arr[i + 1], 10);
            }
        }
        return 0;
    };

    $('#myModal-img .modal-body-footer').find('a').on('click', function() {
        var img = $('#myModal-img').find('.modal-body img');
        var key = img.data('key');
        var oldUrl = img.attr('src');
        var originHeight = parseInt(img.data('h'), 10);
        var fopArr = [];
        var rotate = getRotate(oldUrl);
        if (!$(this).hasClass('no-disable-click')) {
            $(this).addClass('disabled').siblings().removeClass('disabled');
            if ($(this).data('imagemogr') !== 'no-rotate') {
                fopArr.push({
                    'fop': 'imageMogr2',
                    'auto-orient': true,
                    'strip': true,
                    'rotate': rotate,
                    'format': 'png'
                });
            }
        } else {
            $(this).siblings().removeClass('disabled');
            var imageMogr = $(this).data('imagemogr');
            if (imageMogr === 'left') {
                rotate = rotate - 90 < 0 ? rotate + 270 : rotate - 90;
            } else if (imageMogr === 'right') {
                rotate = rotate + 90 > 360 ? rotate - 270 : rotate + 90;
            }
            fopArr.push({
                'fop': 'imageMogr2',
                'auto-orient': true,
                'strip': true,
                'rotate': rotate,
                'format': 'png'
            });
        }

        $('#myModal-img .modal-body-footer').find('a.disabled').each(function() {

            var watermark = $(this).data('watermark');
            var imageView = $(this).data('imageview');
            var imageMogr = $(this).data('imagemogr');

            if (watermark) {
                fopArr.push({
                    fop: 'watermark',
                    mode: 1,
                    image: 'http://www.b1.qiniudn.com/images/logo-2.png',
                    dissolve: 100,
                    gravity: watermark,
                    dx: 100,
                    dy: 100
                });
            }

            if (imageView) {
                var height;
                switch (imageView) {
                    case 'large':
                        height = originHeight;
                        break;
                    case 'middle':
                        height = originHeight * 0.5;
                        break;
                    case 'small':
                        height = originHeight * 0.1;
                        break;
                    default:
                        height = originHeight;
                        break;
                }
                fopArr.push({
                    fop: 'imageView2',
                    mode: 3,
                    h: parseInt(height, 10),
                    q: 100,
                    format: 'png'
                });
            }

            if (imageMogr === 'no-rotate') {
                fopArr.push({
                    'fop': 'imageMogr2',
                    'auto-orient': true,
                    'strip': true,
                    'rotate': 0,
                    'format': 'png'
                });
            }
        });

        var newUrl = Qiniu.pipeline(fopArr, key);

        var newImg = new Image();
        img.attr('src', 'images/loading.gif');
        newImg.onload = function() {
            img.attr('src', newUrl);
            img.parent('a').attr('href', newUrl);
        };
        newImg.src = newUrl;
        return false;
    });

    }

 var checkFormText = [
        "请填写团队名称。",
        "抱歉，此队伍未报名。",//0
        "拖拽初赛压缩文件，提交初赛作品。",//1
        "初赛作品已提交。请在5月5日之后在此平台或者网协微信公众号上及时查询评审结果。",//2
        "初赛作品未提交，提交时间已截至。",//21
        "已过初审，拖拽决赛压缩文件，提交决赛作品。",//3
        "未过初审。加油骚年！",//31
        "决赛作品已提交。请在5月14日准时参加决赛现场。",//4
        "决赛作品未提交，提交时间已截至。"//41
    ]

function setProgress(color,item){
    var progress = '<div class="progress-bar progress-bar-' + color +' progress-bar-striped" style="width: 25%">' + item + '</div>'
    $(progress).appendTo($('#show_status'));
}

function setCheckForm(text,color){
    if(arguments.length !== 0){
        if(color !== "green"){
            $("#checkForm").css({'visibility' : 'visible' ,'background-color' : '#f2dede', 'border-color' : '#ebccd1','color':'#a94442'});
            $("#checkForm .checkInfo").text(text);
        }
        else{
            $("#checkForm").css({'visibility' : 'visible' ,'background-color' : '#5cb85c', 'border-color' : '#4cae4c','color':'#fff'});
            $("#checkForm .checkInfo").text(text);
        }
    }
    else{
        $("#checkForm").css("visibility","hidden");
        $("#checkForm .checkInfo").text("提示区");
    }
}



$(function() {
 /*       var allowUpLoad = false;
        $(".form-control").on("blur",function(){
            $.ajax({
                tyep: "get",
                url: "1.json",
                success: function(data){
                    var pa = JSON.parse(data);
                    if(pa === "1"){
                        allowUpLoad = false;
                        $("#checkForm").css("visibility","visible");
                        $("#checkForm .checkInfo").text("已报名队伍中没有此队伍");
                    }
                    else if(pa === "2"){
                        allowUpLoad = false;
                        $("#checkForm").css("visibility","visible");
                        $("#checkForm .checkInfo").text("已经提交过作品");
                        //之后就是呈现进度条到已提交作品
                    }
                    else{
                        allowUpLoad = true;
                    }
                }
            })
        });*/
   

	

    /*提交作品查询进度按钮
    0：没有此队伍
    1：报名成功
    2：初赛作品提交
    21：初赛作品未提交
    3：初审过
    31：初审未过
    4：决赛作品提交
    41：决赛作品未提交
    初审的日期改1为21，2改为3或者31，决赛前一天3改为41
    */
  /* var checkFormText = [
        "请填写团队名称。",
        "抱歉，此队伍未报名。",//0
        "拖拽初赛压缩文件，提交初赛作品。",//1
        "初赛作品已提交。请在5月5日之后在此平台或者网协微信公众号上及时查询评审结果。",//2
        "初赛作品未提交，提交时间已截至。",//21
        "已过初审，拖拽决赛压缩文件，提交决赛作品。",//3
        "未过初审。加油骚年！",//31
        "决赛作品已提交。请在5月14日准时参加决赛现场。",//4
        "决赛作品未提交，提交时间已截至。"//41
    ];*/
    $("#btn").on("click",function(){
        if($(".form-control").val() === ""){
                setCheckForm(checkFormText[0],"red");
                }
        else{ //else if(allowUpLoad === true)
                setCheckForm();
                $.ajax({
                    type: "get",
                    url: "xxx.jsp?team_name" + $(".form-control").val(),
                    success : function(data){
                        var pa_progress = JSON.parse(data);
                        if(pa_progress === "0"){
                            setCheckForm(checkFormText[1],"red");
                        }
                        else if(pa_progress === "1"){
                            setCheckForm(checkFormText[2],"green");
                            $(".form-control").attr("disabled","disabled");
                            $("#progress_form").hiden();
                            $("#container").show();
                            qiniuSet();
                            setProgress("success","报名成功");
                        }
                        else if(pa_progress === "2"){
                            setCheckForm(checkFormText[3],"green");
                            setProgress("success","初赛作品已提交");
                        }
                        else if(pa_progress === "21"){
                            setCheckForm(checkFormText[4],"red");
                            setProgress("warning","初赛作品未提交");
                        }
                        else if(pa_progress === "3"){
                            setCheckForm(checkFormText[5],"green");
                            $(".form-control").attr("disabled","disabled");
                            $("#progress_form").hiden();
                            $("#container").show();
                            qiniuSet();
                            setProgress("success","初审过");
                        }
                        else if(ppa_progress === "31"){
                            setCheckForm(checkFormText[6],"red");
                            setProgress("warning","初审未过");
                        }
                        else if(ppa_progress === "4"){
                            setCheckForm(checkFormText[7],"green");
                            setProgress("success","决赛作品已提交");
                        }
                        else if(ppa_progress === "41"){
                            setCheckForm(checkFormText[8],"red");
                            setProgress("warning","决赛作品未提交");
                        }
                    }
                });
            }
                
    });

});
