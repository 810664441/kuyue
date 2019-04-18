(function () {
    var c_obj = (function () {
        // 处理鼠标悬浮事件 悬停出现  离开隐藏  obj:对象  index:要显示所在相对的下标
        function handleHover(obj) {
            obj.hover(
                function () {
                    $(this).children().eq(1).show();
                },
                function () {
                    $(this).children().eq(1).hide();
                }
            )
        }

        //搜索请求
        function search(obj){
            var liIndex = -1; //记录内容下标变化
            obj.focus(function(){
                $(this).next().show();
            })
            obj.blur(function(){
                $(this).next().hide();
            })
            obj.keyup(function(e){
                // console.log($(this).val())
                var e = e || event;
                var _this = $(this).next();
                var termVal = $(this).val();
                if(e.which!==40&&e.which!==38){
                    _this.html("");
                    $.ajax({
                        type: "get",
                        url: "https://www.ingping.com/search/solrCheck?",
                        data: {
                            term:termVal
                        },
                        // data: $(".reg").serialize(),
                        dataType: 'jsonp',
                        success:function(data){
                            var liStr="";
                            for(var i=0;i<data.length;i++){
                                liStr+="<li>"+data[i]+"</li>";
                            }
                            _this.append(liStr);
                        },
                        error:function(){
                            console.log("提交失败");
                        }
                    })
                }
            })
            //请求内容上下选择
            obj.keydown(function(e){
                var e = e || event;
                var liB = $(this).next().children();
                var len = $(this).next().children().length;
                if(e.which == 40){
                    if(liIndex == len-1){
                        liIndex = -1;
                    }
                    liIndex++;
                    liB.eq(liIndex).css({backgroundColor: '#ff6600'}).siblings().css({backgroundColor: 'white'});
                    $(this).val(lib.eq(liIndex).html());
                }    
                if(e.which == 38){
                    if(liIndex <= 0){
                        liIndex = len;
                    }
                    liIndex--;
                    liB.eq(liIndex).css({backgroundColor: '#ff6600'}).siblings().css({backgroundColor: 'white'});
                    $(this).val(lib.eq(liIndex).html());
                }  
                if(e.which==13){      
                    $(this).next().hide();
                       searchIndex=-1;
                    }   
            })
        }

        // 处理多条鼠标悬浮事件 悬停出现 变色 离开隐藏  obj:对象
        function moreHover(obj, kind) { /* left-list */
            // obj.children().each(function(){
            //     $(this).hover(
            //          function () {

            obj.children().hover(
                function () {
                    var that = this;
                    // $(that).children().eq(1).children().eq(0).html( "" );
                    $(this).children().eq(1).show();
                    $(this).children().eq(0).addClass(kind);
                    $(this).addClass(kind);
                    if ($(this).data("flag")) {
                        return
                    } else {
                        $(this).data("flag", true);
                        $.ajax({
                            type: "post",
                            url: "../api/index-api/listgoods.php",
                            data: {
                                index: $(this).index()
                            },
                            dataType: 'json',
                            success: function (result) {
                                // console.log(result)
                                // var leftB = $("<ul>");
                                // leftB.addClass("hide-left");
                                $.each(result, function (i, val) {
                                    // console.log(result[i].length);

                                    var len = val.length;
                                    if (i !== 'imgs') {
                                        var listLi = $("<li>");
                                        listLi.addClass("hide-list");

                                        var pL = $("<p>");
                                        pL.html(i);

                                        var ulL = $("<ul>");
                                        ulL.addClass("clearfix");

                                        var strHtml = "";

                                        for (var j = 0; j < len; j++) {
                                            // console.log(result[i])
                                            // console.log(i)
                                            // console.log("<li><a href=\"\">" +result[i][j]+ "</a>&nbsp;&nbsp;/&nbsp;&nbsp;</li>")
                                            strHtml += '<li><a href="goodsList.html">' + val[j] + '</a>&nbsp;&nbsp;/&nbsp;&nbsp;</li>';
                                            // ulB.append("<li><a href=\"\">" +result[i][j]+ "</a>&nbsp;&nbsp;/&nbsp;&nbsp;</li>");
                                        }

                                        ulL.html(strHtml);

                                        listLi.append(pL);
                                        listLi.append(ulL);
                                        $(that).children().eq(1).children().eq(0).append(listLi);
                                        // leftB.append(listB);
                                    } else {
                                        var ulR = $("<ul>");
                                        ulR.addClass("clearfix");
                                        var liHtml = "";
                                        for (var k = 0; k < len; k++) {
                                            liHtml += '<li><a href="#"><img src="./images/index/' + val[k] + '" alt="提示文字"></a></li>';

                                        }
                                        // console.log( liHtml );
                                        ulR.html(liHtml);
                                        // console.log( ulR );
                                        $(that).children().eq(1).children().eq(1).children().eq(1).append(ulR);
                                        // $(that).children().eq(1).find(".hide-bottom").append( ulR );
                                    }
                                });

                            }
                        });
                    }

                },
                function () {
                    $(this).children().eq(1).hide();
                    $(this).children().eq(0).removeClass(kind);
                    $(this).parent().children().removeClass(kind);
                }
            );
            // })
        }

        // 添加颜色  obj:对象  arr:颜色数组rgb格式的
        function addcolor(obj, arr) {
            obj.children().each(function (i) {
                $(this).css({
                    backgroundColor: "rgb" + arr[i]
                });
            })
        }

        //top切换 obj:对象  kind:加的类名设置样式  list:yao
        function handleEntrance(obj, list, kind) {
            obj.children().each(function () {
                // $(this).parent().parent().next().children().hide();
                // $(this).parent().parent().next().children().eq(0).show();
                // var i = $(this).index();
                var flag = true;
                $(this).mouseenter(function () {

                    $(this).parent().children().removeClass(kind);
                    $(this).addClass(kind);
                    // console.log($(this).html())
                    // list.children().eq(i).show().siblings().hide();
                    if (flag) {
                        flag = false;
                        $.ajax({
                            type: "post",
                            url: "../api/section3.php",
                            // data:$(this).html(),
                            data: {
                                val: $(this).html()
                            },
                            dataType: "json",
                            success: function (result) {
                                // console.log($(result[0]['brief']));
                                var len = result.length,
                                    ulB = $("<ul>");
                                ulB.addClass("list-box");
                                // console.log(len);
                                list.html("");
                                for (var i = 0; i < len; i++) {
                                    var liB = $("<li>"),
                                        aB = $("<a>"),
                                        divB = $("<div>");
                                    divB.addClass("top1");
                                    $(divB).append("<p class=\"p1\">" + result[i]['brief'] + "</p>");
                                    $(divB).append("<p class=\"p2\">￥" + result[i]['price'] + "</p>");
                                    $(divB).append("<img src=../images/img5/" + result[i]['img'] + ".jpg alt=\"\" >");
                                    aB.append(divB);
                                    liB.append(aB);
                                    ulB.append(liB);
                                }
                                list.html(ulB)
                                flag = true;
                                // console.log(len);
                            },
                            error: function () {
                                console.log("出错");
                            }
                        })
                    }

                })
            })
        }

        //轮播图事件
        function banner(obj, shangBtn, xiaBtn) {
            obj.children().eq(0).clone("true").appendTo(obj);
            var imgH = obj.children().eq(0).innerHeight(),
                len = obj.children().length;
            imgX = 0;
            // 下箭头事件
            xiaBtn.click(function () {
                xia();
                // css({marginTop:-topVal})
            })

            function xia() {
                imgX++;
                if (imgX == len) {
                    // console.log(len*imgH)
                    imgX = 1;
                    obj.css({
                        marginTop: 0
                    })
                }
                obj.stop(true, true).animate({
                    marginTop: -imgX * imgH
                });
            }
            // 上箭头事件
            shangBtn.click(function () {

                if (imgX == 0) {
                    // console.log(len*imgH)
                    imgX = len - 1;
                    obj.css({
                        marginTop: -(len - 1) * imgH
                    })
                }
                imgX--;
                obj.stop(true, true).animate({
                    marginTop: -imgX * imgH
                });
                // css({marginTop:-topVal})
            })
            // 悬浮停止轮播
            obj.parent().hover(
                function () {
                    if (tim) {
                        clearInterval(tim);
                    }
                },
                function () {
                    tim = setInterval(xia, 2000);
                }
            )
            // 自动轮播
            var tim = setInterval(xia, 2000);
        }
        //导航出现效果
        function handleStairs(obj, stairs) {
            var offsetT = obj.offset().top,
                windowT = $(window).scrollTop();
            $(window).scroll(function () {
                stairsIn();
            })

            function stairsIn() {
                windowT = $(window).scrollTop();
                if (windowT - offsetT > 20 || offsetT < windowT) {
                    // console.log(windowT)
                    stairs.fadeIn("fast");
                } else {
                    stairs.fadeOut("fast");
                }
            };
            stairsIn();


        }
        //图片懒加载
        function lazyLoad() {
            $("img").each(function( index, ojb ){
                var srcUrl = $(this).attr("src");
                $(this).data("original", srcUrl);
                $(this).attr("src", "images/img5/201204021453490257722.gif");
            })
            load();
            $(window).scroll(function(){
                load();
            })
            function load(){
                var windowH = $(window).height(),
                    scrollH = $(window).scrollTop(),
                    len = $("img").length;
                for(var i = 0; i < len; i++){
                    var offsetT = $("img").eq(i).offset().top;
                    if( offsetT - (windowH + scrollH) < 1){
                        var url = $( $("img")[i] ).data("original");
                        $( $("img")[i] ).attr("src", url);
                    }
                }
            }
        }
        //判断登录状态
        function logVerify(){
            var longL = document.querySelector(".left-login")
            var wincomeL = document.querySelector(".left-wincome")
            var cookieSti = document.cookie;
            var cookieArr = cookieSti.split("; ");
            for(var i = 0;i < cookieArr.length;i++){
                var arr = cookieArr[i].split("=");
                if(arr[0] == "user"){
                    var ressult = arr[1]
                    longL.parentNode.removeChild(longL);
                    wincomeL.innerHTML = '您好！'+ ressult +' 欢迎登陆！';
                    break;
                }else{
                    ressult = null;
                }
            }
        }
        return {
            handleHover: handleHover,
            addcolor: addcolor,
            handleEntrance: handleEntrance,
            moreHover: moreHover,
            banner: banner,
            handleStairs: handleStairs,
            search:search,
            lazyLoad:lazyLoad,
            logVerify:logVerify
        }
    })();

    //全部商品    处理鼠标悬浮事件
    c_obj.handleHover($(".header .bottom .left"));
    //全部商品分类调用    鼠标悬浮事件 添加类名改变样式
    c_obj.moreHover($(".header .bottom .left-list"), "addBg");
    //手机直播和相关设备调用    添加颜色
    c_obj.addcolor($(".content .phone .btn-box"), ["(51,204,255)", "(102,204,0)",
        "(255,102,153)", "(255,153,0)", "(0,204,204)"
    ]);
    //调用top切换
    c_obj.handleEntrance($(".content .phone .btn-box"), $(".content .phone .phone-list"), "addCl");
    //轮播图事件调用
    c_obj.banner($(".banner-left"), $(".banner .banner-shang"), $(".banner .banner-xia"));
    //导航出现调用
    c_obj.handleStairs($(".content"), $(".stairs"));
    //搜索栏调用
    c_obj.search($(".center .search-left"));
    //图片懒加载调用
    c_obj.lazyLoad();
    //判断登录状态
    c_obj.logVerify();
})();