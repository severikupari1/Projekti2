
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
            var chain = new BlockChain();

            var s = chain.GetFullChain();
            System.Console.WriteLine(s);

            System.IO.File.WriteAllText("file.json", s);


            var readS = System.IO.File.ReadAllText("file.json");
            BlockChain readChain = Newtonsoft.Json.JsonConvert.DeserializeObject<BlockChain>(readS);

            var server = new WebServer(chain);


            // string connStr = "server = codez.savonia.fi;Pwd=p22018kg5; user id = p22018kg5; database = projekti2_2018_kevat_group5;encrypt = no";

            //var connectionDb = new DataBase();

            var client = new MongoClient(new MongoUrl("mongodb://localhost:27017"));


            IMongoDatabase db = client.GetDatabase("projekti2");
            //System.Console.ReadKey();
            MainAsync(chain).Wait();



            System.Console.Read();
        }


        static async Task MainAsync(BlockChain chain)
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
