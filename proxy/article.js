/**
 * Created by zhphu on 2017/02/21.
 */
var request = require('request');
var async = require("async");
var db = require("../common/redis");

function getArticleInfoById(articleId,callback){
    request.get({url: "http://c.cdn.sohu.com/article/"+articleId}, function (err, response, body) {
        if (err) {
            return callback(err);
        }
        if(body){
            var _oArticleInfo = JSON.parse(body);
            return callback(null,_oArticleInfo)
        }
        return callback(null,null);
    });
}
function checkArticleByVersion(articleType,articleId,callback){
    async.parallel([
        function(callback){
            db.fGetVerByType(articleType,function (err,result) {
                if (err) {
                    return callback(err);
                }
                return callback(err,result);
            })
        },function(callback){
            db.fGetVerById(articleId,function (err, result) {
                if (err) {
                    return callback(err);
                }
                return callback(err,result);
            })
        }
    ],function (err, results){
        if(err){
           return callback(err);
        }
        var _resByType = results[0];
        var _resById = results[1];
        if(_resByType == _resById){
            return callback(null,true);
        }
        return callback(null,false);
    });
}

module.exports = {
    getArticleInfoById : getArticleInfoById,
    checkArticleByVersion : checkArticleByVersion
};