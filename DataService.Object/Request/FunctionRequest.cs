using System;
using System.Collections.Generic;
using System.Text;

namespace DataServices.Object.Request
{
    public class FunctionRequest
    {
        public int Id { get; set; }
        public int ParentId { get; set; }
        public string Name { get; set; }
        public string Icon { get; set; }
        public string ActionLink { get; set; }
        public int Status { get; set; }
        public bool ShowInMenu { get; set; }
        public string Description { get; set; }
        public int ActUserId { get; set; }
        public List<ActionRequest> Actions { get; set; }
    }

    public class ActionRequest
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string AreaName { get; set; }
        public string ControllerName { get; set; }
        public string ActionName { get; set; }
        public string Method { get; set; }
        public int Status { get; set; }
        public int? Index { get; set; }
        public string Code { get; set; }
    }
}
