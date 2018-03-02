using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BlockChainDemo
{
    class DataBase
    {
        private MySqlConnection connection;
        private string server;
        private string database;
        private string userid;
        private string password;
        private string encrypt;
       // string connStr = "server = codez.savonia.fi;Pwd=p22018kg5; user id = p22018kg5; database = projekti2_2018_kevat_group5;encrypt = no";



        private void InitializeConnection() {
            server = "codez.savonia.fi";
            database = "projekti2_2018_kevat_group5";
            userid = "p22018kg5";
            password = "p22018kg5";
            encrypt = "no";

            string connectionString;

            connectionString = "SERVER=" + server + ";" + "DATABASE=" +
            database + ";" + "user id=" + userid + ";" + "PASSWORD=" + password + ";" + "encrypt=" + encrypt + ";";

            connection = new MySqlConnection(connectionString);

        }


        public void OpenConnection()
        {

        }
       

    }
}
