var oRecommendTemplates = {
    //无图模板
    "text": "<div class='recommend recommend-article text'>\
                <a class='recommend-link clearfix' href='{domain}/info/article/{article_id}'>\
                    <div class='desc'>\
                        <p class='relate-article-title line-2 vertical-ellipsis'>{article_title}</p>\
                    </div>\
                    <div class='relate-article-info'>\
                        <div class='relate-article-info-content clearfix'>\
                            <p class='relate-article-source'>{article_media}</p>\
                            <p class='relate-article-comments-num'>{comments_num}</p>\
                        </div>\
                    </div>\
                </a>\
             </div>",

    //单图模板
    "pic-text": "<div class='recommend recommend-article'>\
                    <a class='recommend-link clearfix' href='{domain}/info/article/{article_id}'>\
                       <div class='desc'>\
                           <p class='relate-article-title line-2 vertical-ellipsis'>{article_title}</p>\
                       </div>\
                       <div class='relate-article-info half'>\
                            <div class='relate-article-info-content clearfix'>\
                                <p class='relate-article-source'>{article_media}</p>\
                                <p class='relate-article-comments-num'>{comments_num}</p>\
                            </div>\
                       </div>\
                       <div class='img-wrapper'>\
                           <img src='{pic_url}' alt=''>\
                       </div>\
                    </a>\
                </div>",

    //三图模板
    //"pics-text" : "<div class='recommend recommend-article'>\
    //                   <a class='recommend-link clearfix' href='/info/article/{article_id}'>\
    //                       <p class='relate-article-title line-2 vertical-ellipsis'>{article_title}</p>\
    //                       <div class='images-wrapper'>\
    //                           <ul class='images-list clearfix'>\
    //                               <li><span class='image-box'><img src='{pic_url_1}' alt=''></span></li>\
    //                               <li><span class='image-box'><img src='{pic_url_2}' alt=''></span></li>\
    //                               <li><span class='image-box'><img src='{pic_url_1}' alt=''></span></li>\
    //                           </ul>\
    //                        </div>\
    //                       <div class='relate-article-info'>\
    //                           <div class='relate-article-info-content clearfix'>\
    //                               <p class='relate-article-source'>{article_media}</p>\
    //                               <p class='relate-article-comments-num'>{comments_num}</p>\
    //                           </div>\
    //                       </div>\
    //                   </a>\
    //               </div>",

    //视频模板
    "video-text": "<div class='recommend recommend-article'>\
                        <a class='recommend-link clearfix' href='{domain}/info/article/{article_id}'>\
                           <div class='desc'>\
                               <p class='relate-article-title line-2 vertical-ellipsis'>{article_title}</p>\
                           </div>\
                           <div class='relate-article-info half'>\
                                <div class='relate-article-info-content clearfix'>\
                                    <p class='relate-article-source'>{article_media}</p>\
                                    <p class='relate-article-comments-num'>{comments_num}</p>\
                                </div>\
                           </div>\
                           <div class='img-wrapper'>\
                               <img src='{pic_url}' alt=''>\
                               <div class='video-time'><span class='triangle'></span><span class='video-long'>{video_time}</span></div>\
                           </div>\
                        </a>\
                    </div>"
};

//评论模板
var sCommentTemplate = "<div class='comment'>\
                            <div class='avatar' style='{bg_avatar}'></div>\
                            <div class='name ellipsis'>{uname}</div>\
                            <div class='comment-time'>{comment_time}</div>\
                            <div class='content'>\
                                <p class='comment-text line-6 vertical-ellipsis'>{comments_content}</p>\
                            </div>\
                            <div class='btn-comment-like app-link'>\
                                <span class='icon-like off'></span>\
                                <span class='comment-like-num'>&nbsp;{comment_like_num}</span>\
                            </div>\
                         </div>";

var AsyncUtil = (function () {
    //获取评论
    function fGetComments() {
        $.ajax({
            type: "GET",
            url: share.domain+"/comment/list?topicId=" + share.nTopicId + "&offset=1&count=3",
            data: {},
            dataType: "json",
            success: function (res) {
                if (res.errorCode) {
                    return false;
                }
                var _aComments = res.data;
                fShowComments(_aComments)
            }
        });
    }

    //展示评论
    function fShowComments(_aComments) {
        var _aTemArr = [],
            _sFirstStr = '<h2 class="title">热门评论</h2><div class="comments"><div class="comment">',
            _sLastStr = '</div></div>';
        if (_aComments.length != 0) {
            for (var i = 0; i < _aComments.length; i++) {
                var _sAvatar = _aComments[i].pic ? "background-image:url(" + _aComments[i].pic + ")" : "";
                var _sComment = sCommentTemplate.format({
                    bg_avatar: _sAvatar,
                    uname: _aComments[i].userName,
                    comment_time: CommonUtil.translateTime(_aComments[i].createTime),
                    comments_content: _aComments[i].content,
                    comment_like_num: _aComments[i].diggCount
                });
                _aTemArr.push(_sComment);
            }
            var _sTem = _aTemArr.join();
            var _sTotalStr = _sFirstStr + _sTem + _sLastStr;
            $('#commentsContent').html(_sTotalStr);
        }   
    }

    //获取点赞，评论数
    function fGetCommentsNum() {
        $.ajax({
            type: "GET",
            url: share.domain+"/topic/getPopularity?topicId=" + share.nTopicId,
            data: {},
            dataType: "json",
            success: function (res) {
                if (res.errorCode) {
                    return false;
                }
                var _oCommentsNum = res.data;
                fShowCommentsNum(_oCommentsNum);
            }
        });
    }

    //展示点赞，评论数
    function fShowCommentsNum(_oCommentsNum) {
        var $oCommentsMore = $(".comments-more.app-link");
        if (_oCommentsNum.commentCount != 0) {
            $oCommentsMore.text('打开松鼠，查看全部' + _oCommentsNum.commentCount + '条评论');
        } else {
            $oCommentsMore.text("打开松鼠，发表评论");
        }
        if(share.nType == 6){
            $("#emojs .emoj-count.bad-count").text(_oCommentsNum.badCount);
            $("#emojs .emoj-count.amazing-count").text(_oCommentsNum.amazingCount);
        }else{
            $("#emojs .emoj-count.amazing-count").text(_oCommentsNum.amazingCount);
            $("#emojs .emoj-count.turn-count").text(_oCommentsNum.turnCount);
            $("#emojs .emoj-count.bad-count").text(_oCommentsNum.badCount);
            $("#emojs .emoj-count.headline-count").text(_oCommentsNum.headlineCount);
            $("#emojs .emoj-count.what-count").text(_oCommentsNum.whatCount);
        }  
    }

    //获取推荐
    function fGetRecommends(option){
        if(share.nType == 3){
            var _feedstpl = 3,
            _contenttpl = 4
        }else{
            var _feedstpl = 1,
            _contenttpl = 1
        }
        $.ajax({
             type: "POST",
             url: share.domain+"/engine/share",
             data: JSON.stringify({
                 channel: 0,
                 count: 15,
                 feedstpl: _feedstpl,
                 contenttpl: _contenttpl,
                 cookieid: option.uid,
                 newsid: option.newsId
             }),
            success: function (res) {
                if(typeof(res) == "string"){
                    var _oData = JSON.parse(res);
                }else if(typeof(res) == "object"){
                    var _oData = res;
                }
                if (_oData.errorCode) {
                    return false;
                }
                var _aRecommends = _oData.articles;
                fShowRecommends(_aRecommends);  
            }
        });
    }

    //展示推荐
    function fShowRecommends(_aRecommends,_sDomain){
        var _aTemArr = [],
            _sLastStr = '<!--</div><p class="recommend-more app-link">打开搜狐新闻资讯版，查看更多</p>-->';
        var _sFirstStr = '<h2 class="title">相关参考</h2><div class="recommends">';
        if (_aRecommends.length!=0) {
            var _sRecommend = '';
            for (var i = 0; i < _aRecommends.length; i++) {
                if(_aRecommends[i].commentNum == 0){
                    _aRecommends[i].commentNum = ""
                }else{
                    _aRecommends[i].commentNum = _aRecommends[i].commentNum + '评'
                }
                if(_aRecommends[i].videos){
                    _sRecommend = oRecommendTemplates['video-text'].format({
                        domain: _sDomain,
                        article_id: _aRecommends[i].newsId,
                        article_title: _aRecommends[i].title,
                        article_media: _aRecommends[i].mediaName,
                        pic_url: _aRecommends[i].pics[0].url,
                        comments_num: _aRecommends[i].commentNum,
                        video_time: fGetVideoTime(_aRecommends[i].videos[0].duration)
                    });
                }else if(_aRecommends[i].pics && _aRecommends[i].pics.length && _aRecommends[i].pics[0].url){
                    _sRecommend = oRecommendTemplates['pic-text'].format({
                        domain: _sDomain,
                        article_id: _aRecommends[i].newsId,
                        article_title: _aRecommends[i].title,
                        article_media: _aRecommends[i].mediaName,
                        pic_url: _aRecommends[i].pics[0].url,
                        comments_num: _aRecommends[i].commentNum
                    })
                }else{
                    _sRecommend = oRecommendTemplates['text'].format({
                        domain: _sDomain,
                        article_id: _aRecommends[i].newsId,
                        article_title: _aRecommends[i].title,
                        article_media: _aRecommends[i].mediaName,
                        comments_num: _aRecommends[i].commentNum
                    });
                }
                _aTemArr.push(_sRecommend);
            }
        }
        var _sTem = _aTemArr.join();
        var _sTotalStr = _sFirstStr + _sTem + _sLastStr;
        $('#recommendContent').html(_sTotalStr);
    }

    //处理视频播放时间
    function fGetVideoTime(timestamp) {
        var _nTime = parseInt(timestamp);
        var _nSecond = parseInt(_nTime % 60);
        var _nMinute = parseInt(_nTime / 60);
        var _nHour = parseInt(_nTime / 3600);

        if (_nMinute >= 60) {
            _nMinute = parseInt(_nTime % 60);
        }
        var _sSecond = _nSecond < 10 ? "0" + _nSecond : _nSecond;
        var _sMinute = _nMinute < 10 ? "0" + _nMinute : _nMinute;

        var _sResult = "";
        if (_nHour == 0) {
            _sResult = _sMinute + ":" + _sSecond;
        } else if (_nHour < 10) {
            _sResult = "0" + _nHour + ":" + _sMinute + ":" + _sSecond;
        } else {
            _sResult = _nHour + ":" + _sMinute + ":" + _sSecond;
        }
        return _sResult;
    }

    return {
        getComments: fGetComments,
        getCommentsNum: fGetCommentsNum,
        getRecommends: fGetRecommends,
        showRecommends: fShowRecommends
    }
})();
