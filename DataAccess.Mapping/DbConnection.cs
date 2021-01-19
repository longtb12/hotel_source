using Microsoft.Extensions.Configuration;
using System.Configuration;
using System.IO;
namespace DataAccess.Mapping
{
    public sealed class DbConnection
    {
        private static string _server;
        private static string _dbName;
        private static string _userId;
        private static string _password;

        public static string Get()
        {
            //if(string.IsNullOrEmpty(_server))
            //    _server = $"Server={ConfigurationManager.AppSettings["Server"]};";
            //if (string.IsNullOrEmpty(_dbName))
            //    _dbName = $"Database={ConfigurationManager.AppSettings["Database"]};";
            //if (string.IsNullOrEmpty(_userId))
            //    _userId = $"User Id={ConfigurationManager.AppSettings["UserId"]};";
            //if (string.IsNullOrEmpty(_password))
            //    _password = $"Password={ConfigurationManager.AppSettings["Password"]};";
            ////
            //return $"{_server}{_dbName}{_userId}{_password}";
            var configurationBuilder = new ConfigurationBuilder();
            var path = Path.Combine(Directory.GetCurrentDirectory(), "appsettings.json");
            configurationBuilder.AddJsonFile(path, false);
            //
            var root = configurationBuilder.Build();
            var dbConnection = root.GetSection("DbConnection");
            //
            if (string.IsNullOrEmpty(_server))
                _server = $"Server={dbConnection["Host"]};";
            if (string.IsNullOrEmpty(_dbName))
                _dbName = $"Database={dbConnection["Database"]};";
            if (string.IsNullOrEmpty(_userId))
                _userId = $"User Id={dbConnection["UserId"]};";
            if (string.IsNullOrEmpty(_password))
                _password = $"Password={dbConnection["Password"]};";
            //
            return $"{_server}{_dbName}{_userId}{_password}";
        }
    }
}
