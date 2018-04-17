var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
//var url = "mongodb://10.211.48.117:27017";
var kokochain;
var url = "mongodb://projekti2:Bloblo1@ds237669.mlab.com:37669/projekti2";

MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("projekti2");
   
    dbo.collection("chain").find({"_id": new ObjectId("5ac7ecc0f7b74235f8e9dab0")}, { _id: 1}).toArray(function(err, result) {
        if (err) throw err;
        
       kokochain = result[0];

        db.close();
      });
});