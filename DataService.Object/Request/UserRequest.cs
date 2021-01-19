using System;
using System.Collections.Generic;
using System.Text;
using static Libraries.Extensions.Constants;

namespace DataService.Object.Request
{
    public class UserRequest
    {
        public int Id { get; set; }
        public int PositionId { get; set; }
        public int DepartmentId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public Gender Gender { get; set; }
        public DateTime BirthOfDay { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }
        public string IDCard { get; set; }
        public int? Status { get; set; }
        public int? pageIndex { get; set; }
        public int? pageSize { get; set; }
    }
}
