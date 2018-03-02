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

        //https://www.codeproject.com/Articles/43438/Connect-C-to-MySQL

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


        //open connection to database
        private bool OpenConnection()
        {
            try
            {
                connection.Open();
                return true;
            }
            catch (MySqlException ex)
            {
                //When handling errors, you can your application's response based 
                //on the error number.
                //The two most common error numbers when connecting are as follows:
                //0: Cannot connect to server.
                //1045: Invalid user name and/or password.
                switch (ex.Number)
                {
                    case 0:
                        Console.WriteLine("Cannot connect to server.  Contact administrator"); 
                        break;

                    case 1045:
                        Console.WriteLine("Invalid username/password, please try again");
                        break;
                }
                return false;
            }
        }


        //Close connection
        private bool CloseConnection()
        {
            try
            {
                connection.Close();
                return true;
            }
            catch (MySqlException ex)
            {
                Console.WriteLine(ex.Message);
                return false;
            }
        }

        //Insert statement
        public void Insert()
        {
            string query = "INSERT INTO tableinfo (name, age) VALUES('John Smith', '33')";

            //open connection
            if (this.OpenConnection() == true)
            {
                //create command and assign the query and connection from the constructor
                MySqlCommand cmd = new MySqlCommand(query, connection);

                //Execute command
                cmd.ExecuteNonQuery();

                //close connection
                this.CloseConnection();
            }
        }

        //Update statement
        public void Update()
        {
            string query = "UPDATE tableinfo SET name='Joe', age='22' WHERE name='John Smith'";

            //Open connection
            if (this.OpenConnection() == true)
            {
                //create mysql command
                MySqlCommand cmd = new MySqlCommand();
                //Assign the query using CommandText
                cmd.CommandText = query;
                //Assign the connection using Connection
                cmd.Connection = connection;

                //Execute query
                cmd.ExecuteNonQuery();

                //close connection
                this.CloseConnection();
            }
        }

        //Delete statement
        public void Delete()
        {
            string query = "DELETE FROM tableinfo WHERE name='John Smith'";

            if (this.OpenConnection() == true)
            {
                MySqlCommand cmd = new MySqlCommand(query, connection);
                cmd.ExecuteNonQuery();
                this.CloseConnection();
            }
        }



    }
}
