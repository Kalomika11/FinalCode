var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");

const mongoose = require('mongoose');

mongoose.connect('mongodb://mongo:27017/KaushikDB');
var db = mongoose.connection;
db.on('error', console.log.bind(console, "connection error"));
db.once('open', function (callback) {
    console.log("connection succeeded");
})

var app = express();

var port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static('public'));

// Serve success.html
app.get('/success.html', function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'success.html'));
});

// Route to fetch sales data
app.get('/sales', function (req, res) {
    db.collection('details').find({}).toArray(function (err, result) {
        if (err) throw err;
       // console.log(result);
        res.json(result); // Send the data as JSON response
    });
});

app.post('/sales', function (req, res) {
    var saleDate = req.body.saleDate;
    var saleTime = req.body.saleTime;
    var productName = req.body.productName;
    var productId = req.body.productId;
    var category = req.body.category;
    var quantitySold = req.body.quantitySold;
    var unitPrice = req.body.unitPrice;

    var totalRevenue = unitPrice * quantitySold;

    var data = {
        "sale_date": saleDate,
        "sale_time": saleTime,
        "product_name": productName,
        "product_id": productId,
        "category": category,
        "quantity_sold": quantitySold,
        "unit_price": unitPrice,
        "total_revenue": totalRevenue
    }

    db.collection('details').insertOne(data, function (err, collection) {
        if (err) throw err;
        console.log("Data inserted Successfully");
        console.log(data);
    });

    return res.redirect('/success.html');
})

app.get('/sales', function (req, res) {
    res.set({
        'Access-control-Allow-Origin': '*'
    });
    return res.redirect('/index.html');
})

app.listen(3000, function () {
    console.log(`Server is listening at http://localhost:${port}`);
});
