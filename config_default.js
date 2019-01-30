/**
 * Created by zhphu on 2016/11/28.
 */

// 通过NODE_ENV来设置环境变量，如果没有指定则默认为生产环境
var env = (process.env.NODE_ENV || 'production').toLowerCase();

// 载入配置文件
var config = './config/m/'+env;
exports.config = require(config);
