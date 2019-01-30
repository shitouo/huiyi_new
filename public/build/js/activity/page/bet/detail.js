/**
 * Created by zhphu on 2017/2/21.
 */
var BetUtil = (function () {
    function fCheckPhone(){
        return global.userId && CommonUtil.regex.tel_phone.test(global.userId);
    }
    function fShowBindBox() {
        BetUtil.showOverlay();
        var _oPopBoxBind = $(".popBox-bind");
        _oPopBoxBind.find("input").val("");
        _oPopBoxBind.find(".tips-area").text("");
        _oPopBoxBind.show();
    }
    //成功绑定手机号之后获取我的狐币数、获取我的历史押注记录
    function fGetMyInfo(callback){
        //获取我的历史话题进入记录
        global.enteredGuessesStorageKey =  "entered_guesses_"+global.userId;
        global.enteredGuesses = JSON.parse(CommonUtil.fn.storage(global.enteredGuessesStorageKey)) || [];

        //获取我的狐币数
        BetUtil.getMyChips(function (_nMyChips) {
            if(_nMyChips != null){
                $(".my-chips").text(BetUtil.getShowChips(+_nMyChips));
            }
            global.myChips = _nMyChips;
            BetUtil.changeBetSelectBtnStatus(_nMyChips);
            //获取狐币奖励（截止时间之前并且用户第一次访问该竞猜）
            if(global.betStatus < 2 && !(global.enteredGuesses.indexOf(global.betId) > -1)){
                global.enteredGuesses.push(global.betId);
                CommonUtil.fn.storage(global.enteredGuessesStorageKey,JSON.stringify(global.enteredGuesses),30 * 12 * 10);
                BetUtil.getEnterBetBonus(function (_oBonusInfo) {
                    var _nMyChips = +_oBonusInfo.balance || 0;
                    if(_nMyChips){
                        global.myChips = _nMyChips;
                        $(".my-chips").text(BetUtil.getShowChips(+_nMyChips));
                        BetUtil.changeBetSelectBtnStatus(_nMyChips);
                    }
                    if (+_oBonusInfo.bonus) {
                        setTimeout(function(){
                            BetUtil.showNewChips(callback);
                        },600);
                    } else {
                        if(callback && typeof callback == "function"){
                            callback();
                        }
                        $(".my-chips-area").show();
                    }
                });
            }else{
                if(callback && typeof callback == "function"){
                    callback();
                }
                $(".my-chips-area").show();
            }
        });

        //获取当前话题我的押注记录
        BetUtil.getBetRecord(function (_aBetRecords) {
            BetUtil.showBetRecord(_aBetRecords);
        });
    }

    //获赠狐币提示
    function fShowNewChips(callback) {
        var _oOverlay = $(".overlay");
        var _oNewChip = $("#new-chip");
        var _oChipsArea = $(".my-chips-area");
        var _oIconBeans = _oChipsArea.find(".icon-beans");
        BetUtil.showOverlay();
        _oNewChip.show();
        _oChipsArea.show();
        _oIconBeans.css("opacity","0");
        _oChipsArea.css("z-index",1500);

        var _nNewChipWidth = _oNewChip.width();
        var _nNewChipHeight = _oNewChip.height();

        var _nChipsContentWidth = _oChipsArea.width();
        _oChipsArea.find(".my-chips-content").css("right","-"+_nChipsContentWidth+"px");

        var _nYShift = _oIconBeans.offset().top - _oNewChip.offset().top - _nNewChipHeight/2;
        var _nXShift = _oIconBeans.offset().left - _oNewChip.offset().left - _nNewChipWidth/2;

        var sunshineAn = function(){
            JT.fromTo('.icon-sunshine', 1,
                {
                    scale: 0.1,
                    opacity: 0
                }, {
                    scale: 1,
                    opacity: 1,
                    ease: JT.Elastic.Out,
                    onEnd: function (n) {

                    }
                });
        };
        var starAn = function(){
            JT.fromTo('.icon-star', 1,
                {
                    scale: 0.1,
                    opacity: 0
                }, {
                    scale: 1,
                    opacity: 1,
                    ease: JT.Elastic.Out,
                    onEnd: function (n) {

                    }
                });
        };
        var boxAn = function(){
            JT.fromTo('.icon-beans-box', 1,
                {
                    scale: 0.3,
                    opacity: 0
                }, {
                    scale: 1,
                    opacity: 1,
                    ease: JT.Elastic.Out,
                    onEnd: function (n) {

                    }
                });
        };
        var beansNumAn = function(){
            JT.fromTo('.icon-beans-num', 1,
                {
                    scale: 0.8,
                    opacity: 0
                }, {
                    scale: 1,
                    opacity: 1,
                    ease: JT.Elastic.Out,
                    onEnd: function (n) {
                    }
                });
        };
        var tipsAn = function(){
            JT.fromTo('.icon-tips', 1,
                {
                    scale: 0.8,
                    opacity: 0
                }, {
                    scale: 1,
                    opacity: 1,
                    ease: JT.Elastic.Out,
                    onEnd: function (n) {
                        setTimeout(function(){
                            $("#new-chip .icon-tips,.icon-beans-num").hide();
                        },100);
                        moveAn();
                    }
                });
        };
        var moveAn = function(){
            JT.fromTo('.new-chip-content', 0.8,
                {
                    scale: 1,
                    x: 0,
                    y: 0
                }, {
                    scale: 0,
                    x: _nXShift,
                    y: _nYShift,
                    ease: JT.Cubic.InOut,
                    onEnd: function (n) {
                        chipsBeansAn();
                    }
                });
        };
        var chipsBeansAn = function(){
            JT.fromTo('.my-chips-area .icon-beans', 0.8,
                {
                    opacity: 0,
                    scale: 0.6
                }, {
                    opacity: 1,
                    scale: 1,
                    ease: JT.Elastic.Out,
                    onEnd: function (n) {
                        chipsContentAn()
                    }
                });
        };
        var chipsContentAn = function(){
            JT.fromTo('.my-chips-content', 0.1,
                {
                    x: _nChipsContentWidth
                }, {
                    x: -_nChipsContentWidth,
                    ease: JT.Expo.Out,
                    onEnd: function (n) {
                        BetUtil.hideOverlay();
                        _oNewChip.hide();
                        _oChipsArea.css("z-index",999);
                        if(callback && typeof callback == "function"){
                            callback();
                        }
                    }
                });
        };

        sunshineAn();
        setTimeout(function(){
            starAn();
            boxAn();
            setTimeout(function(){
                beansNumAn();
                tipsAn();
            },100);

        },100);


    }
    function fShowPopTips(text){
        $(".popTips-content").text(text);
        $(".popTips").show();
        setTimeout(function(){
            $(".popTips").hide();
        },1000);
    }

    //首次进入竞猜话题获取赠送的狐币
    function fGetEnterBetBonus(callback) {
        if(BetUtil.checkPhone()){
            var _nTimestamp = +new Date();
            $.ajax({
                type: "POST",
                cache: false,
                url: global.domain+"/guess/enterGuessBonus?timestamp="+_nTimestamp,
                dataType:"json",
                data: JSON.stringify({
                    guessId: global.betId,
                    userId: global.userId,
                    source: 1
                }),
                contentType: "application/json;charset='UTF-8'",
                success: function (data) {
                    var _oInfo = !data.errorCode ? data.data||{} : {};
                    if (callback && typeof callback == "function") {
                        return callback(_oInfo)
                    }
                },
                error: function(e){
                    callback({})
                }
            });
        }
    }

    //获取我的狐币数量
    function fGetMyChips(callback) {
        if(BetUtil.checkPhone()){
            var _nTimestamp = +new Date();
            $.ajax({
                type: "GET",
                url: global.domain + "/guessQuery/getBalance?timestamp="+_nTimestamp,
                dataType: "json",
                data: {
                    userId: global.userId,
                    source: 1
                },
                success: function (data) {
                    var _nMyChips = !data.errorCode? data.data.balance : 0;
                    if (callback && typeof callback == "function") {
                        return callback(_nMyChips);
                    }
                },
                error: function(e){
                    callback(null);
                },
                complete : function(XMLHttpRequest,status){
                    if(status=='timeout' || status == "error" || status == "abort"){
                       callback(null);
                    }
                }
            });
        }
    }
    function fGetShowChips(_nChips){
        _nChips = +_nChips;
        if(_nChips < 10000){
            return _nChips;
        }else if(_nChips >= 10000 && _nChips < 100000){
            return (_nChips / 10000).toFixed(1)+"万";
        }else if(_nChips >=100000 && _nChips<100000000){
            return parseInt((_nChips / 10000))+"万";
        }else if(_nChips >=100000000 && _nChips <1000000000){
            return (_nChips / 100000000).toFixed(1)+"亿";
        }else if(_nChips >= 1000000000 && _nChips < 1000000000000){
            return parseInt((_nChips / 100000000))+"亿";
        }else if(_nChips >= 1000000000000 && _nChips < 10000000000000 ){
            return (_nChips / 1000000000000).toFixed(1)+"万亿";
        }else{
            return parseInt((_nChips / 1000000000000))+"万亿";
        }
    }
    //根据我的狐币状态修改押注按钮状态
    function fChangeBetSelectBtnStatus(_nMyChips) {
        var _aBetSelectBtn = $(".bet-chips-select");
        if(!+_nMyChips){
            _aBetSelectBtn.find("input").attr("readonly","readonly");
            _aBetSelectBtn.removeClass("on").addClass("off");
            return false;
        }
        _aBetSelectBtn.removeClass("selected");
        _aBetSelectBtn.find("input").removeAttr("readonly");
        for (var i = 0, len = _aBetSelectBtn.length; i < len; i++) {
            var _dBetSelectBtn = _aBetSelectBtn.eq(i);
            if (+_dBetSelectBtn.attr("data-num") > _nMyChips) {
                _dBetSelectBtn.removeClass("on").addClass("off");
            } else {
                _dBetSelectBtn.removeClass("off").addClass("on");
                if(i == 0 && _dBetSelectBtn.hasClass("btn")){
                    _dBetSelectBtn.addClass("selected");
                }
            }
        }
    }

    //获取奖池信息以及竞猜状态信息
    function fGetBetInfo(callback) {
        var _nTimestamp = +new Date();
        $.ajax({
            type: "POST",
            url: global.domain + "/guessQuery/guessInfo?timestamp="+_nTimestamp,
            dataType: "json",
            contentType: "application/json;charset='UTF-8'",
            data: JSON.stringify({
                guessIds: [global.betId]
            }),
            success: function (data) {
                if (!data.errorCode) {
                    var _oBetInfo = data.data? data.data[0]:null;
                    if (callback && typeof callback == "function") {
                        callback(_oBetInfo);
                    }
                }
            }
        });
    }
    function fShowBetInfo(_oBetInfo){
        if(!!_oBetInfo){
            //话题结果展示
            //竞猜状态 _oBetInfo.status：1、竞猜计算中；2、已揭晓（计算完成）；3、提前揭晓；4、竞猜取消；
            if(_oBetInfo.status == 1){
                global.betStatus = 2;
            }else if (_oBetInfo.status == 2 || _oBetInfo.status == 3) {
                $(".bet-btn").addClass("fail");
                $(".bet-btn-" + _oBetInfo.winOption).removeClass("fail").addClass("win");
                global.betStatus = 3;
                if(_oBetInfo.resultDetail){
                    $(".bet-result-text").text(_oBetInfo.resultDetail)
                }
                $(".bet-result").show();
            }else if(_oBetInfo.status == 4){
                $("body").html(BetTemplate.betDeleted);
                return false;
            }

            //更新竞猜状态
            BetUtil.showBetStatus({
                startTime: _oBetInfo.startTime,
                endTime: _oBetInfo.endTime,
                announceTime: _oBetInfo.announceTime
            },!(+_oBetInfo.status));
            global.betTimes.announceTime = _oBetInfo.announceTime;
            //话题结果揭晓后清除获取奖池详情的定时器
            if(global.betStatus == 3){
                clearInterval(global.getBetInfoTimer);
            }

            var _nTimeBonus = ((_oBetInfo.endTime - +new Date()) / (36 * 1000)).toFixed(2);
            if(global.betStatus == 0){
                $(".time-bonus-area,.jackpot-content").hide();
            }else if(global.betStatus == 1){
                if(_nTimeBonus > 0){
                    $(".time-bonus-now").text(_nTimeBonus);
                    $(".time-bonus-area").show();
                }
                if(+_oBetInfo.betTotalCount){
                    $(".jackpot-content").show();
                }else{
                    $(".jackpot-content").hide();
                }
            }else {
                $(".time-bonus-area").hide();
                if(+_oBetInfo.participants){
                    $(".jackpot-content").show();
                }else{
                    $(".jackpot-content").hide();
                }
            }

            clearInterval(global.timeBonusTimer);
            var _oTimer = setInterval(function () {
                _nTimeBonus = ((_oBetInfo.endTime - +new Date()) / (36 * 1000)).toFixed(2);
                if (_nTimeBonus <= 0 || global.betStatus == 0 || global.betStatus == 2 || global.betStatus == 3) {
                    $(".time-bonus-now").text(0);
                    if(global.betTimes.announceTime > +new Date()){
                        BetUtil.showBetStatus(global.betTimes,1);
                    }
                    $(".time-bonus-area").hide();
                    clearInterval(_oTimer);
                } else {
                    $(".time-bonus-now").text(_nTimeBonus);
                    $(".time-bonus-area").show();
                }
            }, 1000);
            global.timeBonusTimer =  _oTimer;

            //奖池数据显示
            var _nTotalChips = _oBetInfo.betTotalCount || 0;
            var _nTotalActor = _oBetInfo.participants || 0;
            if(!_nTotalActor){
                $(".bet-jackpot-content").hide();
            }else{
                $(".bet-jackpot-content").show();
            }
            $(".jackpot-data-jetton").text(_nTotalChips);
            $(".jackpot-data-actor").text(_nTotalActor);
            _nTotalChips = 0;
            var _oOptions = _oBetInfo.options;
            for(i in _oOptions){
                _nTotalChips += +_oOptions[i].count;
            }
            $(".jackpot-side").css("width","0%");
            for (i in _oOptions) {
                var _sText = _oOptions[i].count + "狐币/" + _oOptions[i].participants + "人次";
                $(".bet-jackpot-area .side-data-"+_oOptions[i].optionId).text(_sText);
                var _nOneSidePercent = ((_oOptions[i].count / _nTotalChips) * 100);
                var _sPosition = global.options[_oOptions[i].optionId]?global.options[_oOptions[i].optionId].option_position:"";
                $(".jackpot-side-"+_sPosition).css("width", _nOneSidePercent + "%");
            }
        }else{
            $(".bet-jackpot-area").hide();
        }

    }
    function fShowBetStatus(_oBetTimes,_bStatusFlag){
        //第一次用cms数据展示,以及服务器请求status为0时，根据时间改变竞猜状态
        if(_bStatusFlag){
            //0:未开始 1:已开始 2:待揭晓(已截止) 3:已结束
            var _nTimeNow = +new Date();
            if (_nTimeNow < _oBetTimes.startTime) {
                global.betStatus = 0;
            } else if (_nTimeNow > _oBetTimes.startTime && _nTimeNow < _oBetTimes.endTime) {
                global.betStatus = 1;
            } else if (_nTimeNow > _oBetTimes.endTime && _nTimeNow < _oBetTimes.announceTime) {
                global.betStatus = 2;
            } else {
                global.betStatus = 3;
            }
        }
        var _sStartTime = BetUtil.formatTimestamp(_oBetTimes.startTime);
        var _sEndTime = BetUtil.formatTimestamp(_oBetTimes.endTime);
        var _sAnnounceTime = BetUtil.formatTimestamp(_oBetTimes.announceTime);
        var _sBetTimeText = "";
        switch (global.betStatus){
            case 0 : _sBetTimeText = _sStartTime + "开始"; break;
            case 1 : _sBetTimeText = _sEndTime + "截止"; break;
            case 2: _sBetTimeText = _sAnnounceTime + "揭晓"; break;
            case 3 : _sBetTimeText = _sAnnounceTime + "已揭晓"; break;
        }
        if(_bStatusFlag && global.betStatus == 3){
            $(".bet-time-area .bet-time").text(_sAnnounceTime + "待揭晓").show();
            global.betStatus = 2;
        }else{
            $(".bet-time-area .bet-time").text(_sBetTimeText).show();
        }

        //获取当前话题我的竞猜结果，同时更新我的狐币数
        if(global.betStatus == 3 && !_bStatusFlag){
            $(".bet-result").show();
            BetUtil.getMyBetResult(function (_oResult) {
                if (_oResult.result >=0 && _oResult.result <=2 && !$(".my-bet-record-result").length) {
                    var _sBetResult = BetTemplate.betResult.format({
                        beans_num: BetUtil.getShowChips(Math.abs(_oResult.bonus)),
                        result_text: BetTemplate.betResultText[+_oResult.result],
                        display_class: _oResult.result == 0 ? "none" : ""
                    });
                    $(".my-bet-record-list").append(_sBetResult);
                }
            });
            BetUtil.getMyChips(function (_nMyChips) {
                $(".my-chips").text(BetUtil.getShowChips(+_nMyChips));
                global.myChips = _nMyChips;
            });
            //获取竞猜排名(赢家风云榜)
            BetUtil.getRankInfo(function(_oRankInfo){
                if(_oRankInfo.length){
                    BetUtil.showBetRank(_oRankInfo);
                }
            });
        }
    }

    //押注
    function fBet(option, callback) {
        if(BetUtil.checkPhone()){
            var _nTimestamp = +new Date();
            $.ajax({
                type: "POST",
                url: global.domain + "/guess/participateGuess?timestamp="+_nTimestamp,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify({
                    guessId: global.betId,
                    userId: global.userId,
                    source: 1,
                    optionId: option.optionId,
                    betCount: option.betChips
                }),
                success: function (data) {
                    if (!data.errorCode) {
                        var _oInfo = data.data;
                        if (callback && typeof callback == "function") {
                            callback(_oInfo);
                        }
                    }else{
                        $(".popBox,.overlay").hide();
                        BetUtil.hideOverlay();
                        BetUtil.showPopTips("哎呀，好像出错了~");
                    }
                },
                complete : function(XMLHttpRequest,status){
                    if(status=='timeout' || status == "error" || status == "abort"){
                        $(".popBox,.overlay").hide();
                        BetUtil.hideOverlay();
                        BetUtil.showPopTips("哎呀，好像出错了~");
                    }
                }
            });
        }
    }

    //获取当前话题的我的押注记录
    function fGetBetRecord(callback) {
        if(BetUtil.checkPhone()){
            var _nTimestamp = +new Date();
            $.ajax({
                type: "GET",
                url: global.domain + "/guess/getUserGuessHistory?timestamp="+_nTimestamp,
                dataType: "json",
                data: {
                    guessId: global.betId,
                    userId: global.userId,
                    source: 1
                },
                success: function (data) {
                    if (!data.errorCode) {
                        var _aBetRecords = data.data;
                        if (callback && typeof callback == "function") {
                            callback(_aBetRecords)
                        }
                    }
                }
            });
        }
    }
    function fShowBetRecord(_aBetRecords){
        var _sBetRecords = "";
        if(_aBetRecords.length){
            var nRecordLen = _aBetRecords.length;
            for (var i = nRecordLen - 1; i >= 0; i--) {
                var _oBetRecord = _aBetRecords[i];
                _sBetRecord = BetTemplate.betRecord.format({
                    beans_num: BetUtil.getShowChips(_oBetRecord.count),
                    option_position: global.options[_oBetRecord.optionId].option_position,
                    option_name: global.options[_oBetRecord.optionId].option_name,
                    bet_time: BetUtil.formatTimestamp(_oBetRecord.createTime),
                    time_bonus: _oBetRecord.timeBonus,
                    display_class: nRecordLen - i > 5 ? "none":""
                });
                _sBetRecords += _sBetRecord;
            }
            $(".my-bet-record-list").prepend(_sBetRecords);
            if(_aBetRecords.length > 5){
                $(".my-bet-record-list .btn-area-show").show();
            }
            $(".my-bet-record-area").show();
        }
    }
    //押注成功后，调整押注历史记录显示
    function fBetRecordShowAdjust(){
        var _aMyRecord = $(".my-bet-record-detail");
        var _nRecordLen = _aMyRecord.length;
        if(_nRecordLen <= 5){
            return false;
        }else{
            $(".my-bet-record-detail.none").removeClass("none");
            var _oMyRecord =  $(".my-bet-record-detail");
            for(i in _oMyRecord){
                if(i >= 5 ){
                    _oMyRecord.eq(i).addClass("none");
                }
            }
            $(".my-bet-record-list .btn-area-show").show();
            $(".my-bet-record-list .btn-area-hide").hide();
        }
    }

    //获取当前话题的我的竞猜结果
    function fGetMyBetResult(callback) {
        if(BetUtil.checkPhone()){
            var _nTimestamp = +new Date();
            $.ajax({
                type: "GET",
                url: global.domain + "/guess/getUserGuessResult?timestamp="+_nTimestamp,
                dataType: "json",
                data: {
                    guessId: global.betId,
                    userId: global.userId,
                    source: 1
                },
                success: function (data) {
                    if (!data.errorCode) {
                        var _oInfo = data.data;
                        if (callback && typeof callback == "function") {
                            callback(_oInfo)
                        }
                    }
                }
            });
        }
    }

    //获取竞猜排名(赢家风云榜)
    function fGetRankInfo(callback){
        return false;
        var _nTimestamp = +new Date();
        $.ajax({
            type: "GET",
            url: global.domain + "/guess/getGuessRank?timestamp="+_nTimestamp,
            dataType: "json",
            data: {
                guessId: global.betId,
                source: 1
            },
            success: function (data) {
                if (!data.errorCode) {
                    var _oInfo = data.data;
                    if (callback && typeof callback == "function") {
                        callback(_oInfo)
                    }
                }
            }
        });
    }
    function fShowBetRank(_aRankInfo){
        var _sRankInfo = '';
        for(var i = 0,len = _aRankInfo.length;i < len;i++){
            _aRankInfo += BetTemplate.betRank.format({
                uname: _aRankInfo[i].uname,
                win_beans: _aRankInfo[i].beans_num
            });
        }
        $(".bet-rank-list").append(_sRankInfo);
        $(".bet-rank-area").show();
    }

    //获取相关参考文章
    function fGetRecommend(_aArticleIds,callback) {
        var _nTimestamp = +new Date();
        $.ajax({
            type: "post",
            url: global.domain + "/engine/query?timestamp="+_nTimestamp,
            dataType: "json",
            data: JSON.stringify({
                newsids: _aArticleIds
            }),
            success: function (data) {
                if (!data.errorCode) {
                    var _oInfo = data.articles;
                    if (callback && typeof callback == "function") {
                        callback(_oInfo)
                    }
                }
            }
        });
    }

    //格式化时间戳
    function fFormatTimestamp(_nTimestamp){
        var _nYearNow = new Date().getFullYear();
        var _nYearTimeStamp = new Date(+_nTimestamp).getFullYear();
        return _nYearNow == _nYearTimeStamp? new Date(+_nTimestamp).format("MM-dd hh:mm"):new Date(+_nTimestamp).format("yyyy-MM-dd hh:mm");
    }
    //蒙层的显示与隐藏
    function fShowOverlay(){
        $(".overlay").show();
        $("html,body").css({"overflow":"hidden"});
        $(".btn-select-content").on("touchmove",function(e){
            e.stopPropagation();
        });
        $("body").on("touchmove",function(e){
            e.preventDefault();
            e.stopPropagation();
        },false);
    }
    function fHideOverlay(){
        $(".overlay").hide();
        $("html,body").css("overflow","scroll");
        $("body").unbind("touchmove");
    }

    //调整竞猜规则的位置
    function fAdjustRulePos(){
        var _oPubReason = $(".published-reason");
        var _nPubReasonLineHeight = parseInt(_oPubReason.css("line-height"));
        var _nPubReasonHeight = parseInt(_oPubReason.height());
        var _nPubReasonWidth = parseInt(_oPubReason.width());
        var _nPubReasonLineCount = Math.round(_nPubReasonHeight / _nPubReasonLineHeight);

        var _sPubReason =  _oPubReason.text();
        var _nFontSize = parseInt(_oPubReason.css('font-size'));
        var _nPubReasonLen = _sPubReason.replace(/[\u0391-\uFFE5]/g,"aa").length * (_nFontSize/2);
        var _nPubLastLineWidth = _nPubReasonLen - _nPubReasonWidth * (_nPubReasonLineCount - 1);

        var _oRuleArea = $(".bet-tips .bet-rule-link");
        var _nRuleAreaWidth = _oRuleArea.width();

        if(_nPubLastLineWidth + _nRuleAreaWidth < _nPubReasonWidth){
            _oRuleArea.addClass("adjust");
        }
    }

    return {
        checkPhone : fCheckPhone,
        getMyInfo : fGetMyInfo,
        showBindBox : fShowBindBox,
        showPopTips : fShowPopTips,
        getEnterBetBonus: fGetEnterBetBonus,
        showNewChips: fShowNewChips,
        getMyChips: fGetMyChips,
        getShowChips : fGetShowChips,
        changeBetSelectBtnStatus: fChangeBetSelectBtnStatus,
        getBetInfo: fGetBetInfo,
        showBetStatus: fShowBetStatus,
        showBetInfo: fShowBetInfo,
        bet: fBet,
        getBetRecord: fGetBetRecord,
        showBetRecord : fShowBetRecord,
        betRecordShowAdjust : fBetRecordShowAdjust,
        getMyBetResult: fGetMyBetResult,
        getRankInfo: fGetRankInfo,
        showBetRank: fShowBetRank,
        getRecommend: fGetRecommend,
        formatTimestamp: fFormatTimestamp,
        showOverlay : fShowOverlay,
        hideOverlay : fHideOverlay,
        adjustRulePos : fAdjustRulePos
    };
})();

var BetTemplate = {
    //0:押注成功 1:押注已停止 2:竞猜尚未开始 3:竞猜已经取消 4:竞猜最多押注20次 5:余额不足
    betFeedback : ["参与成功~","参与时间已截止，下次请尽早~","等一下，活动还未开始~","投了太多次啦~","话题已取消，狐币稍后返还~","请选择正确的狐币数"],
    betRecord: "<li class='my-bet-record my-bet-record-detail {display_class}'>\
                  <div class='my-bet-detail'>\
                      <i class='icon-dot'></i><span>我向<em class='option-name option-name-{option_position}'>{option_name}</em>投了<i class='icon-beans'></i>x<em class='num-beans'>{beans_num}</em></span>\
                  </div>\
                  <div class='bet-time'>{bet_time}</div>\
                  <div class='time-bonus'>时间加成{time_bonus}</div>\
               </li>",
    betResultText: ["我稳稳地没赢也没输", "我神机妙算，赢了", "我机关算尽，还是输了"],
    betResult: "<li class='my-bet-record my-bet-record-result'>\
                  <div class='my-bet-detail'>\
                     <i class='icon-dot'></i><span>{result_text}</span><span class='beans-area {display_class}'><i class='icon-beans'></i>x<em class='num-beans'>{beans_num}</em></span>\
                  </div>\
              </li>",
    betRank:"<li class='rank-item'>\
                <div class='rank-item-info'>\
                    <span class='rank-item-order-{order} rank-item-order'></span>\
                    <span class='avatar'></span>\
                    <span class='uname'>{uname}</span>\
                </div>\
                <div class='win-item-count'>赢了<span class='icon-beans'></span>×<span class='win-beans'>{win_beans}</span></div>\
            </li>",
    betDeleted: "<div class='bet-deleted-area'>\
                    <div class='bet-deleted-content'>\
                        <div class='tips-bg'></div>\
                        <p class='tips-text'>此话题已被取消，已参与过的用户狐币将在24小时内返还～</p>\
                    </div>\
                </div>"
};

$(function () {
    //押注状态
    global.betStatus = 0;//0:未开始 1:已开始 2:待揭晓(已截止) 3:已结束
    global.timeBonusTimer = {};
    /*BetUtil.showBetStatus(global.betTimes,1);*/
    BetUtil.adjustRulePos();

    //调整押注按钮数值显示
    var oBetSelectBtn = $(".bet-chips-select.btn");
    for(i in oBetSelectBtn){
        var _nBetNum = +oBetSelectBtn.eq(i).attr("data-num");
        oBetSelectBtn.eq(i).text(BetUtil.getShowChips(_nBetNum));
        if(_nBetNum <= 0){
            oBetSelectBtn.eq(i).hide();
        }
    }

    //获取选项相关信息
    var nOptions = JSON.parse(global.options);
    global.options = {};
    for(i in nOptions){
        global.options[nOptions[i].id] = {
            option_name : nOptions[i].option_content,
            option_position : $(".bet-btn-"+nOptions[i].id).attr("data-pos")
        }
    }

    //获取相关参考文章
    var aRelatedArticles = JSON.parse(global.relateArticles);
    var articleIds = [];
    for(i in aRelatedArticles){
        articleIds.push(aRelatedArticles[i].article_id);
    }
    BetUtil.getRecommend(articleIds,function (_aRecommends) {
        AsyncUtil.showRecommends(_aRecommends,global.domain);
    });

    //获取奖池信息以及竞猜状态信息
    BetUtil.getBetInfo(function(_oBetInfo){
        BetUtil.showBetInfo(_oBetInfo)
    });
    global.getBetInfoTimer = setInterval(function(){
        BetUtil.getBetInfo(function(_oBetInfo){
            BetUtil.showBetInfo(_oBetInfo);
        });
    },30000);
    $(".time-bonus-content").click(function(){
        BetUtil.showOverlay();
        $(".popBox-tips").show();
    });

    //输入框获取焦点后隐藏所有错误提示
    $("input").focus(function(){
        $(".popBox .tips-area").text("");
    });

    //绑定手机号
    global.userId = CommonUtil.fn.storage("act_uid");
    if(BetUtil.checkPhone()){
        //获取我的狐币数、历史押注记录
        BetUtil.getMyInfo();
    }
    $(".popBox-bind .btn-confirm").on("click",function(){
        var _nPhoneNum = $(".popBox-bind .phone-num-bind").val().trim();
        if(CommonUtil.regex.tel_phone.test(_nPhoneNum)){
            //本地缓存用户账号
            global.userId = _nPhoneNum;
            CommonUtil.fn.storage("act_uid",_nPhoneNum,30 * 12 * 10);
            BetUtil.hideOverlay();
            $(".popBox").hide();
            //获取我的狐币数、历史押注记录
            BetUtil.getMyInfo(function(){
                var _nIndex = +$(".bet-btn-"+global.chosenOptionId).attr("data-index");
                $(".bet-btn").eq(_nIndex).trigger("click");
            });
        }else{
            if(!_nPhoneNum){
                return false;
            }
            var _oTipsArea = $(".popBox-bind .tips-area");
            _oTipsArea.text("请输入正确的手机号");
        }
    });

    //参与竞猜（押注）
    $("[data-type='int']").on("keyup", function () {
        $(this).val($(this).val().replace(/\D+/g, ''));
    });
    $(".bet-btn").click(function () {
        var _nOptionId = $(this).attr("data-id");
        global.chosenOptionId = _nOptionId;
        if(!BetUtil.checkPhone() && global.betStatus < 2){
            BetUtil.showBindBox();
            return false;
        }
        $(".popBox-bet .btn-confirm").attr("data-id", _nOptionId);
        if (global.betStatus == 0) {
            BetUtil.showPopTips("等一下，活动还未开始~");
        } else if (global.betStatus == 1) {
            BetUtil.getMyChips(function (_nMyChips) {
                if(_nMyChips != null){
                    $(".my-chips").text(BetUtil.getShowChips(+_nMyChips));
                    global.myChips = _nMyChips;
                    BetUtil.changeBetSelectBtnStatus(_nMyChips);
                }
            });

            var _oThat = $(this);
            var _sOptionName = _oThat.find(".text").text().trim();
            $(".popBox-bet .option-name").text(_sOptionName);
            BetUtil.showOverlay();
            $(".bet-chips-select").find("input").val("其他");
            $(".popBox-bet .tips-area").text("");
            $(".popBox-bet").show();
        } else if(global.betStatus == 2 || global.betStatus == 3){
            BetUtil.showPopTips("参与时间已截止，下次请尽早~");
        }
    });
    $(".bet-chips-select-area").on("click", ".bet-chips-select.on", function () {
        var that = $(this);
        $(".popBox-bet .tips-area").text("");
        /*if(that.hasClass("btn") && that.hasClass("selected")){
            return that.removeClass("selected");
        }*/
        $(".bet-chips-select.on").removeClass("selected");
        that.addClass("selected");
        if (that.hasClass("btn")) {
            $(".bet-chips-select").find("input").val("其他");
        }else if(that.hasClass("input") && !+that.find("input").val()){
            $(".bet-chips-select").find("input").val("");
        }
    });
    $('.bet-chips-input').bind('input propertychange', function() {
        var _nBetChips = +$('.bet-chips-input').val();
        var _oTipsArea = $(".popBox-bet .tips-area");
        if(_nBetChips > global.myChips || _nBetChips <= 0){
            _oTipsArea.text("请输入正确的狐币数");
        }else{
            _oTipsArea.text("");
        }
    });
    $(".overlay,.btn-cancel").click(function () {
        BetUtil.hideOverlay();
        $(".popBox").hide();
    });
    $(".popBox-bet .btn-confirm").click(function () {
        if(!BetUtil.checkPhone()){
            BetUtil.showBindBox();
            return false;
        }
        var _dSelectedBtn = $(".bet-chips-select.selected");
        var _nBetChips = _dSelectedBtn.hasClass("input") ? +$(".bet-chips-select").find("input").val() : +_dSelectedBtn.attr("data-num");
        var _nOptionId = $(this).attr("data-id");
        if (_nBetChips && _nBetChips <= global.myChips) {
            BetUtil.bet({
                optionId: _nOptionId,
                betChips: _nBetChips
            }, function (_oInfo) {
                //重新获取奖池信息
                BetUtil.getBetInfo(function(_oBetInfo){
                    BetUtil.showBetInfo(_oBetInfo)
                });

                if(!_oInfo.code){
                    //更新我的狐币信息
                    if(_oInfo.balance>=0){
                        var _nMyChips = _oInfo.balance;
                        global.myChips = _nMyChips;
                        $(".my-chips").text(BetUtil.getShowChips(_nMyChips));
                    }
                    //添加新的押注记录
                    _sBetRecord = BetTemplate.betRecord.format({
                        beans_num: _nBetChips,
                        option_position: global.options[_nOptionId].option_position,
                        option_name: global.options[_nOptionId].option_name,
                        bet_time: BetUtil.formatTimestamp(+new Date()),
                        time_bonus: _oInfo.timeBonus,
                        display_class: i >=5 ? "none":""
                    });
                    $(".my-bet-record-list").prepend(_sBetRecord);
                    BetUtil.betRecordShowAdjust();

                    $(".my-bet-record-area").show();
                    $(".popBox").hide();
                    BetUtil.hideOverlay();
                    setTimeout(function(){
                        $(".popTips-bet-success").show();
                        setTimeout(function(){
                            $(".popTips-bet-success").hide();
                        },800);
                    },300)

                }else{
                    BetUtil.showPopTips(BetTemplate.betFeedback[+_oInfo.code]);
                    setTimeout(function () {
                        $(".popTips").hide();
                        $(".popBox").hide();
                        BetUtil.hideOverlay();
                    }, 1000);
                }
            });
        } else {
            var _oTipsArea = $(".popBox-bet .tips-area");
            if(_dSelectedBtn.hasClass("input")){
                _oTipsArea.text("请输入正确的狐币数");
            }else{
                _oTipsArea.text("请选择正确的狐币数");
            }

        }

    });

    //押注记录的显示与隐藏
    $(".btn-show-full-record").on("click",function(){
        $(".my-bet-record-detail.none").removeClass("none");
        $(".my-bet-record-list .btn-area-hide").show();
        $(".my-bet-record-list .btn-area-show").hide();
    });
    $(".btn-hide-record").on("click",function(){
        $(".my-bet-record-detail.none").removeClass("none");
        var _oMyRecord =  $(".my-bet-record-detail");
        for(i in _oMyRecord){
            if(i >= 5 ){
                _oMyRecord.eq(i).addClass("none");
            }
        }
        $(".my-bet-record-list .btn-area-show").show();
        $(".my-bet-record-list .btn-area-hide").hide();
    });

    function fGetScrollDirect(fn) {
        var _nBeforeScrollTop = document.body.scrollTop;
        fn = fn || function () {};
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
    fGetScrollDirect(function (direction) {
        if (direction == "down") {
            $(".list-link").addClass("slide_hide").removeClass("slide_show");
        } else {
            $(".list-link").addClass("slide_show").removeClass("slide_hide");
        }
    });
});