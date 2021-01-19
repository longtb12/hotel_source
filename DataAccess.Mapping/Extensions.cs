//using Oracle.ManagedDataAccess.Client;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Globalization;
using System.Linq;

namespace DataAccess.Mapping
{
    public static class Extensions
    {
        //public static Dictionary<string, OracleDbType> Dictionarys = new Dictionary<string, OracleDbType>
        //{
        //    ["byte[]"] = OracleDbType.BFile,
        //    ["byte[]"] = OracleDbType.Blob,
        //    ["string"] = OracleDbType.Char,
        //    ["string"] = OracleDbType.Clob,
        //    ["DateTime"] = OracleDbType.Date,
        //    ["int"] = OracleDbType.Int32,
        //    ["long"] = OracleDbType.Int64,
        //    ["string"] = OracleDbType.NChar,
        //    ["string"] = OracleDbType.NClob,
        //    ["string"] = OracleDbType.NVarchar2,
        //    ["string"] = OracleDbType.Varchar2
        //};

        /// <summary>
        /// Determines whether the specified column name has column.
        /// </summary>
        /// <param name="reader">The reader.</param>
        /// <param name="columnName">Name of the column.</param>
        /// <returns></returns>
        private static bool HasColumn(this IDataRecord reader, string columnName)
        {
            for (var i = 0; i < reader.FieldCount; i++)
            {
                if (reader.GetName(i).Equals(columnName, StringComparison.InvariantCultureIgnoreCase))
                    return true;
            }
            return false;
        }

        private static bool HasColumn(this SqlParameterCollection collection, string columnName)
        {
            for (var i = 0; i < collection.Count; i++)
            {
                if (collection[i].ParameterName.Equals(columnName, StringComparison.InvariantCultureIgnoreCase))
                    return true;
            }
            return false;
        }

        /// <summary>
        /// Maps to list.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="reader">The reader.</param>
        /// <returns></returns>
        public static List<T> MapperToList<T>(this IDataReader reader)
        {
            var list = new List<T>();
            while (reader.Read())
            {
                var instance = Activator.CreateInstance<T>();
                foreach (var prop in instance.GetType().GetProperties())
                {
                    if (reader.HasColumn(prop.Name))
                    {
                        if (!Equals(reader[prop.Name], DBNull.Value))
                        {
                            prop.SetValue(instance, reader[prop.Name], null);
                        }
                    }
                }
                list.Add(instance);
            }
            return list;
        }

        /// <summary>
        /// Mappers to first.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="reader">The reader.</param>
        /// <returns></returns>
        public static T MapperToFirst<T>(this IDataReader reader)
        {
            var instance = Activator.CreateInstance<T>();
            while (reader.Read())
            {
                foreach (var prop in instance.GetType().GetProperties())
                {
                    if (!reader.HasColumn(prop.Name)) continue;
                    if (!Equals(reader[prop.Name], DBNull.Value))
                    {
                        prop.SetValue(instance, reader[prop.Name], null);
                    }
                }
            }
            return instance;
        }

        /// <summary>
        /// Mixes the list.
        /// </summary>
        /// <typeparam name="TE">The type of the e.</typeparam>
        /// <param name="input">The input list.</param>
        /// <returns></returns>
        public static List<TE> MixList<TE>(List<TE> input)
        {
            if (input == null || input.Count == 0) return new List<TE>();
            if (input.Count == 1) return input;

            var randomList = new List<TE>();

            var r = new Random();
            if (input.Count == 2)
            {
                randomList.Add(input[1]);
                randomList.Add(input[0]);
            }
            else
            {
                while (input.Count > 0)
                {
                    var randomIndex = r.Next(0, input.Count);
                    randomList.Add(input[randomIndex]); //add it to the new, random list
                    input.RemoveAt(randomIndex); //remove to avoid duplicates
                }
            }

            return randomList; //return the new random list
        }

        /// <summary>
        /// Obtains the data as a list; if it is *already* a list, the original object is returned without
        /// any duplication; otherwise, ToList() is invoked.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="source">The source.</param>
        /// <returns></returns>
        public static List<T> AsList<T>(this IEnumerable<T> source)
        {
            return source == null || source is List<T> ? (List<T>)source : source.ToList();
        }

        /// <summary>
        /// Parses the specified value.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="value">The value.</param>
        /// <returns></returns>
        public static T Parse<T>(this object value)
        {
            if (value == null || value is DBNull) return default(T);
            if (value is T) return (T)value;
            var type = typeof(T);
            type = Nullable.GetUnderlyingType(type) ?? type;
            if (type.IsEnum)
            {
                if (value is float || value is double || value is decimal)
                {
                    value = Convert.ChangeType(value, Enum.GetUnderlyingType(type), CultureInfo.InvariantCulture);
                }
                return (T)Enum.ToObject(type, value);
            }
            return (T)Convert.ChangeType(value, type, CultureInfo.InvariantCulture);
        }
    }
}
