var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://10.211.48.117:27017";

MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("projekti2");
    var query = {};
    dbo.collection("chain").find( {chain : {$all: ["Transactions"]}}, function (err, result) {
        if (err) throw err;
        console.log(result);
        db.close();
    });
});