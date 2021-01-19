using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using DataAccess.Mapping;
using DataAccess.Repositories.Interfaces;
using System.Reflection;
using System.Xml;
using System;
using System.Threading.Tasks;

namespace DataAccess.Repositories.Implementations
{
    public class Repository : IRepository
    {
        private readonly string _connectionString;
        private readonly SqlConnection _connection;

        /// <summary>Initializes a new instance of the <see cref="T:System.DataAccess.Repositories.Implementations.Repository"/> class.</summary>
        public Repository()
        {
            _connectionString = DbConnection.Get();
            _connection = new SqlConnection(_connectionString);
        }

        #region ExecuteNonQuery

        /// <summary>
        /// Execute a SqlCommand (that returns no resultset and takes no parameters) against the database specified in 
        /// the connection string. 
        /// </summary>
        /// <remarks>
        /// e.g.:  
        ///  int result = ExecuteNonQuery(CommandType.StoredProcedure, "PublishOrders");
        /// </remarks>
        /// <param name="commandType">the CommandType (stored procedure, text, etc.)</param>
        /// <param name="commandText">the stored procedure name or T-SQL command</param>
        /// <returns>an int representing the number of rows affected by the command</returns>
        public async Task<int> ExecuteNonQuery(CommandType commandType, string commandText)
        {
            //pass through the call providing null for the set of SqlParameters
            return await ExecuteNonQuery(commandType, commandText, null);
        }

        /// <summary>
        /// Execute a SqlCommand (that returns no resultset) against the database specified in the connection string 
        /// using the provided parameters.
        /// </summary>
        /// <remarks>
        /// e.g.:  
        ///  int result = ExecuteNonQuery(CommandType.StoredProcedure, "PublishOrders", new SqlParameter("@prodid", 24));
        /// </remarks>
        /// <param name="commandType">the CommandType (stored procedure, text, etc.)</param>
        /// <param name="commandText">the stored procedure name or T-SQL command</param>
        /// <param name="commandParameters">an array of SqlParamters used to execute the command</param>
        /// <returns>an int representing the number of rows affected by the command</returns>
        public async Task<int> ExecuteNonQuery(CommandType commandType, string commandText, params SqlParameter[] commandParameters)
        {
            try
            {
                //using (var sqlConnection = new SqlConnection(_connectionString))
                //{
                //    //create & open a SqlConnection, and dispose of it after we are done.
                    
                //    //call the overload that takes a connection in place of the connection string
                //    //sqlConnection.Open();
                //    return SqlServerDataAccess.ExecuteNonQuery(sqlConnection, commandType, commandText, commandParameters);
                //}

                return await SqlServerDataAccess.ExecuteNonQuery(_connection, commandType, commandText, commandParameters);

            }
            catch (Exception e)
            {
                throw e;
            }
            //finally
            //{
            //    _connection.Dispose();
            //    _connection.Close();
            //}
        }

        /// <summary>
        /// Execute a stored procedure via a SqlCommand (that returns no resultset) against the database specified in 
        /// the connection string using the provided parameter values.  This method will query the database to discover the parameters for the 
        /// stored procedure (the first time each stored procedure is called), and assign the values based on parameter order.
        /// </summary>
        /// <remarks>
        /// This method provides no access to output parameters or the stored procedure's return value parameter.
        /// 
        /// e.g.:  
        ///  int result = ExecuteNonQuery("PublishOrders", 24, 36);
        /// </remarks>
        /// <param name="spName">the name of the stored prcedure</param>
        /// <param name="parameterValues">an array of objects to be assigned as the input values of the stored procedure</param>
        /// <returns>an int representing the number of rows affected by the command</returns>
        public async Task<int> ExecuteNonQuery(string spName, params object[] parameterValues)
        {
            //if we receive parameter values, we need to figure out where they go
            if (parameterValues != null)
            {
                try
                {
                    //create & open a SqlConnection, and dispose of it after we are done.
                    //_connection = new SqlConnection(_connectionString);
                    //call the overload that takes an array of SqlParameters
                    using (var sqlConnection = new SqlConnection(_connectionString))
                    {
                        //sqlConnection.Open();
                        return await SqlServerDataAccess.ExecuteNonQuery(sqlConnection, spName, parameterValues);
                    }
                }
                catch (Exception e)
                {
                    throw e;
                }
                //finally
                //{
                //    _connection.Dispose();
                //    _connection.Close();
                //}
            }
            //otherwise we can just call the SP without params
            return await ExecuteNonQuery(CommandType.StoredProcedure, spName);
        }
        public int ExecuteNonQueryV2(string storeName, object obj)
        {
            int rowsEffect;
            using (var connection = new SqlConnection(_connectionString))
            using (var command = new SqlCommand(storeName, connection))
            {
                connection.Open();
                try
                {
                    command.CommandTimeout = 0;
                    command.CommandType = CommandType.StoredProcedure;
                    foreach (PropertyInfo p in obj.GetType().GetProperties())
                    {
                        var val = p.GetValue(obj, null);
                        if (p.PropertyType.Name == "DataTable")
                        {
                            command.Parameters.AddWithValue("@" + p.Name,
                            (val == null) ? DBNull.Value : val);
                            command.Parameters["@" + p.Name].SqlDbType = SqlDbType.Structured;
                        }
                        else
                        {
                            command.Parameters.AddWithValue("@" + p.Name,
                            (val == null || val.ToString().Length == 0) ? DBNull.Value : val);
                        }
                    }
                    rowsEffect = command.ExecuteNonQuery();
                }
                catch (SqlException ex)
                {
                    throw new Exception(ex.Message);
                }
                finally
                {
                    command.Dispose();
                    connection.Dispose();
                    connection.Close();
                }
            }
            return rowsEffect;
        }

        #endregion ExecuteNonQuery

        #region ExecuteDataSet

        /// <summary>
        /// Execute a SqlCommand (that returns a resultset and takes no parameters) against the database specified in 
        /// the connection string. 
        /// </summary>
        /// <remarks>
        /// e.g.:  
        ///  DataSet ds = ExecuteDataset(CommandType.StoredProcedure, "GetOrders");
        /// </remarks>
        /// <param name="commandType">the CommandType (stored procedure, text, etc.)</param>
        /// <param name="commandText">the stored procedure name or T-SQL command</param>
        /// <returns>a dataset containing the resultset generated by the command</returns>
        public async Task<DataSet> ExecuteDataset(CommandType commandType, string commandText)
        {
            //pass through the call providing null for the set of SqlParameters
            return await ExecuteDataset(commandType, commandText, null);
        }

        /// <summary>
        /// Execute a SqlCommand (that returns a resultset) against the database specified in the connection string 
        /// using the provided parameters.
        /// </summary>
        /// <remarks>
        /// e.g.:  
        ///  DataSet ds = ExecuteDataset(CommandType.StoredProcedure, "GetOrders", new SqlParameter("@prodid", 24));
        /// </remarks>
        /// <param name="commandType">the CommandType (stored procedure, text, etc.)</param>
        /// <param name="commandText">the stored procedure name or T-SQL command</param>
        /// <param name="commandParameters">an array of SqlParamters used to execute the command</param>
        /// <returns>a dataset containing the resultset generated by the command</returns>
        public async Task<DataSet> ExecuteDataset(CommandType commandType, string commandText, params SqlParameter[] commandParameters)
        {
            try
            {
                //create & open a SqlConnection, and dispose of it after we are done.
                //_connection = new SqlConnection(_connectionString);
                //call the overload that takes a connection in place of the connection string
                using (var sqlConnection = new SqlConnection(_connectionString))
                {
                    //sqlConnection.Open();
                    return await SqlServerDataAccess.ExecuteDataset(sqlConnection, commandType, commandText, commandParameters);
                }
            }
            catch (Exception e)
            {
                throw e;
            }
            //finally
            //{
            //    _connection.Dispose();
            //    _connection.Close();
            //}
        }

        /// <summary>
        /// Execute a stored procedure via a SqlCommand (that returns a resultset) against the database specified in 
        /// the connection string using the provided parameter values.  This method will query the database to discover the parameters for the 
        /// stored procedure (the first time each stored procedure is called), and assign the values based on parameter order.
        /// </summary>
        /// <remarks>
        /// This method provides no access to output parameters or the stored procedure's return value parameter.
        /// 
        /// e.g.:  
        ///  DataSet ds = ExecuteDataset("GetOrders", 24, 36);
        /// </remarks>
        /// <param name="spName">the name of the stored procedure</param>
        /// <param name="parameterValues">an array of objects to be assigned as the input values of the stored procedure</param>
        /// <returns>a dataset containing the resultset generated by the command</returns>
        public async Task<DataSet> ExecuteDataset(string spName, params object[] parameterValues)
        {
            //if we receive parameter values, we need to figure out where they go
            if (parameterValues != null && parameterValues.Length > 0)
            {
                try
                {
                    //create & open a SqlConnection, and dispose of it after we are done.
                    //_connection = new SqlConnection(_connectionString);
                    //call the overload that takes an array of SqlParameters
                    using (var sqlConnection = new SqlConnection(_connectionString))
                    {
                        //sqlConnection.Open();
                        return await SqlServerDataAccess.ExecuteDataset(sqlConnection, spName, parameterValues);
                    }
                }
                catch (Exception e)
                {
                    throw e;
                }
                //finally
                //{
                //    _connection.Dispose();
                //    _connection.Close();
                //}
            }
            //otherwise we can just call the SP without params
            return await ExecuteDataset(CommandType.StoredProcedure, spName);
        }

        #endregion ExecuteDataSet

        #region ExecuteReader

        /// <summary>
        /// Execute a SqlCommand (that returns a resultset and takes no parameters) against the database specified in 
        /// the connection string. 
        /// </summary>
        /// <remarks>
        /// e.g.:  
        ///  SqlDataReader dr = ExecuteReader(CommandType.StoredProcedure, "GetOrders");
        /// </remarks>
        /// <param name="commandType">the CommandType (stored procedure, text, etc.)</param>
        /// <param name="commandText">the stored procedure name or T-SQL command</param>
        /// <returns>a SqlDataReader containing the resultset generated by the command</returns>
        public async Task<List<T>> ExecuteReader<T>(CommandType commandType, string commandText)
        {
            //pass through the call providing null for the set of SqlParameters
            return await ExecuteReader<T>(commandType, commandText, null);
        }

        /// <summary>
        /// Execute a SqlCommand (that returns a resultset) against the database specified in the connection string 
        /// using the provided parameters.
        /// </summary>
        /// <remarks>
        /// e.g.:  
        ///  SqlDataReader dr = ExecuteReader(CommandType.StoredProcedure, "GetOrders", new SqlParameter("@prodid", 24));
        /// </remarks>
        /// <param name="commandType">the CommandType (stored procedure, text, etc.)</param>
        /// <param name="commandText">the stored procedure name or T-SQL command</param>
        /// <param name="commandParameters">an array of SqlParamters used to execute the command</param>
        /// <returns>a SqlDataReader containing the resultset generated by the command</returns>
        public async Task<List<T>> ExecuteReader<T>(CommandType commandType, string commandText, params SqlParameter[] commandParameters)
        {
            try
            {
                //create & open a SqlConnection, and dispose of it after we are done.
                //_connection = new SqlConnection(_connectionString);
                //call the private overload that takes an internally owned connection in place of the connection string
                using (var sqlConnection = new SqlConnection(_connectionString))
                {
                    //sqlConnection.Open();
                    var reader = await SqlServerDataAccess.ExecuteReader(sqlConnection, null, commandType, commandText,
                        commandParameters);
                    var instanse = reader.MapperToList<T>();
                    //
                    reader.Dispose();
                    reader.Close();
                    //
                    return instanse;
                }
            }
            catch (Exception e)
            {
                throw e;
            }
            //finally
            //{
            //    _connection.Dispose();
            //    _connection.Close();
            //}
        }

        /// <summary>
        /// Execute a stored procedure via a SqlCommand (that returns a resultset) against the database specified in 
        /// the connection string using the provided parameter values.  This method will query the database to discover the parameters for the 
        /// stored procedure (the first time each stored procedure is called), and assign the values based on parameter order.
        /// </summary>
        /// <remarks>
        /// This method provides no access to output parameters or the stored procedure's return value parameter.
        /// 
        /// e.g.:  
        ///  SqlDataReader dr = ExecuteReader("GetOrders", 24, 36);
        /// </remarks>
        /// <param name="spName">the name of the stored procedure</param>
        /// <param name="parameterValues">an array of objects to be assigned as the input values of the stored procedure</param>
        /// <returns>a SqlDataReader containing the resultset generated by the command</returns>
        public async Task<List<T>> ExecuteReader<T>(string spName, params object[] parameterValues)
        {
            //if we receive parameter values, we need to figure out where they go
            if (parameterValues != null && parameterValues.Length > 0)
            {
                try
                {
                    //create & open a SqlConnection
                    //_connection = new SqlConnection(_connectionString);
                    //call the overload that takes an array of SqlParameters
                    using (var sqlConnection = new SqlConnection(_connectionString))
                    {
                        var reader = await SqlServerDataAccess.ExecuteReader(sqlConnection, spName, parameterValues);
                        var instanse = reader.MapperToList<T>();
                        //
                        reader.Dispose();
                        reader.Close();
                        //
                        return instanse;
                    }
                }
                catch (Exception e)
                {
                    throw new Exception(e.Message);
                }
                //finally
                //{
                //    _connection.Dispose();
                //    _connection.Close();
                //}
            }
            //otherwise we can just call the SP without params
            return await ExecuteReader<T>(CommandType.StoredProcedure, spName);
        }
        #endregion ExecuteReader

        #region ExecuteScalar

        /// <summary>
        /// Execute a SqlCommand (that returns a 1x1 resultset and takes no parameters) against the database specified in 
        /// the connection string. 
        /// </summary>
        /// <remarks>
        /// e.g.:  
        ///  int orderCount = (int)ExecuteScalar(CommandType.StoredProcedure, "GetOrderCount");
        /// </remarks>
        /// <param name="commandType">the CommandType (stored procedure, text, etc.)</param>
        /// <param name="commandText">the stored procedure name or T-SQL command</param>
        /// <returns>an object containing the value in the 1x1 resultset generated by the command</returns>
        public async Task<object> ExecuteScalar(CommandType commandType, string commandText)
        {
            //pass through the call providing null for the set of SqlParameters
            return await ExecuteScalar(commandType, commandText, null);
        }

        /// <summary>
        /// Execute a SqlCommand (that returns a 1x1 resultset) against the database specified in the connection string 
        /// using the provided parameters.
        /// </summary>
        /// <remarks>
        /// e.g.:  
        ///  int orderCount = (int)ExecuteScalar(CommandType.StoredProcedure, "GetOrderCount", new SqlParameter("@prodid", 24));
        /// </remarks>
        /// <param name="commandType">the CommandType (stored procedure, text, etc.)</param>
        /// <param name="commandText">the stored procedure name or T-SQL command</param>
        /// <param name="commandParameters">an array of SqlParamters used to execute the command</param>
        /// <returns>an object containing the value in the 1x1 resultset generated by the command</returns>
        public async Task<object> ExecuteScalar(CommandType commandType, string commandText, params SqlParameter[] commandParameters)
        {
            try
            {
                //create & open a SqlConnection, and dispose of it after we are done.
                //_connection = new SqlConnection(_connectionString);
                //call the overload that takes a connection in place of the connection string
                using (var sqlConnection = new SqlConnection(_connectionString))
                {
                    //sqlConnection.Open();
                    return await SqlServerDataAccess.ExecuteScalar(sqlConnection, commandType, commandText, commandParameters);
                }
            }
            catch (Exception e)
            {
                throw e;
            }
            //finally
            //{
            //    _connection.Dispose();
            //    _connection.Close();
            //}
        }

        /// <summary>
        /// Execute a stored procedure via a SqlCommand (that returns a 1x1 resultset) against the database specified in 
        /// the connection string using the provided parameter values.  This method will query the database to discover the parameters for the 
        /// stored procedure (the first time each stored procedure is called), and assign the values based on parameter order.
        /// </summary>
        /// <remarks>
        /// This method provides no access to output parameters or the stored procedure's return value parameter.
        /// 
        /// e.g.:  
        ///  int orderCount = (int)ExecuteScalar("GetOrderCount", 24, 36);
        /// </remarks>
        /// <param name="spName">the name of the stored procedure</param>
        /// <param name="parameterValues">an array of objects to be assigned as the input values of the stored procedure</param>
        /// <returns>an object containing the value in the 1x1 resultset generated by the command</returns>
        public async Task<object> ExecuteScalar(string spName, params object[] parameterValues)
        {
            //if we receive parameter values, we need to figure out where they go
            if (parameterValues != null && parameterValues.Length > 0)
            {
                try
                {
                    //create & open a SqlConnection, and dispose of it after we are done.
                    //_connection = new SqlConnection(_connectionString);
                    //call the overload that takes an array of SqlParameters
                    using (var sqlConnection = new SqlConnection(_connectionString))
                    {
                        //sqlConnection.Open();
                        return await SqlServerDataAccess.ExecuteScalar(sqlConnection, spName, parameterValues);
                    }
                }
                catch (Exception e)
                {
                    throw e;
                }
                //finally
                //{
                //    _connection.Dispose();
                //    _connection.Close();
                //}
            }
            //otherwise we can just call the SP without params
            return ExecuteScalar(CommandType.StoredProcedure, spName);
        }

        public object ExecuteScalarV2(string storeName, object obj)
        {
            var objReturn = new object();
            using (var connection = new SqlConnection(_connectionString))
            using (var command = new SqlCommand(storeName, connection))
            {
                connection.Open();
                try
                {
                    command.CommandTimeout = 0;
                    command.CommandType = CommandType.StoredProcedure;
                    foreach (PropertyInfo p in obj.GetType().GetProperties())
                    {
                        var val = p.GetValue(obj, null);
                        if (p.PropertyType.Name == "DataTable")
                        {
                            command.Parameters.AddWithValue("@" + p.Name,
                            (val == null) ? DBNull.Value : val);
                            command.Parameters["@" + p.Name].SqlDbType = SqlDbType.Structured;
                        }
                        else
                        {
                            command.Parameters.AddWithValue("@" + p.Name,
                            (val == null || val.ToString().Length == 0) ? DBNull.Value : val);
                        }
                    }
                    objReturn = command.ExecuteScalar();
                }
                catch (SqlException ex)
                {
                    throw new Exception(ex.Message);
                }
                finally
                {
                    command.Dispose();
                    connection.Dispose();
                    connection.Close();
                }
            }
            return objReturn;
        }
        #endregion ExecuteScalar	

        #region ExecuteXmlReader

        /// <summary>
        /// Execute a SqlCommand (that returns a resultset and takes no parameters) against the provided SqlConnection. 
        /// </summary>
        /// <remarks>
        /// e.g.:  
        ///  XmlReader r = ExecuteXmlReader(CommandType.StoredProcedure, "GetOrders");
        /// </remarks>
        /// <param name="commandType">the CommandType (stored procedure, text, etc.)</param>
        /// <param name="commandText">the stored procedure name or T-SQL command using "FOR XML AUTO"</param>
        /// <returns>an XmlReader containing the resultset generated by the command</returns>
        public async Task<XmlReader> ExecuteXmlReader(CommandType commandType, string commandText)
        {
            //pass through the call providing null for the set of SqlParameters
            return await ExecuteXmlReader(commandType, commandText, null);
        }

        /// <summary>
        /// Execute a SqlCommand (that returns a resultset) against the specified SqlConnection 
        /// using the provided parameters.
        /// </summary>
        /// <remarks>
        /// e.g.:  
        ///  XmlReader r = ExecuteXmlReader(CommandType.StoredProcedure, "GetOrders", new SqlParameter("@prodid", 24));
        /// </remarks>
        /// <param name="commandType">the CommandType (stored procedure, text, etc.)</param>
        /// <param name="commandText">the stored procedure name or T-SQL command using "FOR XML AUTO"</param>
        /// <param name="commandParameters">an array of SqlParamters used to execute the command</param>
        /// <returns>an XmlReader containing the resultset generated by the command</returns>
        public async Task<XmlReader> ExecuteXmlReader(CommandType commandType, string commandText, params SqlParameter[] commandParameters)
        {
            try
            {
                //create & open a SqlConnection, and dispose of it after we are done.
                //_connection = new SqlConnection(_connectionString);
                //call the overload that takes a connection in place of the connection string
                using (var sqlConnection = new SqlConnection(_connectionString))
                {
                    //sqlConnection.Open();
                    return await SqlServerDataAccess.ExecuteXmlReader(sqlConnection, commandType, commandText,
                        commandParameters);
                }
            }
            catch (Exception e)
            {
                throw e;
            }
            //finally
            //{
            //    _connection.Dispose();
            //    _connection.Close();
            //}
        }

        /// <summary>
        /// Execute a stored procedure via a SqlCommand (that returns a resultset) against the specified SqlConnection 
        /// using the provided parameter values.  This method will query the database to discover the parameters for the 
        /// stored procedure (the first time each stored procedure is called), and assign the values based on parameter order.
        /// </summary>
        /// <remarks>
        /// This method provides no access to output parameters or the stored procedure's return value parameter.
        /// 
        /// e.g.:  
        ///  XmlReader r = ExecuteXmlReader("GetOrders", 24, 36);
        /// </remarks>
        /// <param name="spName">the name of the stored procedure using "FOR XML AUTO"</param>
        /// <param name="parameterValues">an array of objects to be assigned as the input values of the stored procedure</param>
        /// <returns>an XmlReader containing the resultset generated by the command</returns>
        public async Task<XmlReader> ExecuteXmlReader(string spName, params object[] parameterValues)
        {
            //if we receive parameter values, we need to figure out where they go
            if (parameterValues != null && parameterValues.Length > 0)
            {
                try
                {
                    //create & open a SqlConnection, and dispose of it after we are done.
                    //_connection = new SqlConnection(_connectionString);
                    //call the overload that takes an array of SqlParameters
                    using (var sqlConnection = new SqlConnection(_connectionString))
                    {
                        //sqlConnection.Open();
                        return await SqlServerDataAccess.ExecuteXmlReader(sqlConnection, spName, parameterValues);
                    }
                }
                catch (Exception e)
                {
                    throw e;
                }
                //finally
                //{
                //    _connection.Dispose();
                //    _connection.Close();
                //}
            }
            //otherwise we can just call the SP without params
            return await ExecuteXmlReader(CommandType.StoredProcedure, spName);
        }

        #endregion ExecuteXmlReader
    }
}
