
using MySql.Data.MySqlClient;
using System;
using System.Threading.Tasks;

namespace BlockChainDemo.Console
{
    class Program
    {

      
        static void Main(string[] args)
        {
            var chain = new BlockChain();
            var server = new WebServer(chain);

            string connStr = "server = 160.153.129.223; user id = bloblo;Pwd=bloblo; database = bloblo;encrypt = no ";
           MySqlConnection conn = new MySqlConnection(connStr);
            try
            {
                System.Console.WriteLine("Connecting to MySQL...");
                conn.Open();

                string sql = "SELECT * from example where 1";
                MySqlCommand cmd = new MySqlCommand(sql, conn);
                MySqlDataReader rdr = cmd.ExecuteReader();

                while (rdr.Read())
                {
                    System.Console.WriteLine(rdr[0] + " -- " + rdr[1]);
                }
                rdr.Close();
            }
            catch (Exception ex)
            {
                System.Console.WriteLine(ex.ToString());
            }

            conn.Close();
            System.Console.WriteLine("Done.");
            System.Console.Read();
        }
    }
}
