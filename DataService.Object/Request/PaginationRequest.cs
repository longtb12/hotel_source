using System;
using System.Collections.Generic;
using System.Text;

namespace DataService.Object.Request
{
    public class PaginationRequest
    {
        public int pageIndex { get; set; }
        public int pageSize { get; set; }
        public string textSearch { get; set; }
    }
}
