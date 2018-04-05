var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://10.211.48.117:27017";

MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("projekti2");
    var query = {};
    dbo.collection("chain").find({}, { _id: 1}).toArray(function(err, result) {
        if (err) throw err;
        console.log(result[0].chain[1].Transactions);
        db.close();
      });
});