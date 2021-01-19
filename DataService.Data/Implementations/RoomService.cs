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
    public class RoomService: BaseService, IRoomService
    {
        public RoomService(IRepository repository) : base(repository)
        {

        }
        public async Task<RoomResponse> ListData(int PageIndex, int PageSize)
        {
            var data = await _repository.ExecuteReader<RoomRQPagination>("RoomSelect", new { pageIndex = PageIndex, pageSize = PageSize });
            return new RoomResponse
            {
                Data = data,
                Total = data.FirstOrDefault().Total
            };
        }
        public async Task<Room> GetById(int Id)
        {
            var room = await _repository.ExecuteReader<Room>("RoomGetById", new { Id = Id });
            return room.FirstOrDefault();
        }

        public async Task<int> Add(RoomRequest request)
        {
            var check = await _repository.ExecuteNonQuery("RoomInsert", new
            {
                Name = request.Name,
                RoomTypeId=request.RoomTypeId,
                Description = request.Description,
                CreatedUserId = 1
            });
            return check;
        }

        public async Task<int> Update(RoomRequest request)
        {
            var check = await _repository.ExecuteNonQuery("RoomUpdate", new
            {
                Id = request.Id,
                Name = request.Name,
                RoomTypeId = request.RoomTypeId,
                Description = request.Description,
                ModifiedUserId = 2
            });
            return check;
        }
        public Task<List<RoomMenuReponse>> RoomMenu(MenuTimeRequest request)
        {
            return _repository.ExecuteReader<RoomMenuReponse>("GetRoomReady", new
            {
                StartDate = request.StartDate,
                EndDate = request.EndDate
            });
        }
        public async Task<int> Delete(int Id)
        {
            var check = await _repository.ExecuteNonQuery("RoomDelete", new
            {
                Id = Id
            });
            return check;
        }
    }
}
