using System;
using System.Collections.Generic;
using System.Text;

namespace DataService.Object.Model
{
    public class GiaoDich
    {
        public int Id { get; set; }
        public int PGiaoDichId { get; set; }
        public int RoomId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int Price { get; set; }
        public int CreatedUserId { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
