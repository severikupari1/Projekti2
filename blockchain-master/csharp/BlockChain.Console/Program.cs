
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

            string connStr = "server=codez.savonia.fi;user=p22018kg5;database=projekti2_2018_kevat_group5;port=3306;password=p22018kg5";
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
