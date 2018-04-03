using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BlockChainDemo
{
    class SaveToDb
    {
        private static async Task MainAsync(BlockChain chain)
        {

            var client = new MongoClient(new MongoUrl("mongodb://localhost:27017"));

            IMongoDatabase db = client.GetDatabase("projekti2");
            //var collection = db.GetCollection<BsonDocument>("chain");

            var document = BsonSerializer.Deserialize<BsonDocument>(chain.GetFullChain());
            var collection = db.GetCollection<BsonDocument>("chain");
            await collection.InsertOneAsync(document);

            // await collection.InsertOneAsync(document);
        }
    }
}
