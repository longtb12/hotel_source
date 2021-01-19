using DataService.Object.Model;
using System;
using System.Collections.Generic;
using System.Text;

namespace DataService.Object.Response
{
    public class RoomMenuReponse:Room
    {
        public DateTime StartDateGD { get; set; }
        public DateTime EndDateGD { get; set; }
        public int checkRoom { get; set; }
        public string RoomTypeName { get; set; }
        public string RoomDescription { get; set; }
        public int RoomPrice { get; set; }
    }
}
