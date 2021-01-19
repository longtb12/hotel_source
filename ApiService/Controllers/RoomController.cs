using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataServices.Interfaces;
using DataServices.Object.Request;
using Libraries.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using DataService.Data.Interfaces;
using DataService.Object.Request;
using DataService.Object.Model;
using System.Libraries.Extensions;
using DataServices.Object.Model;

namespace ApiService.Controllers
{
    [Route("v1.0/room")]
    [ApiController]
    public class RoomController : BaseController
    {
        private readonly IRoomService _roomService;
        private readonly IRoomTypeService _roomTypeService;
        private readonly IMemoryCache _memoryCache;
        public RoomController(ILogger<RoomController> logger, IMemoryCache memoryCache, IRoomService roomService,
            IRoomTypeService roomTypeService) : base(logger, memoryCache)
        {
            _roomService = roomService;
            _roomTypeService = roomTypeService;
            _memoryCache = memoryCache;
        }

        [HttpPost("get-pading")]
        public async Task<IActionResult> GetPading(TRequest<PaginationRequest> request)
        {
            var deparmentId = HttpContext.Session.GetObjectFromJson<User>("User");
            var response = new Response<object>();
            try
            {
                var roomTypes = await _roomTypeService.SelectAll();
                var rooms = await _roomService.ListData(request.value.pageIndex, request.value.pageSize);
                var paging = Convert.ToDouble(rooms.Total / request.value.pageSize);
                paging = (rooms.Total % request.value.pageSize == 0 ? paging : paging + 1);
                var total_page = Math.Round(paging, MidpointRounding.AwayFromZero);
                return Ok(new
                {
                    success = true,
                    message = "",
                    listdata = rooms,
                    roomTypes = roomTypes,
                    total_page = total_page
                });
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message + "," + ex.InnerException;
            }
            return Ok(response);
        }

        [HttpPost("get-by-id")]
        public async Task<IActionResult> GetById(TRequest<int> request)
        {
            var response = new Response<object>();
            try
            {
                response.Data = await _roomService.GetById(request.value);
                response.Success = true;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message + "," + ex.InnerException;
            }
            return Ok(response);
        }

        [HttpPost("save")]
        public async Task<IActionResult> Save(TRequest<RoomRequest> request)
        {
            if (request == null)
                return NotFound();
            var response = new Response<int>();
            try
            {
                if (request.value.Id == 0)
                {
                    response.Data = await _roomService.Add(request.value);
                    response.Message = "Thêm thành công";
                    response.Success = true;
                }
                else
                {
                    response.Data = await _roomService.Update(request.value);
                    response.Message = "Sửa thành công";
                    response.Success = true;
                }
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message + "," + ex.InnerException;
            }
            return Ok(response);
        }

        [HttpPost("deleted")]
        public async Task<IActionResult> Delete(TRequest<int> request)
        {
            var response = new Response<object>();
            try
            {
                response.Data = await _roomService.Delete(request.value);
                response.Success = true;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message + "," + ex.InnerException;
            }
            return Ok(response);
        }
    }
}
