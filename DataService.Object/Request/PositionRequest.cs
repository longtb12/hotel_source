using System;
using System.Collections.Generic;
using System.Text;

namespace DataServices.Object.Request
{
    public class PositionRequest
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int Status { get; set; }
    }
}
