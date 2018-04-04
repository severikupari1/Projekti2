var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://10.211.48.117:27017";

MongoClient.connect(url, function(err, db){
    if (err) throw err;
    var dbo = db.db("tomitesti");
    var myobj = { ryhma: "BlockChain", osoite: "Opistotie2"};
    dbo.collection("chain").insertOne(myobj, function(err, res){
        if (err) throw err;
        console.log("toimii");
        db.close();
    });
});