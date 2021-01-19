using System;
using System.Collections.Generic;
using System.Text;

namespace DataService.Object.Request
{
    public class RoomRequest
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int RoomTypeId { get; set; }
        public string Description { get; set; }
    }
}
