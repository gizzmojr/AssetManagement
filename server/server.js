var http = require("http");
var mysql = require("mysql");
var url = require("url");
var express = require("express");
var app = express();

var connection = mysql.createConnection({
    host     : "",
    user     : "",
    password : "",
    database : ""
});

// Web Server
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/test', function (req, res) {
    res.set('Content-Type', 'application/json');
    connection.query(' something here ', function (error, results, fields) {
        if (error) {
            res.send(error);
        }
        res.json(results);
    });
});

app.listen(8000, function() {
    console.log('app listening on port 8000')
});

// Mysql Connection
connection.connect(function(err) {
    if (err) {
        console.error("error connecting: " + err.stack);
        return;
    }

    console.log("mysql connection id " + connection.threadId);
});
