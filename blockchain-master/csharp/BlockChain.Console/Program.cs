

using System;
using System.IO;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Configuration;

using System.Net;
using System.Net.Http;
using MongoDB.Driver;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;

namespace BlockChainDemo.Console
{

    class Program
    {

       


        static void Main(string[] args)
        {
            var Client = new MongoClient(new MongoUrl("mongodb://projekti2:Bloblo1@ds237669.mlab.com:37669/projekti2"));
            var DB = Client.GetDatabase("projekti2");
            var collection = DB.GetCollection<BsonDocument>("chain");
            var filter = new BsonDocument {
     { "_id" , ObjectId.Parse("5ac7ecc0f7b74235f8e9dab0") } };

            var findOptions = new FindOptions<BsonDocument>();
            findOptions.Projection = "{'_id': 0}";
            var hakuchaini = collection.FindSync(filter, findOptions).FirstOrDefault();
            var document = BsonSerializer.Deserialize<BsonDocument>(hakuchaini);

            var kokochain = new BlockChain(document);
            //var kokochain = new BlockChain();

            var server = new WebServer(kokochain);
            //var server = new WebServer();

            System.Console.WriteLine(kokochain.GetFullChain());

            System.Console.Read();
        }



    }
}
