/**
 * Created by zhphu on 2017/2/21.
 */

var ejs = require("ejs");
var path = require("path");
var fs = require('fs');
var uuidV1 = require("uuid/v1");
var logger = require("../common/log/log").logger("index");
var Promise = require('bluebird');
var mysql = require('../proxy/mysql');
var countConfig = require('../config_default').config.pageCount;
var xlsx = require('node-xlsx');


// 人员列表
exports.listPage = function (req, res) {
    var _nPage = req.params.page || 1;
    var _oCookies = req.cookies;

    if (_oCookies.user != 'admin') {
        return res.redirect('/login');
    }

    mysql.fSelect(_nPage,function (err,results) {
        if (err) {
            logger.error(err);
            return res.render("error/404");
        }
        // 获取总数
        mysql.fGetCount(function (err,count) {
            if (err) {
                logger.error(err);
                return res.render("error/404");
            }
            res.render("email/admin",{list_info:results,total_count:count[0]['COUNT(id)'],count_perpage:countConfig,now_page:_nPage},function (err, html) {
                if(err){
                    logger.error(err);
                    return res.render("error/404");
                }
                res.send(html);
            })
        });

    });
};

// 存储到数据库
exports.insertDB = function (req, res) {
    var _oDb = {
        _sUser: req.body.user,
        _sCompany: req.body.company,
        _nTel: req.body.tel,
        _sEmail: req.body.email,
    };
    mysql.fInsert(_oDb,function (err, result) {
        if (err) {
            logger.error(err);
            return res.render("error/404");
        }else {
            res.redirect(303,'/register?'+'&a=1');
        }
    });
};

// 存储到数据库英文
exports.insertDB_en = function (req, res) {
    var _oDb = {
        _sUser: req.body.user,
        _sCompany: req.body.company,
        _nTel: req.body.tel,
        _sEmail: req.body.email,
    };
    mysql.fInsert(_oDb,function (err, result) {
        if (err) {
            logger.error(err);
            return res.render("error/404");
        }else {
            res.redirect(303,'/register_en?'+'&a=1');
        }
    });
};

// 注册页面
exports.regPage = function (req, res) {
    res.render('email/register');
};

// 英文注册页面
exports.regPageEn = function (req, res) {
    res.render('email/register_en');
};

// 后台登录页面
exports.loginPage = function (req, res) {
    res.render('email/login');
};

// 文件下载
exports.downPage = function (req, res) {
    mysql.fSelectAll(function (err,results) {
        if (err) {
            logger.error(err);
            return res.render("error/404");
        }
        var _aData = [['姓名', '公司','手机','邮箱','注册时间']];
        for (var i = 0, len = results.length; i < len; i++) {
            _aData.push([results[i].user,results[i].company,results[i].tel,results[i].email,results[i].regtime]);
        }
        var buffer = xlsx.build([{name: "mySheetName", data: _aData}]); // Returns a buffer
        var filePath = './download/人员注册数据.xls';
        fs.writeFile(filePath,buffer,function (err) {
            if (err) {
                logger.error(err);
                return res.render("error/404");
            }
            res.download(filePath,function (err) {
                if (err) {
                    logger.error(err);
                    return res.render("error/404");
                }
            });
        })
    });
};

// 验证管理人员登录
exports.adminPage = function (req, res) {
    mysql.fCheck(function (err, results) {
        if (err) {
            logger.error(err);
            return res.render("error/404");
        }else {
            if (results[0].username === req.body.user && results[0].password === req.body.psd) {
                res.cookie('user','admin');
                res.redirect(303,'/admin/1');
            }else {
                res.header('Content-Type','text/html');
                res.end('<h1>用户名或者密码错误</h1>')
            }
        }
    })
};