using Libraries.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace Libraries.Extensions
{
    public static class Mapper
    {
        public class MapSchema<F, T> //where T : class ,new()
        {
            private Func<string, string> reviseSourcePropsFunc;

            /// <summary>
            /// Define property resolver for members (revise source properties name function)
            /// </summary>
            /// <param name="reviseSourcePropsFunc">The function used to revise source properties name before compare with tagert properties</param>
            /// <returns>return Map schema</returns>
            public MapSchema<F, T> ForMembers(Func<string, string> reviseSourcePropsFunc)
            {
                this.reviseSourcePropsFunc = reviseSourcePropsFunc;
                return this;
            }

            public T Map(F from, T to)
            {
                if (to == null || from == null) return to;

                var fromProperties = from.GetType().GetProperties(BindingFlags.Public | BindingFlags.Instance | BindingFlags.SetProperty);

                var toProperties = to.GetType().GetProperties(BindingFlags.Public | BindingFlags.Instance | BindingFlags.SetProperty);

                #region has reviseSourcePropsFunc

                if (reviseSourcePropsFunc != null)
                {
                    var revisedProperties = (from item in fromProperties
                                             select
                                                 new PropertyItem()
                                                 {
                                                     PropertyName = reviseSourcePropsFunc.Invoke(item.Name),
                                                     PropertyInfo = item
                                                 }
                                            ).ToArray();

                    foreach (var toProp in toProperties)
                    {
                        var propName = toProp.Name;
                        var fromProp = revisedProperties.FirstOrDefault(s => s.PropertyName == propName);
                        var fromAttr = fromProp.PropertyInfo.CustomAttributes.FirstOrDefault(m => m.GetType() == typeof(AdministrationIgnoreMappingAttribute));
                        var toAttr = toProp.CustomAttributes.FirstOrDefault(m => m.GetType() == typeof(AdministrationIgnoreMappingAttribute));
                        if (fromAttr != null || toAttr != null)
                        {
                            continue;
                        }

                        if (fromProp != null && CanWrite(toProp))
                        {
                            var fromValue = fromProp.PropertyInfo.GetValue(@from, null);
                            toProp.SetValue(to, fromValue, null);
                        }
                    }

                    return to;
                }

                #endregion has reviseSourcePropsFunc

                #region Map 2 similar object

                foreach (var toProp in toProperties)
                {
                    var propName = toProp.Name;
                    var fromProp = fromProperties.FirstOrDefault(s => s.Name == propName);
                    if (fromProp == null)
                    {
                        continue;
                    }
                    var fromAttr = fromProp.CustomAttributes.FirstOrDefault(m => m.GetType() == typeof(AdministrationIgnoreMappingAttribute));
                    var toAttr = toProp.CustomAttributes.FirstOrDefault(m => m.GetType() == typeof(AdministrationIgnoreMappingAttribute));
                    if (fromAttr != null || toAttr != null)
                    {
                        continue;
                    }

                    if (CanWrite(toProp))
                    {
                        var fromValue = fromProp.GetValue(@from, null);
                        try
                        {
                            if (IsNullableType(toProp.PropertyType))
                            {
                                toProp.SetValue(to, fromValue, null);
                            }
                            else
                            {
                                toProp.SetValue(to, Convert.ChangeType(fromValue, toProp.PropertyType), null);
                            }
                        }
                        catch (Exception ex)
                        {
                            throw new Exception($"Cannot set value for property. From {fromProp.Name} To {toProp.Name}", ex);
                        }
                    }
                }

                return to;

                #endregion Map 2 similar object
            }

            private bool IsNullableType(Type type)
            {
                return type.IsGenericType && type.GetGenericTypeDefinition().Equals(typeof(Nullable<>));
            }

            public F MapBack(T from, F to)
            {
                if (to == null || from == null) return to;

                var fromProperties = from.GetType().GetProperties(BindingFlags.Public | BindingFlags.Instance);

                var toProperties = to.GetType().GetProperties(BindingFlags.Public | BindingFlags.Instance);

                #region has reviseSourcePropsFunc

                if (reviseSourcePropsFunc != null)
                {
                    var revisedProperties = (from item in toProperties
                                             select
                                                 new PropertyItem()
                                                 {
                                                     PropertyName = reviseSourcePropsFunc.Invoke(item.Name),
                                                     PropertyInfo = item
                                                 }
                                            ).ToArray();

                    foreach (var fromProp in fromProperties)
                    {
                        var propName = fromProp.Name;
                        var toProp = revisedProperties.FirstOrDefault(s => s.PropertyName == propName);

                        if (toProp != null && CanWrite(toProp.PropertyInfo))
                        {
                            var fromValue = fromProp.GetValue(@from, null);
                            toProp.PropertyInfo.SetValue(to, fromValue, null);
                        }
                    }

                    return to;
                }

                #endregion has reviseSourcePropsFunc

                #region Map 2 similar object

                foreach (var fromProp in fromProperties)
                {
                    var propName = fromProp.Name;
                    var toProp = toProperties.FirstOrDefault(s => s.Name == propName);

                    if (toProp != null && CanWrite(toProp))
                    {
                        var fromValue = fromProp.GetValue(@from, null);
                        toProp.SetValue(to, fromValue, null);
                    }
                }

                return to;

                #endregion Map 2 similar object
            }

            private bool CanWrite(PropertyInfo toProp)
            {
                return toProp.CanWrite &&
                       (toProp.PropertyType.IsPrimitive ||
                        toProp.PropertyType.IsEnum ||
                        toProp.PropertyType.IsValueType ||
                        toProp.PropertyType.IsSerializable);
            }

            private class PropertyItem
            {
                public PropertyInfo PropertyInfo { get; set; }
                public string PropertyName { get; set; }
            }
        }

        private static Dictionary<string, object> _mapperHolder = new Dictionary<string, object>();
        private static Func<string, string> _expandoFieldsResolver;

        private static string GetKeyMap(Type f, Type t)
        {
            var key = (f.FullName + t.FullName).Replace(".", "").Replace("StudyWays", "");
            return key;
        }

        /// <summary>
        /// Create mapping convention(Source_Class,Target_Class)
        /// </summary>
        /// <typeparam name="F">Source Class</typeparam>
        /// <typeparam name="T">Target Class</typeparam>
        /// <returns>return Map schema</returns>
        public static MapSchema<F, T> CreateMap<F, T>()
        {
            var m = new MapSchema<F, T>();
            var key = GetKeyMap(typeof(F), typeof(T));
            if (_mapperHolder.ContainsKey(key))
            {
                return m;
            }

            _mapperHolder.Add(key, m);
            return m;
        }

        public static void RegisterExpando(Func<string, string> expandoFieldsResolver)
        {
            _expandoFieldsResolver = expandoFieldsResolver;
        }

        /// <summary>
        /// Map an object from F to T
        /// </summary>
        /// <typeparam name="F"></typeparam>
        /// <typeparam name="T"></typeparam>
        /// <param name="from"></param>
        /// <param name="to"></param>
        /// <param name="func"></param>
        /// <returns></returns>
        public static T Map<F, T>(F from, T to, Func<F, T, T> func = null)
        {
            var keyMapper = GetKeyMap(typeof(F), typeof(T));
            if (_mapperHolder.ContainsKey(keyMapper))
            {
                var mapper = _mapperHolder[keyMapper] as MapSchema<F, T>;
                mapper.Map(from, to);
            }
            else
            {
                var mapper = CreateMap<F, T>();
                mapper.Map(from, to);
            }

            if (func != null)
            {
                func(from, to);
            }

            return to;
        }

        public static F MapBack<T, F>(T from, F to)
        {
            var keyMapper = GetKeyMap(typeof(F), typeof(T));
            if (_mapperHolder.ContainsKey(keyMapper))
            {
                var mapper = _mapperHolder[keyMapper] as MapSchema<F, T>;
                mapper.MapBack(from, to);
            }
            else
            {
                var mapper = CreateMap<F, T>();
                mapper.MapBack(from, to);
            }
            return to;
        }

        /// <summary>
        /// Map a list data from F to T. Return new List<T>() if there is no item from source list.
        /// </summary>
        /// <typeparam name="F"></typeparam>
        /// <typeparam name="T"></typeparam>
        /// <param name="from">List of F need to map to T</param>
        /// <param name="func"></param>
        /// <returns></returns>
        public static List<T> Map<F, T>(IEnumerable<F> from, Func<F, T, T> func = null) where T : new()
        {
            var lst = new List<T>();
            if (from == null || !@from.Any()) return lst;

            lst.AddRange(@from.Select(f => Map(f, new T(), func)));

            return lst;
        }

        public static List<T> MapExpandoList<T>(List<Dictionary<string, object>> models) where T : new()
        {
            var lst = new List<T>();
            if (models == null || models.Count == 0) return lst;

            if (_expandoFieldsResolver != null)
            {
                var t = new T();
                var properties = t.GetType().GetProperties(BindingFlags.Public | BindingFlags.Instance | BindingFlags.SetProperty);
                foreach (var model in models)
                {
                    t = new T();
                    foreach (var o in model)
                    {
                        var field = _expandoFieldsResolver.Invoke(o.Key);
                        var value = o.Value;
                        var prop = properties.FirstOrDefault(item => item.Name.ToLower() == field.ToLower());
                        if (prop != null && prop.CanWrite)
                        {
                            try
                            {
                                prop.SetValue(t, value, null);
                            }
                            catch (Exception ex)
                            {
                                throw new Exception("Cannot set value for property.", ex);
                            }
                        }
                    }
                    lst.Add(t);
                }
            }
            else
            {
                var t = new T();
                var properties = t.GetType().GetProperties(BindingFlags.Public | BindingFlags.Instance | BindingFlags.SetProperty);
                foreach (var model in models)
                {
                    t = new T();
                    foreach (var o in model)
                    {
                        var field = o.Key;
                        var value = o.Value;
                        var prop = properties.FirstOrDefault(item => item.Name == field);
                        if (prop != null && prop.CanWrite)
                        {
                            try
                            {
                                prop.SetValue(t, value, null);
                            }
                            catch (Exception ex)
                            {
                                throw new Exception("Cannot set value for property.", ex);
                            }
                        }
                    }
                    lst.Add(t);
                }
            }
            return lst;
        }
    }
}
