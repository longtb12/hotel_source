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
    [Route("v1.0/home")]
    [ApiController]
    public class HomeController : BaseController
    {
        private readonly IRoomService _roomService;
        private readonly IRoomTypeService _roomTypeService;
        private readonly IMemoryCache _memoryCache;
        private readonly IGiaoDichService _giaoDichService;
        public HomeController(ILogger<HomeController> logger, IMemoryCache memoryCache, IRoomService roomService,
            IRoomTypeService roomTypeService,IGiaoDichService giaoDichService) : base(logger, memoryCache)
        {
            _giaoDichService = giaoDichService;
            _roomService = roomService;
            _roomTypeService = roomTypeService;
            _memoryCache = memoryCache;
        }

        [HttpPost("get-menu")]
        public async Task<IActionResult> Get(TRequest<MenuTimeRequest> request)
        {
            var response = new Response<object>();
            try
            {
                var rooms = await _roomService.RoomMenu(request.value);
                return Ok(new
                {
                    success = true,
                    message = "",
                    listdata = rooms
                });
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message + "," + ex.InnerException;
            }
            return Ok(response);
        }

        [HttpPost("save")]
        public async Task<IActionResult> SaveGD(TRequest<Customer_GDRequest> request)
        {
            var response = new Response<object>();
            try
            {
                var check = _giaoDichService.SaveGD(request.value);
                return Ok(new
                {
                    success = true,
                    message = ""
                });
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
