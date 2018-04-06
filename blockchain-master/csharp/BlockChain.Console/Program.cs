
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
    

            System.Console.Read();
        }

     

    }
}
