var oOpenBtn = document.querySelector(".app-link"),
    oCloseBtn = document.querySelector(".btn-close"),
    oTopBar = document.querySelector(".top-bar");
function fOpenApp(){
    var iosAppLink = 'quicknews://sohu.com/sharenews';
    var androidAppLink = 'quicknews://sohu.com/sharenews';
    var tcDownloadLink = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.sohu.quicknews';
    var iosDownloadLink = 'https://itunes.apple.com/cn/app/song-shu-fa-xian-sheng-huo/id1183147714?mt=8';
    var ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) {
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
            window.location.href = tcDownloadLink;
        } else if (ua.match(/WeiBo/i) == "weibo") {
            $("body").append("<div class='ios show layer'></div>");
        } else if (ua.match(/QQ/i) == "qq") {
            window.location.href = tcDownloadLink;
        } else if (ua.indexOf("safari") > -1) {
            window.location.href = iosAppLink;
            window.setTimeout(function () {
                window.location.href = iosDownloadLink;
            }, 1000);
        } else {
            window.location.href = iosAppLink;
            window.setTimeout(function () {
                window.location.href = iosDownloadLink;
            }, 1000);
        }
    } else if (/android/.test(ua)) {
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
            window.location.href = tcDownloadLink;
        } else if (ua.match(/WeiBo/i) == "weibo") {
            $("body").append("<div class='android show layer'></div>");
        } else if (ua.match(/QQ/i) == "qq") {
            window.location.href = androidAppLink;
            window.setTimeout(function () {
                window.location.href = tcDownloadLink;
            }, 1000);
        } else {
            window.location.href = androidAppLink;
            window.setTimeout(function () {
                window.location.href = tcDownloadLink;
            }, 1000);
        }
    }
}
oOpenBtn.addEventListener("click",fOpenApp);
oCloseBtn.addEventListener("click",function(){
    oTopBar.style.display = "none";
});