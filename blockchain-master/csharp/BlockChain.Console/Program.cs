
using MySql.Data.MySqlClient;
using System;
using System.IO;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Configuration;
using System.IO;
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
            var hakuchaini = collection.FindSync(filter,findOptions).FirstOrDefault();
            var document = BsonSerializer.Deserialize<BsonDocument>(hakuchaini);

            System.Console.WriteLine(document);
     
            var chain = new BlockChain();

            var s = chain.GetFullChain();
            System.Console.WriteLine(s);

            System.IO.File.WriteAllText("file.json", s);


            var readS = System.IO.File.ReadAllText("file.json");
            BlockChain readChain = Newtonsoft.Json.JsonConvert.DeserializeObject<BlockChain>(readS);

            var server = new WebServer(chain);
            


            System.Console.Read();
        }

     

    }
}
