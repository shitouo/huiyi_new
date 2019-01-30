/**
 * Created by zhphu on 2017/02/21.
 */
var express = require('express');
var path = require('path');
var compression = require("compression");
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require("./config_default").config;
var indexRouter = require("./"+config.path.routes);


var app = express();

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//路由控制
app.use("/", indexRouter);

//静态资源服务器
app.use("/public", express.static(path.join(__dirname, 'public')));

//前端静态资源文件根目录
if (config.path.baseUrl) {
  app.locals.baseUrl = config.path.baseUrl;
}

//前端请求地址
if (config.domain) {
  app.locals.domain = config.domain;
}

//渲染模板
if(config.path.views){
  app.set('views', path.join(__dirname, config.path.views));
  app.set('view engine', 'ejs');
}

// 同步views库中的ejs文件名到redis数据库
/*synEjsPath();*/

// 404异常捕获
app.use(function (req, res, next) {
  var err = new Error('Page Not Found');
  res.render('error/404', {
    message: err.message,
    title: '404',
    error: {
      status: '404',
      stack: 'We looked everywhere but we could not find it!'
    }
  });
});


// 500异常捕获
app.use(function (err, req, res, next) {
  err = new Error('Server Error');
  res.render('error/500', {
    message: err.message,
    title: '500',
    error: {
      status: '500',
      stack: 'Some problems with our Server,sorry!'
    }
  });
});

var server = app.listen(config.port, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s start...', host, port);
});
module.exports = app;
