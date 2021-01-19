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
    public interface IPositionService
    {
        Task<PositionResponse> ListData(int PageIndex, int PageSize);
        Task<Position> GetById(int Id);
        Task<int> Add(PositionRequest request);
        Task<int> Update(PositionRequest request);
        Task<int> Delete(int Id);
    }
}
