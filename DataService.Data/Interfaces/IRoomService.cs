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
    public interface IRoomService
    {
        Task<RoomResponse> ListData(int PageIndex, int PageSize);
        Task<Room> GetById(int Id);
        Task<int> Add(RoomRequest request);
        Task<int> Update(RoomRequest request);
        Task<int> Delete(int Id);
        Task<List<RoomMenuReponse>> RoomMenu(MenuTimeRequest request);
    }
}
