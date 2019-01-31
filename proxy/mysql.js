var mysql = require('mysql');
var countConfig = require('../config_default').config.pageCount;
var mysqlConfig = require('../config_default').config.mysqlConfig;
var connection;
var pool  = mysql.createPool({
    host: mysqlConfig.host,
    user: mysqlConfig.user,
    password : mysqlConfig.password,
    database : 'app_mukai',
    supportBigNumbers: true
});

function fSelect(page,cb) {
    var _nStart = (page - 1) * countConfig + 1;
    var _nEnd = page * countConfig;
    pool.getConnection(function (err,connection) {
        if (err) {
        }else {
            connection.query('SELECT * FROM list WHERE id >= '+_nStart+' and id <= '+_nEnd, function (error, results, fields) {
                connection.release();
                if (error) {
                    return cb(error,null);
                }
                cb(null,results);
            });
        }
    })
}

function fInsert(oDb,cb) {
    pool.getConnection(function (err,connection) {
        if (err) {
        }else {
            var _sDate = new Date();
            var _sHours = _sDate.getHours()<10?'0'+_sDate.getHours():_sDate.getHours();
            var _sMinutes = _sDate.getMinutes()<10?'0'+_sDate.getMinutes():_sDate.getMinutes();
            var _sSeconds = _sDate.getSeconds()<10?'0'+_sDate.getSeconds():_sDate.getSeconds();
            var _sRegtime = _sDate.toLocaleDateString()+' '+_sHours+ ':'+_sMinutes+':'+_sSeconds;
            connection.query('INSERT INTO list SET ?',{ user:oDb._sUser+'',company:oDb._sCompany+'',tel:oDb._nTel+'',email:oDb._sEmail+'',regtime:_sRegtime}, function (error, results, fields) {
                connection.release();
                if (error) {
                    return cb(error,null);
                }
                cb(null,results);
            });
        }
    })
}

function fCheck(cb) {
    pool.getConnection(function (err,connection) {
        if (err) {
        }else {
            connection.query('SELECT * FROM user', function (error, results, fields) {
                connection.release();
                if (error) {
                    return cb(error,null);
                }
                cb(null,results);
            });
        }
    })
}

function fGetCount(cb) {
    pool.getConnection(function (err,connection) {
        if (err) {
        }else {
            connection.query('SELECT COUNT(id) FROM list', function (error, results, fields) {
                connection.release();
                if (error) {
                    return cb(error,null);
                }
                cb(null,results);
            });
        }
    })
}

function fSelectAll(cb) {
    pool.getConnection(function (err,connection) {
        if (err) {
        }else {
            connection.query('SELECT * FROM list', function (error, results, fields) {
                connection.release();
                if (error) {
                    return cb(error,null);
                }
                cb(null,results);
            });
        }
    })
}

module.exports = {
    fSelect,
    fInsert,
    fCheck,
    fGetCount,
    fSelectAll
};