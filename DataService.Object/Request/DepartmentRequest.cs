using System;
using System.Collections.Generic;
using System.Text;

namespace DataServices.Object.Request
{
    public class DepartmentRequest
    {
        public int Id { get; set; }
        public int ParentId { get; set; }
        public bool IsUnit { get; set; }
        public string Acronym { get; set; }
        public string ShortName { get; set; }
        public string FullName { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }
        public string Description { get; set; }
        public int ActUserId { get; set; }
    }
}
