using DataService.Object.Model;
using DataService.Object.Request;
using DataServices.Object.Model;
using DataServices.Object.Request;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace DataService.Data.Interfaces
{
    public interface IGiaoDichService
    {
        int SaveGD(Customer_GDRequest request);
    }
}
