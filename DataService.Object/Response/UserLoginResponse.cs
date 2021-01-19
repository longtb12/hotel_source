using DataServices.Object.Model;
using System;
using System.Collections.Generic;
using System.Text;

namespace DataServices.Object.Response
{
    public class UserLoginResponse
    {
        public User User{ get; set; }
        public string AccessToken { get; set; }
        public List<string> rights { get; set; }
    }
}
