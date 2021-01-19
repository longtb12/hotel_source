using DataService.Object.Model;
using System;
using System.Collections.Generic;
using System.Text;

namespace DataService.Object.Response
{
    public class PositionResponse : Position
    {
        public int Total { get; set; }
        public object Data { get; set; }
    }
}
