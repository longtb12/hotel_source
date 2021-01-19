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
    public interface IRoomTypeService
    {
        Task<RoomTypeResponse> ListData(int PageIndex, int PageSize);
        Task<RoomType> GetById(int Id);
        Task<int> Add(RoomTypeRequest request);
        Task<int> Update(RoomTypeRequest request);
        Task<int> Delete(int Id);
        Task<List<RoomType>> SelectAll();
    }
}
