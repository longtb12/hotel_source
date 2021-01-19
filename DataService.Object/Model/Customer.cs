using System;
using System.Collections.Generic;
using System.Text;
using Libraries.Extensions;
using static Libraries.Extensions.Constants;

namespace DataService.Object.Model
{
    public class Customer
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string IDCard { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Address { get; set; }   
        public Gender Gender { get; set; }   
        public string Description { get; set; }
        public int? ModifiedUserId { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public int CreatedUserId { get; set; }
        public DateTime CreatedDate { get; set; }
        public bool? Deleted { get; set; }
    }
    public class CustomerRQPagination : Customer
    {
        public long Order { get; set; }
        public int Total { get; set; }
    }
}
