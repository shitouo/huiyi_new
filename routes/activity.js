var express = require('express');
var router = express.Router();
var email = require('../controller/email');

// 注册页面
router.get('/register',email.regPage);

// 英文注册页面
router.get('/register_en',email.regPageEn);

// 接收注册数据
router.post('/register',email.insertDB);

// 接收英文注册数据
router.post('/register_en',email.insertDB_en);

// 后台登录页面
router.get('/login',email.loginPage);

// 登录处理
router.post('/login',email.adminPage);

// 管理界面
router.get('/admin/:page',email.listPage);

// 文件下载
router.get('/down/:page',email.downPage);

module.exports = router;
