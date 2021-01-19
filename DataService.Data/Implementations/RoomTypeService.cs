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
    public class RoomTypeService : BaseService, IRoomTypeService
    {
        public RoomTypeService(IRepository repository) : base(repository)
        {

        }
        public async Task<RoomTypeResponse> ListData(int PageIndex, int PageSize)
        {
            var data = await _repository.ExecuteReader<RoomTypeRQPagination>("RoomTypeSelect", new { pageIndex = PageIndex, pageSize = PageSize });
            return new RoomTypeResponse
            {
                Data = data,
                Total = data.FirstOrDefault().Total
            };
        }
        public async Task<RoomType> GetById(int Id)
        {
            var roomType = await _repository.ExecuteReader<RoomType>("RoomTypeGetById", new { Id = Id });
            return roomType.FirstOrDefault();
        }

        public async Task<int> Add(RoomTypeRequest request)
        {
            var check = await _repository.ExecuteNonQuery("RoomTypeInsert", new
            {
                Name = request.Name,
                Price = request.Price,
                Description = request.Description,
                CreatedUserId = 1
            });
            return check;
        }

        public async Task<int> Update(RoomTypeRequest request)
        {
            var check = await _repository.ExecuteNonQuery("RoomTypeUpdate", new
            {
                Id = request.Id,
                Name = request.Name,
                Price = request.Price,
                Description = request.Description,
                ModifiedUserId = 2
            });
            return check;
        }

        public async Task<int> Delete(int Id)
        {
            var check = await _repository.ExecuteNonQuery("RoomTypeDelete", new
            {
                Id = Id
            });
            return check;
        }
        public async Task<List<RoomType>> SelectAll()
        {
            return await _repository.ExecuteReader<RoomType>("RoomTypeSelectAll", new { });
        }
    }
}
