using System;
using System.Collections.Generic;
using System.Text;
using static Libraries.Extensions.Constants;

namespace DataService.Object.Request
{
    public class Customer_GDRequest
    {
        public int UserId { get; set; }
        public int Id { get; set; }
        public string Code { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int Deposit { get; set; }
        public string IDCard { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
        public Gender Gender { get; set; }
        public string Description { get; set; }
        public int Price { get; set; }
        public List<GiaoDichRequest> giaoDichs { get; set; }
    }
    public class GiaoDichRequest
    {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int Price { get; set; }
        public int RoomId { get; set; }
    }
}
