using System;
using System.Collections.Generic;
using System.Text;
using DataServices.Interfaces;
using DataAccess.Repositories.Interfaces;
using DataServices.Object.Request;
using System.Threading.Tasks;
using DataServices.Object.Model;
using System.Linq;
using DataService.Object.Request;
using DataService.Object.Model;
using DataService.Data.Interfaces;
using DataServices.Implementations;
using Libraries.Extensions;

namespace DataService.Data.Implementations
{
    public class GiaoDichService : BaseService, IGiaoDichService
    {
        public GiaoDichService(IRepository repository) : base(repository)
        {

        }

        public int SaveGD(Customer_GDRequest request)
        {
            return _repository.ExecuteNonQueryV2("InsertGiaoDich", new
            {
                UserId = request.UserId,
                FirstName =request.FirstName,
                LastName =request.LastName,
                IDCard =request.IDCard,
                Email =request.Email,
                PhoneNumber =request.PhoneNumber,
                Address =request.Address,
                Gender =request.Gender,
                Description =request.Description,
                CreatedUserId =request.UserId,
                Deposit =request.Deposit,
                Price =request.Price,
                Data= request.giaoDichs.Select(c => new {
                    StartDate = c.StartDate,
                    EndDate = c.EndDate,
                    Price = c.Price,
                    RoomId = c.RoomId
                }).ToList().ToDataTable()
            });

        }
    }
}
