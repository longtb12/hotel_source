using DataServices.Object.Model;
using System;
using System.Collections.Generic;
using System.Text;

namespace DataService.Object.Response
{
    public class UserResponse : User
    {
        public int Total { get; set; }
        public object Data { get; set; }
    }
}
