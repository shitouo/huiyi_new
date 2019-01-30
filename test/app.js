var express = require('express');
var xlsx = require('node-xlsx');
var fs = require('fs');

var app = express();

const data = [[1, 2, 3], [true, false, null, 'sheetjs'], ['foo', 'bar', new Date('2014-02-19T14:30Z'), '0.3'], ['baz', null, 'qux']];
var buffer = xlsx.build([{name: "mySheetName", data: data}]); // Returns a buffer
// fs.writeFileSync("Group.xlsx", buffer, 'binary');
app.get('/',function (req, res) {
    res.set({
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': 'attachment; filename='+'list.xlsx'
    });
    res.send(buffer);
})

app.listen(9000,function (err) {
    if (err) throw err;
    console.log('server is runing');
})