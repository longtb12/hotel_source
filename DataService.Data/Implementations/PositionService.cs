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
    public class PositionService : BaseService, IPositionService
    {
        public PositionService(IRepository repository) : base(repository)
        {

        }

        public async Task<PositionResponse> ListData(int PageIndex, int PageSize)
        {
            var data = await _repository.ExecuteReader<PositionRQPagination>("PositionSelect", new { pageIndex = PageIndex, pageSize = PageSize });
            return new PositionResponse
            {
                Data = data,
                Total = data.FirstOrDefault().Total
            };
        }
        public async Task<Position> GetById(int Id)
        {
            var position = await _repository.ExecuteReader<Position>("PositionGetById", new { Id = Id });
            return position.FirstOrDefault();
        }

        public async Task<int> Add(PositionRequest request)
        {
            var check = await _repository.ExecuteNonQuery("PositionInsert", new
            {
                Name = request.Name,
                PositionLevel = 1,
                Status = request.Status,
                Description = request.Description,
                CreatedUserId = 1
            });
            return check;
        }

        public async Task<int> Update(PositionRequest request)
        {
            var check = await _repository.ExecuteNonQuery("PositionUpdate", new
            {
                Id = request.Id,
                Name = request.Name,
                PositionLevel = 1,
                Status = request.Status,
                Description = request.Description,
                ModifiedUserId = 2
            });
            return check;
        }

        public async Task<int> Delete(int Id)
        {
            var check = await _repository.ExecuteNonQuery("PositionDelete", new
            {
                Id = Id
            });
            return check;
        }
    }
}
