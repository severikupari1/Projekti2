
using MySql.Data.MySqlClient;
using System;
using System.IO;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Configuration;
using System.IO;
using System.Net;
using System.Net.Http;
namespace BlockChainDemo.Console
{
    class Program
    {


        static void Main(string[] args)
        {
            var chain = new BlockChain();


            String json = JsonConvert.SerializeObject(response);

            var server = new WebServer(chain);

            


            //string connStr = "server = 160.153.129.223; user id = bloblo;Pwd=bloblo; database = bloblo;encrypt = no ";
            string connStr = "server = codez.savonia.fi;Pwd=p22018kg5; user id = p22018kg5; database = projekti2_2018_kevat_group5;encrypt = no";
            MySqlConnection conn = new MySqlConnection(connStr);
            try
            {
                System.Console.WriteLine("Connecting to MySQL...");
                conn.Open();

                string sql = "SELECT * from asd where 1";
                MySqlCommand cmd = new MySqlCommand(sql, conn);
                MySqlDataReader rdr = cmd.ExecuteReader();

                while (rdr.Read())
                {
                    System.Console.WriteLine(rdr[0] + " -- " );
                }
                rdr.Close();
            }
            catch (Exception ex)
            {
                System.Console.WriteLine(ex.ToString());
            }

            conn.Close();
            System.Console.WriteLine("Done.");



            //try
            //{
            //    System.Console.WriteLine("Connecting to MySQL...");
            //    conn.Open();

            //    string sql = "SELECT * from  where 1";
            //    MySqlCommand cmd = new MySqlCommand(sql, conn);

            //    MySqlDataReader rdr = cmd.ExecuteReader();

            //    while (rdr.Read())
            //    {
            //        System.Console.WriteLine(rdr[0] + " -- " + rdr[1]);
            //    }
            //    rdr.Close();
            //}
            //catch (Exception ex)
            //{
            //    System.Console.WriteLine(ex.ToString());
            //}

            //conn.Close();
            //System.Console.WriteLine("Done.");



            System.Console.Read();
        }
    }
}
