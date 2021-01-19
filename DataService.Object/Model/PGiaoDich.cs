using System;
using System.Collections.Generic;
using System.Text;

namespace DataService.Object.Model
{
    public class PGiaoDich
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public int Deposit { get; set; }
        public int StaffId { get; set; }
        public int CustomerId { get; set; }
        public bool Paid { get; set; }
        public DateTime PaidDate { get; set; }
        public int? ModifiedUserId { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public int CreatedUserId { get; set; }
        public DateTime CreatedDate { get; set; }
        public bool Deleted { get; set; }
    }
}
