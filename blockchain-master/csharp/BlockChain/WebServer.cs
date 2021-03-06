﻿using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.NetworkInformation;
using System.Net.Sockets;
using System.Threading.Tasks;


namespace BlockChainDemo
{
    public class WebServer
    {



        private static async Task InsertToDatabase(BlockChain chain)
        {

            //var client = new MongoClient(new MongoUrl("mongodb://localhost:27017"));

            var client = new MongoClient(new MongoUrl("mongodb://projekti2:Bloblo1@ds237669.mlab.com:37669/projekti2"));
            IMongoDatabase db = client.GetDatabase("projekti2");
            //var collection = db.GetCollection<BsonDocument>("chain");

            //var document = BsonSerializer.Deserialize<BsonDocument>(chain.GetFullChain());

            var document = BsonSerializer.Deserialize<BsonDocument>(chain.GetFullChain());

            var collection = db.GetCollection<BsonDocument>("chain");
            await collection.InsertOneAsync(document);

            // await collection.InsertOneAsync(document);
        }

        static async Task FindAllFromChain()
        {
            // var client = new MongoClient(new MongoUrl("mongodb://localhost:27017"));
            var client = new MongoClient(new MongoUrl("mongodb://projekti2:Bloblo1@ds237669.mlab.com:37669/projekti2"));
            IMongoDatabase db = client.GetDatabase("projekti2");
            var collection = db.GetCollection<BsonDocument>("chain");
            //ObjectId.Parse("5ac4899f623fca2184f4de56")
            using (IAsyncCursor<BsonDocument> cursor = await collection.FindAsync(new BsonDocument {
     { "_id" , ObjectId.Parse("5ac7ecc0f7b74235f8e9dab0") } }))
            {
                while (await cursor.MoveNextAsync())
                {
                    IEnumerable<BsonDocument> batch = cursor.Current;
                    foreach (BsonDocument document in batch)
                    {
                        Console.WriteLine(document);
                        Console.WriteLine();
                    }
                }
            }

        }


        static async Task CallMain(BlockChain chain)
        {
            //var conString = "mongodb://localhost:27017";
            //var Client = new MongoClient(conString);
            var Client = new MongoClient(new MongoUrl("mongodb://projekti2:Bloblo1@ds237669.mlab.com:37669/projekti2"));
            var DB = Client.GetDatabase("projekti2");
            var collection = DB.GetCollection<BsonDocument>("chain");
            var document = BsonSerializer.Deserialize<BsonDocument>(chain.GetFullChain());



            //retrive the data from collection
            Console.WriteLine(document);

            collection.FindOneAndReplace(new BsonDocument {
     { "_id" , ObjectId.Parse("5ac7ecc0f7b74235f8e9dab0") } }, document);

        }

        public void FindAndSave(BlockChain chain)
        {
            var Client = new MongoClient(new MongoUrl("mongodb://projekti2:Bloblo1@ds237669.mlab.com:37669/projekti2"));
            var DB = Client.GetDatabase("projekti2");
            var collection = DB.GetCollection<BsonDocument>("chain");
            var document = BsonSerializer.Deserialize<BsonDocument>(chain.GetFullChain());

            Console.WriteLine(document);

            collection.FindOneAndReplace(new BsonDocument {
     { "_id" , ObjectId.Parse("5ac7ecc0f7b74235f8e9dab0") } }, document);

        }


      

        static void AddUpdateAppSettings(string key, string value)
        {
            try
            {
                var configFile = ConfigurationManager.OpenExeConfiguration(ConfigurationUserLevel.None);
                var settings = configFile.AppSettings.Settings;
                if (settings[key] == null)
                {
                    settings.Add(key, value);
                }
                else
                {
                    settings[key].Value = value;
                }
                configFile.Save(ConfigurationSaveMode.Modified);
                ConfigurationManager.RefreshSection(configFile.AppSettings.SectionInformation.Name);
            }
            catch (ConfigurationErrorsException)
            {
                Console.WriteLine("Error writing app settings");
            }
        }

        static void ReadAllSettings()
        {
            try
            {
                var appSettings = ConfigurationManager.AppSettings;

                if (appSettings.Count == 0)
                {
                    Console.WriteLine("AppSettings is empty.");
                }
                else
                {
                    foreach (var key in appSettings.AllKeys)
                    {
                        Console.WriteLine("Key: {0} Value: {1}", key, appSettings[key]);
                    }
                }
            }
            catch (ConfigurationErrorsException)
            {
                Console.WriteLine("Error reading app settings");
            }
        }

        public static string GetLocalIPv4(NetworkInterfaceType _type)
        {
            string output = "";
            foreach (NetworkInterface item in NetworkInterface.GetAllNetworkInterfaces())
            {
                if (item.NetworkInterfaceType == _type && item.OperationalStatus == OperationalStatus.Up)
                {
                    foreach (UnicastIPAddressInformation ip in item.GetIPProperties().UnicastAddresses)
                    {
                        if (ip.Address.AddressFamily == AddressFamily.InterNetwork)
                        {
                            output = ip.Address.ToString();
                        }
                    }
                }
            }
            return output;
        }





        public WebServer(BlockChain chain)
        {
            ReadAllSettings();
            AddUpdateAppSettings("host", GetLocalIPv4(NetworkInterfaceType.Ethernet));
            var settings = ConfigurationManager.AppSettings;
            //ApplySettings("host", hosti);
            string host = settings["host"]?.Length > 1 ? settings["host"] : "localhost";
            string port = settings["port"]?.Length > 1 ? settings["port"] : "12345";
            ReadAllSettings();
            //Console.ReadKey();
            
            var server = new TinyWebServer.WebServer(request =>
                {
                    // HttpContent testi;
                    //request.Headers.Set("Access-Control-Allow-Origin", "*");
                    //request.Headers.Add("Access-Control-Allow-Origin", "*");
                    string path = request.Url.PathAndQuery.ToLower();
                    string query = "";
                    string json = "";
                    if (path.Contains("?"))
                    {
                        string[] parts = path.Split('?');
                        path = parts[0];
                        query = parts[1];
                    }

                    switch (path)
                    {
                        //GET: http://localhost:12345/mine
                        case "/mine":
                            //FindAndSave(chain);
                            return chain.Mine();

                        //POST: http://localhost:12345/transactions/new
                        //{ "Amount":123, "Recipient":"ebeabf5cc1d54abdbca5a8fe9493b479", "Sender":"31de2e0ef1cb4937830fcfd5d2b3b24f" }
                        case "/transactions/new":
                           


                            if (request.HttpMethod != HttpMethod.Post.Method)
                                return $"{new HttpResponseMessage(HttpStatusCode.MethodNotAllowed)}";
                            
                            json = new StreamReader(request.InputStream).ReadToEnd();
                            Transaction trx = JsonConvert.DeserializeObject<Transaction>(json);
                            int blockId = chain.CreateTransaction(trx.Sender, trx.Recipient, trx.Amount);
                           
                            //var s = chain.GetFullChain();
                           // System.Console.WriteLine(s);
                           
                            //System.IO.File.WriteAllText("file.json", s);
                            //FindAndSave(chain);
                            return $"Your transaction will be included in block {blockId}";

                        //GET: http://localhost:12345/chain
                        case "/chain":
                            return chain.GetFullChain();

                        //POST: http://localhost:12345/nodes/register
                        //{ "Urls": ["localhost:54321", "localhost:54345", "localhost:12321"] }
                        case "/nodes/register":
                            if (request.HttpMethod != HttpMethod.Post.Method)
                                return $"{new HttpResponseMessage(HttpStatusCode.MethodNotAllowed)}";
                            //request.Headers.Add("Access-Control-Allow-Origin", "*");
                            
                            json = new StreamReader(request.InputStream).ReadToEnd();
                            var urlList = new { Urls = new string[0] };
                            var obj = JsonConvert.DeserializeAnonymousType(json, urlList);
                            return chain.RegisterNodes(obj.Urls);

                        //GET: http://localhost:12345/nodes/resolve
                        case "/nodes/resolve":
                            return chain.Consensus();

                        case "/tallenna":
                            //InsertToDatabase(chain).Wait();
                            FindAndSave(chain);
                            return "Tallennettiin tietokantaan";

                        case "/testi":
                            //MainAsync(chain).Wait();
                            //FindAllFromChain().Wait();
                            // CallMain(chain).Wait();
                            //InsertToDatabase(chain).Wait();
                            FindAndSave(chain);
                            return $"Tallennettiin tietokantaan,haku tietokannasta{chain.GetFullChain()}";


                    }

                    return "";
                },
                $"http://{host}:{port}/mine/",
                $"http://{host}:{port}/transactions/new/",
                $"http://{host}:{port}/chain/",
                $"http://{host}:{port}/nodes/register/",
                $"http://{host}:{port}/nodes/resolve/",
                $"http://{host}:{port}/testi/", //Added by Severi
                $"http://{host}:{port}/tallenna/"
            );

            server.Run();
        }
    }



}
