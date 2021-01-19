using System;
using System.Collections.Generic;
using System.Text;

namespace DataService.Object.Request
{
    public class ActionOfUserAddRequest
    {
        public int UserLoginId { get; set; }
        public int UserId { get; set; }
        public List<int> listAction { get; set; }
    }
}
