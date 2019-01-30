Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    };
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
};

String.prototype.format = function (args) {
    var result = this;
    if (arguments.length > 0) {
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                if (args[key] != undefined) {
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        }
        else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    var reg = new RegExp("({)" + i + "(})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
};

String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, '');
};

var CommonUtil = (function () {
    var fn = {
        getUrlPara: function (name) {
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                return r[2];
            }
            return '';
        },
        randomKey: function (len) {
            var key = "";
            var ascTable = ["0", "1", "2", "3", "4", "5",
                "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "g", "h",
                "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t",
                "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H",
                "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T",
                "U", "V", "W", "X", "Y", "Z"];
            for (var i = 0; i < len; ++i) {
                key += ascTable[parseInt(Math.random() * 62)].toString();
            }
            return key;
        },
        absoluteValue: function (a) {
            return parseFloat(a) < 0 ? -a : a;
        },
        cookie: function (c_name, c_value, expire, option) {
            if (arguments.length == 1) {
                var name = c_name + "=";
                var ca = document.cookie.split(';');
                for (var i = 0; i < ca.length; i++) {
                    var c = ca[i];
                    while (c.charAt(0) == ' ') c = c.substring(1);
                    if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
                }
                return "";
            } else {
                var d = new Date();
                var baseNum = 24 * 60 * 60 * 1000;
                if (option) {
                    switch (option.expireType) {
                        case "s" :
                            baseNum = 1000;
                            break;
                        case "m" :
                            baseNum = 60 * 1000;
                            break;
                        case "h" :
                            baseNum = 60 * 60 * 1000;
                            break;
                        case "d" :
                            baseNum = 24 * 60 * 60 * 1000;
                            break;
                    }
                }
                d.setTime(d.getTime() + (expire * baseNum));
                var expires = "expires=" + d.toUTCString() || '';
                document.cookie = c_name + "=" + c_value + "; " + expires;
            }
        },
        removeCookie: function (c_name) {
            fn.cookie(c_name, "", -1);
        },
        storage: function (name, value, expire, option) {
            try {
                if (arguments.length == 1) {
                    return window.localStorage ? localStorage.getItem(name) : fn.cookie(name);
                } else {
                    if (window.localStorage) {
                        localStorage.setItem(name, value);
                    } else {
                        fn.cookie(name, value , expire);
                    }
                }
            } catch (e) {
                fn.cookie(name, value, expire, option);
            }
        }
    };

    var regex = {
        tel_phone: /^0?1[3|4|5|6|7|8][0-9]\d{8}$/
    };

    function fIsIOS9() {
        //获取固件版本
        var getOsv = function () {
            var reg = /OS ((\d+_?){2,3})\s/;
            if (navigator.userAgent.match(/iPad/i) || navigator.platform.match(/iPad/i) || navigator.userAgent.match(/iP(hone|od)/i) || navigator.platform.match(/iP(hone|od)/i)) {
                var osv = reg.exec(navigator.userAgent);
                if (osv.length > 0) {
                    return osv[0].replace('OS', '').replace('os', '').replace(/\s+/g, '').replace(/_/g, '.');
                }
            }
            return '';
        };
        var osv = getOsv();
        var osvArr = osv.split('.');
        //初始化显示ios9引导
        if (osvArr && osvArr.length > 0) {
            if (parseInt(osvArr[0]) >= 9) {
                return true
            }
        }
        return false
    }

    function fOpenApp() {
        var iosAppLink = 'quicknews://sohu.com/sharenews?newsid=' + share.nTopicId + '&url=http://c.cdn.sohu.com/article/' + share.nTopicId + '&title=' + encodeURIComponent(share.sTitle) + '&contenttype=' + share.nType;
        var iosUniversalLink = 'https://18525bc38e188.cdn.sohucs.com/apple-app-site-association?newsid=' + share.nTopicId + '&url=http://c.cdn.sohu.com/article/' + share.nTopicId + '&title=' + encodeURIComponent(share.sTitle) + '&contenttype=' + share.nType;
        var androidAppLink = 'quicknews://sohu.com/sharenews?newsid=' + share.nTopicId + '&url=http://c.cdn.sohu.com/article/' + share.nTopicId + '&title=' + encodeURIComponent(share.sTitle) + '&contenttype=' + share.nType;
        var tcDownloadLink = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.sohu.quicknews';
        var iosDownloadLink = 'https://itunes.apple.com/cn/app/song-shu-fa-xian-sheng-huo/id1183147714?mt=8';
        var ua = navigator.userAgent.toLowerCase();
        if (/iphone|ipad|ipod/.test(ua)) {
            if (fIsIOS9()) {
                window.location.href = iosUniversalLink;
                window.setTimeout(function () {
                    window.location.href = iosDownloadLink;
                }, 500);
            } else {
                if (ua.match(/MicroMessenger/i) == "micromessenger" || ua.match(/QQ/i) == "qq") {
                    window.location.href = iosDownloadLink;
                } else if (ua.match(/WeiBo/i) == "weibo") {
                    $("body").append("<div class='ios show layer'></div>");
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
        } else {
            window.location.href = androidAppLink;
            window.setTimeout(function () {
                window.location.href = tcDownloadLink;
            }, 1000);
        }
    }

    function fTranslateTime(timestamp) {
        var _sTime;
        var _oToday = new Date();
        _oToday.setHours(0);
        _oToday.setMinutes(0);
        _oToday.setSeconds(0);
        var _nTodayTimestamp = +_oToday;
        if (timestamp > _nTodayTimestamp && timestamp - _nTodayTimestamp < 24 * 60 * 60 * 1000) {
            var nIntervalTimestamp = +new Date() - timestamp;
            if (nIntervalTimestamp < 60 * 1000) {
                _sTime = "刚刚";
            } else if (nIntervalTimestamp < 60 * 60 * 1000) {
                _sTime = Math.floor(nIntervalTimestamp / (1000 * 60)) + "分钟前";
            } else if (nIntervalTimestamp < 24 * 60 * 60 * 1000) {
                _sTime = Math.floor(nIntervalTimestamp / (1000 * 60 * 60)) + "小时前";
            }
        } else {
            var _nYearNow = parseInt(new Date().format("yyyy"));
            var _nYearArticle = parseInt(new Date(parseInt(timestamp)).format("yyyy"));
            if (_nYearNow > _nYearArticle) {
                _sTime = new Date(parseInt(timestamp)).format("yyyy-MM-dd");
            } else {
                _sTime = new Date(parseInt(timestamp)).format("MM-dd");
            }
        }
        return _sTime;
    }

    function fGetScrollDirect(fn) {
        var _nBeforeScrollTop = document.body.scrollTop;
        fn = fn || function () {
            };
        document.addEventListener("scroll", function () {
            var _nAfterScrollTop = document.body.scrollTop;
            var _nDelta = _nAfterScrollTop - _nBeforeScrollTop;
            _nBeforeScrollTop = _nAfterScrollTop;

            var _nScrollTop = document.body.scrollTop;
            var _nScrollHeight = document.body.scrollHeight;
            var _nWindowHeight = window.height;
            if (_nScrollTop + _nWindowHeight > _nScrollHeight - 10) {
                fn('up');
                return;
            }
            if (_nAfterScrollTop < 10 || _nAfterScrollTop > document.body.height - 10) {
                fn('up');
            } else {
                if (Math.abs(_nDelta) < 10) {
                    return false;
                }
                fn(_nDelta > 0 ? "down" : "up");
            }
        }, false);
    }

    function fTopBarBind() {
        $("#topBarContent .btn-close").on("click", function () {
            $("#topBarContent").hide();
            $("#articleContent").css("padding-top", "30px");
        });
        fGetScrollDirect(function (direction) {
            if (direction == "down") {
                $(".top-bar").addClass("slide_hide").removeClass("slide_show");
            } else {
                $(".top-bar").addClass("slide_show").removeClass("slide_hide");
            }
        });
    }

    return {
        openApp: fOpenApp,
        topBarBind: fTopBarBind,
        translateTime: fTranslateTime,
        fn: fn,
        regex: regex
    }
})();
