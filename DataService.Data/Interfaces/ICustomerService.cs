using DataService.Object.Model;
using DataService.Object.Request;
using DataService.Object.Response;
using DataServices.Object.Request;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace DataService.Data.Interfaces
{
    public interface ICustomerService
    {
        Task<CustomerResponse> ListData(int PageIndex, int PageSize,string textSearch);
        Task<Customer> GetById(int Id);
        Task<int> Add(CustomerRequest request);
        Task<int> Update(CustomerRequest request);
        Task<int> Delete(int Id);
    }
}
