using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Newtonsoft.Json;
using Libraries.Extensions;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System;
using System.Diagnostics.Contracts;
using System.Web.Http;
using System.Linq;

namespace Sercurities.Extensions
{
    [AttributeUsage(AttributeTargets.Method | AttributeTargets.Class)]
    public class RequiredAuthorizeAttribute : ActionFilterAttribute
    {

        public override void OnActionExecuting(ActionExecutingContext context)
        {
            //Check AllowAnonymous
            if (SkipAuthorization(context)) return;

            // get authorization value
            var authorization = context.HttpContext.Request.Headers["Authorization"];
            var access_token = authorization.AsString().AsBase64Decode().Replace("Bearer ", "");
            if (string.IsNullOrEmpty(access_token))
            {
                context.Result = new StatusCodeResult((int)HttpStatusCode.NotFound);
                return;
            }
            // get auth access value
            var auth_access = context.HttpContext.Request.Headers["Auth-Access"];
            if (string.IsNullOrEmpty(auth_access))
            {
                context.Result = new StatusCodeResult((int)HttpStatusCode.NotFound);
                return;
            }
            //check get post
            if (context.HttpContext.Request.Method == "GET")
            {
                var t= context.HttpContext.Request.QueryString;
            }
            else
            {
                // read body before API action execution
                var bodyData = context.ActionArguments["request"];
                if (bodyData == null)
                {
                    context.Result = new StatusCodeResult((int)HttpStatusCode.NotFound);
                    return;
                }
                // Create a SHA256
                using var sha256 = SHA256.Create();
                // ComputeHash - returns byte array
                var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(bodyData, new JsonSerializerSettings
                {
                    DateFormatString = "yyyy-MM-dd HH:mm:ss"
                })));
                // Convert byte array to a string
                var builder = new StringBuilder();
                for (int i = 0; i < bytes.Length; i++)
                {
                    builder.Append(bytes[i].ToString("x2"));
                }
                // is valid auth access value
                //var hash = builder.ToString();
                if (auth_access != builder.ToString())
                {
                    context.Result = new StatusCodeResult((int)HttpStatusCode.NotFound);
                    return;
                }
                //
                string action = (string)context.RouteData.Values["action"];
                string controller = (string)context.RouteData.Values["controller"];
                if (controller != "Auth" && action != "Login")
                {
                    //var _userService = new UserService(new Repository());
                    //// is valid access token
                    //var response = _userService.GetByHashKey(new Request
                    //{
                    //    access_token = access_token
                    //});
                    //// is valid user information
                    //if (!response.success || response.data == null || response.data.status != 0)
                    //{
                    //    context.Result = new StatusCodeResult((int)HttpStatusCode.NotFound);
                    //    return;
                    //}
                }
                // set value to property "access_token"
                foreach (var prop in context.ActionArguments["request"].GetType().GetProperties())
                {
                    if (prop.Name == "access_token")
                        prop.SetValue(bodyData, access_token, null);
                }
                // rewrite body before API action execution
                context.ActionArguments["request"] = bodyData;
            }
            
        }
        private static bool SkipAuthorization(ActionExecutingContext context)
        {
            Contract.Assert(context != null);

            return context.ActionDescriptor.EndpointMetadata.OfType<Microsoft.AspNetCore.Authorization.AllowAnonymousAttribute>().Any();
        }

    }
}
