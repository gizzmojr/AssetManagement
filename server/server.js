var http = require("http");
var mysql = require("mysql");
var url = require("url");
var express = require("express");
var app = express();

var connection = mysql.createConnection({
    host     : "localhost",
    user     : "root",
    password : "password",
    database : "assets"
});

// Web Server
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/all', function (req, res) {
    res.set('Content-Type', 'application/json');
    connection.query('SELECT Asset.barcode, Asset.status, Category.category, Employee.firstName, Location.location, AssetType.type, Asset.created, Asset.lastUpdate, Asset.serial, AssetType.nsn, Account.account, Asset.warrantyStart, Asset.warrantyEnd, Asset.configuration FROM assets.Asset AS Asset, assets.AssetType AS AssetType, assets.Employee AS Employee, assets.Location AS Location, assets.Category AS Category, assets.Account AS Account WHERE Asset.typeId = AssetType.id AND Asset.employeeId = Employee.id AND Asset.locationId = Location.id AND Asset.categoryId = Category.id AND Asset.accountID = Account.id', function (error, results, fields) {
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
