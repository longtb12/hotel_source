using System;
using System.Collections.Generic;
using System.Text;

namespace DataService.Object.Model
{
    public class ActionFunction
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public int FunctionId { get; set; }
        public string AreaName { get; set; }
        public string ControllerName { get; set; }
        public string ActionName { get; set; }
        public string Method { get; set; }
        public int Status { get; set; }
        public bool Deleted { get; set; }
        public int CreatedUserId { get; set; }
        public DateTime CreatedDate { get; set; }
        public string CreatedName { get; set; }
        public int ModifiedUserId { get; set; }
        public DateTime ModifiedDate { get; set; }
        public string ModifiedName { get; set; }
    }
}
