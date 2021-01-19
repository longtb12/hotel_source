using DataAccess.Repositories.Interfaces;
using DataService.Data.Interfaces;
using DataService.Object.Model;
using DataService.Object.Request;
using DataService.Object.Response;
using DataServices.Implementations;
using DataServices.Object.Request;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataService.Data.Implementations
{
    public class CustomerService : BaseService, ICustomerService
    {
        public CustomerService(IRepository repository) : base(repository)
        {

        }
        public async Task<CustomerResponse> ListData(int PageIndex, int PageSize, string textSearch)
        {
            var data = await _repository.ExecuteReader<CustomerRQPagination>("CustomerSelect", new { pageIndex = PageIndex, pageSize = PageSize, textSearch = textSearch });
            return new CustomerResponse
            {
                Data = data,
                Total = data.FirstOrDefault().Total
            };
        }
        public async Task<Customer> GetById(int Id)
        {
            var room = await _repository.ExecuteReader<Customer>("CustomerGetById", new { Id = Id });
            return room.FirstOrDefault();
        }

        public async Task<int> Add(CustomerRequest request)
        {
            var check = await _repository.ExecuteNonQuery("CustomerInsert", new
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                IDCard = request.IDCard,
                Email = request.Email,
                PhoneNumber = request.PhoneNumber,
                Address = request.Address,
                Gender = request.Gender,
                Description = request.Description,
                CreatedUserId = 1
            });
            return check;
        }

        public async Task<int> Update(CustomerRequest request)
        {
            var check = await _repository.ExecuteNonQuery("CustomerUpdate", new
            {
                Id = request.Id,
                FirstName = request.FirstName,
                LastName = request.LastName,
                IDCard = request.IDCard,
                Email = request.Email,
                PhoneNumber = request.PhoneNumber,
                Address = request.Address,
                Gender = request.Gender,
                Description = request.Description,
                ModifiedUserId = 2
            });
            return check;
        }

        public async Task<int> Delete(int Id)
        {
            var check = await _repository.ExecuteNonQuery("CustomerDelete", new
            {
                Id = Id
            });
            return check;
        }
    }
}
