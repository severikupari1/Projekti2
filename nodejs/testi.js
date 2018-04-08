var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
//var url = "mongodb://10.211.48.117:27017";
var url = "mongodb://projekti2:Bloblo1@ds237669.mlab.com:37669/projekti2";

MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("projekti2");
    var query = {};
    
    dbo.collection("chain").findOne({"_id": new ObjectId("5ac7ecc0f7b74235f8e9dab0")}, { _id: 1}).toArray(function(err, result) {
        if (err) throw err;
        console.log(result[0].chain.length);
       // var haku = result[0].chain[index].Transactions;
        for (var indexi = 0; indexi < result[0].chain.length; indexi++) {
            var tran = Object.keys(result[0].chain[indexi].Transactions);
            //console.log(tran.length);
            for (let transactionindex = 0; transactionindex < tran.length; transactionindex++) {
                
                console.log(result[0].chain[indexi].Transactions[transactionindex])
            }
            //console.log(result[0].chain[indexi].Transactions);
            
        }
        db.close();
      });


    //   dbo.collection("chain").find({}, { _id: 1}).toArray(function(err, result) {
    //     if (err) throw err;
    //     console.log(result[0].chain[0]);
    //     db.close();

        
    //   });

      console.log("ASD");


});