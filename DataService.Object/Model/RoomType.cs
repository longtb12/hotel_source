using System;
using System.Collections.Generic;
using System.Text;

namespace DataService.Object.Model
{
    public class RoomType
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public int Price { get; set; }
        public string Description { get; set; }
        public int? ModifiedUserId { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public int CreatedUserId { get; set; }
        public DateTime CreatedDate { get; set; }
        public bool? Deleted { get; set; }
    }
    public class RoomTypeRQPagination : RoomType
    {
        public long Order { get; set; }
        public int Total { get; set; }
    }
}
