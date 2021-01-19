using System;
using System.Collections.Generic;
using System.Text;

namespace DataService.Object.Model
{
    public class Position
    {
		public int Id { get; set; }
		public string Name { get; set; }
		public int PositionLevel { get; set; }
		public int Status { get; set; }
		public string Description { get; set; }
		public int? ModifiedUserId { get; set; }
		public DateTime? ModifiedDate { get; set; }
		public int CreatedUserId { get; set; }
		public DateTime CreatedDate { get; set; }
		public bool? Deleted { get; set; }
	}
	public class PositionRQPagination : Position
	{
		public long Order { get; set; }
		public int Total { get; set; }
	}
}
